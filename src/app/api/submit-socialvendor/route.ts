import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from '../../../../Lib/db';
import SocialVendorVerification from "../../../../Models/SocialVendorSchema";
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface RiskAssessment {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  score: number;
  riskFactors: string[];
  recommendations: string[];
  summary: string;
}

function analyzeSocialVendorRisk(formData: any): RiskAssessment {
  let riskScore = 0;
  const riskFactors: string[] = [];
    const recommendations: string[] = [];
    

  // Account Authenticity Check
  if (!formData.hasBusinessProfile) {
    riskScore += 15;
    riskFactors.push('No business profile');
    recommendations.push('Verify business legitimacy through official documentation');
  }
  if (!formData.verifiedAccount) {
    riskScore += 10;
    riskFactors.push('Account not verified');
    recommendations.push('Look for verified badges or official verification');
  }

  // Payment Methods Risk
  const riskyPayments = ['crypto', 'gift cards', 'wire transfer', 'western union'];
  formData.paymentMethods.forEach((method: string) => {
    if (riskyPayments.includes(method.toLowerCase())) {
      riskScore += 20;
      riskFactors.push(`Risky payment method: ${method}`);
      recommendations.push('Use secure payment platforms with buyer protection');
    }
  });

  // Business Practices Risk
  if (formData.urgencyTactics) {
    riskScore += 25;
    riskFactors.push('Uses urgency tactics to push sales');
    recommendations.push('Be cautious of high-pressure sales tactics');
  }
  if (formData.limitedTimeOffers) {
    riskScore += 15;
    riskFactors.push('Frequent limited time offers');
    recommendations.push('Verify offer authenticity and don\'t rush purchases');
  }
  if (formData.requestsPersonalBanking) {
    riskScore += 30;
    riskFactors.push('Requests personal banking information');
    recommendations.push('Never share personal banking details');
  }
  if (formData.prePaymentRequired) {
    riskScore += 20;
    riskFactors.push('Requires full payment upfront');
    recommendations.push('Use escrow services or partial payment options');
  }

  // Account History Risk
  const followerCount = parseInt(formData.followersCount) || 0;
  if (followerCount < 1000) {
    riskScore += 15;
    riskFactors.push('Low follower count');
    recommendations.push('Verify business reputation through multiple sources');
  }

  // Specific Business Type Risks
  switch (formData.businessType) {
    case 'investment':
      riskScore += 25;
      riskFactors.push('High-risk investment business');
      recommendations.push('Verify regulatory compliance and licenses');
      break;
    case 'dropshipping':
      riskScore += 15;
      riskFactors.push('Dropshipping business model');
      recommendations.push('Check product quality and shipping policies');
      break;
  }

  // Customer Protection Risk
  if (!formData.hasRefundPolicy) {
    riskScore += 20;
    riskFactors.push('No clear refund policy');
    recommendations.push('Request written refund/return policy before purchase');
  }

  // Determine risk level
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  if (riskScore < 30) riskLevel = 'Low';
  else if (riskScore < 50) riskLevel = 'Medium';
  else if (riskScore < 75) riskLevel = 'High';
  else riskLevel = 'Critical';



  // Zero risk special case
  if (riskScore === 0) {
    return {
      riskLevel: 'Low',
      score: 0,
      riskFactors: ['No immediate risk factors detected'],
      recommendations: ['Use secure payment methods like PayPal', 'Never share credit/debit card details directly'],
      summary: 'Give out only what you can afford to give out. While no immediate risks were detected, always use secure payment platforms like PayPal. Never share your credit/debit card details directly.'
    };
  }

  
      if (riskScore > 0) {
  return {
    riskLevel,
    score: riskScore,
    riskFactors,
    recommendations,
    summary: `⚠️ IMPORTANT: There is a chance you might be at risk with this vendor. Our analysts will conduct thorough research and contact you within 24 hours. To protect your cash and investment, we advise you not to proceed with any transactions at this time. Please check your email (${formData.email}) for a detailed report from support@scamlens.io`
  };
}

  // Generate summary based on risk level
  const summary = `This ${formData.businessType} account on ${formData.socialMediaPlatform} has been assessed as ${riskLevel} risk. ${riskFactors.length > 0 ? 'Key concerns include ' + riskFactors.slice(0, 2).join(' and ') + '.' : ''} Please review our recommendations before proceeding.`;

  return {
    riskLevel,
    score: riskScore,
    riskFactors,
    recommendations,
    summary
  };
}

export async function POST(request: NextRequest) {
  await connectToMongoDB();

  try {
    const formData = await request.formData();
    
    // Handle screenshots upload
    let screenshotsData = [];
    const screenshotFiles = formData.getAll('screenshots');
    
    for (const file of screenshotFiles) {
      if (file && typeof file !== 'string') {
        try {
          const fileBuffer = Buffer.from(await (file as Blob).arrayBuffer());
          const fileBase64 = fileBuffer.toString('base64');
          const dataURI = `data:${file.type};base64,${fileBase64}`;

          const uploadResponse = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload(
              dataURI,
              {
                folder: 'social_vendor_screenshots',
                resource_type: 'auto',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result as UploadApiResponse);
              }
            );
          });

          screenshotsData.push({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
          });
        } catch (uploadError) {
          console.error("Error uploading screenshot:", uploadError);
        }
      }
    }

    if (screenshotsData.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one screenshot is required'
      }, { status: 400 });
    }

    // Extract form fields
    const formFields = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      socialMediaPlatform: formData.get('socialMediaPlatform') as string,
      accountUsername: formData.get('accountUsername') as string,
      accountURL: formData.get('accountURL') as string,
      businessType: formData.get('businessType') as string,
      businessCategory: formData.get('businessCategory') as string,
      priceRange: formData.get('priceRange') as string,
      paymentMethods: formData.getAll('paymentMethods') as string[],
      accountAge: formData.get('accountAge') as string,
      followersCount: formData.get('followersCount') as string,
      hasBusinessProfile: formData.get('hasBusinessProfile') === 'true',
      verifiedAccount: formData.get('verifiedAccount') === 'true',
      hasRefundPolicy: formData.get('hasRefundPolicy') === 'true',
      refundPolicyDetails: formData.get('refundPolicyDetails') as string,
      deliveryMethod: formData.getAll('deliveryMethod') as string[],
      urgencyTactics: formData.get('urgencyTactics') === 'true',
      limitedTimeOffers: formData.get('limitedTimeOffers') === 'true',
      requestsPersonalBanking: formData.get('requestsPersonalBanking') === 'true',
      prePaymentRequired: formData.get('prePaymentRequired') === 'true',
      suspiciousFeatures: formData.get('suspiciousFeatures') as string,
      screenshots: screenshotsData
    };

    // Validate required fields
    const requiredFields = [
      'fullName', 'email', 'socialMediaPlatform', 'accountUsername',
      'accountURL', 'businessType', 'businessCategory', 'priceRange',
      'paymentMethods', 'accountAge', 'followersCount', 'suspiciousFeatures'
    ];

    const missingFields = requiredFields.filter(field => !formFields[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Generate risk assessment
    const riskAssessment = analyzeSocialVendorRisk(formFields);

    // Create verification report
    const newReport = {
      ...formFields,
      riskAssessment,
      submissionDate: new Date()
    };

    // Save to database
    const savedReport = new SocialVendorVerification(newReport);
    await savedReport.save();

    // Return success response
    return NextResponse.json({
      success: true,
      report: savedReport,
      riskAssessment
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating social vendor verification:", error);
    return NextResponse.json(
      { success: false, error: 'Submission failed' },
      { status: 500 }
    );
  }
}