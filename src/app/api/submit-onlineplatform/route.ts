import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from '../../../../Lib/db';
import PlatformVerification from "../../../../Models/PlatformVerificationSchema";
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Types
interface RiskAssessment {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskFactors: string[];
  recommendations: string[];
  score: number;
}

// Risk Assessment Function
function analyzePlatformRisk(formData: any): RiskAssessment {
  let riskScore = 0;
  const riskFactors: string[] = [];
  const recommendations: string[] = [];

  // Check money involvement
  if (formData.moneyInvolved === 'yes') {
    riskScore += 30;
    riskFactors.push('Platform requires monetary investment');
    recommendations.push('Verify platform\'s financial regulations compliance');
    
    const amount = parseFloat(formData.investmentAmount?.replace(/[^0-9.-]+/g, "") || '0');
    if (amount > 1000) {
      riskScore += 20;
      riskFactors.push('High investment amount required');
      recommendations.push('Research platform\'s financial history and verify registration');
    }
  }

  // Check contact methods
  if (formData.contactMethods === 'none') {
    riskScore += 25;
    riskFactors.push('No contact information available');
    recommendations.push('Legitimate platforms typically provide clear contact information');
  } else if (formData.contactMethods === 'limited') {
    riskScore += 15;
    riskFactors.push('Limited contact options');
    recommendations.push('Attempt to verify platform\'s physical presence');
  }

  // Platform type risks
  switch (formData.platformType) {
    case 'investment':
      riskScore += 20;
      riskFactors.push('Investment/Trading platform - higher inherent risk');
      recommendations.push('Verify regulatory compliance and licenses');
      break;
    case 'crypto':
      riskScore += 25;
      riskFactors.push('Cryptocurrency platform - high volatility risk');
      recommendations.push('Check platform\'s security measures and regulatory compliance');
      break;
    case 'gaming':
      riskScore += 15;
      riskFactors.push('Gaming/Gambling platform - potential regulatory concerns');
      recommendations.push('Verify gambling license and regulatory compliance');
      break;
  }

  // Analyze suspicious features
  const suspiciousKeywords = {
    'pressure': 20,
    'guarantee': 25,
    'urgent': 15,
    'quick': 10,
    'easy money': 25,
    'no risk': 20,
    'limited time': 15,
    'secret': 20
  };

  const features = formData.suspiciousFeatures.toLowerCase();
  Object.entries(suspiciousKeywords).forEach(([keyword, score]) => {
    if (features.includes(keyword)) {
      riskScore += score;
      riskFactors.push(`Contains suspicious keyword: ${keyword}`);
      recommendations.push(`Be cautious of platforms using "${keyword}" tactics`);
    }
  });

  // Determine risk level
  let riskLevel: RiskAssessment['riskLevel'];
  if (riskScore < 30) riskLevel = 'Low';
  else if (riskScore < 50) riskLevel = 'Medium';
  else if (riskScore < 75) riskLevel = 'High';
  else riskLevel = 'Critical';

  return {
    riskLevel,
    riskFactors,
    recommendations,
    score: riskScore
  };
}

export async function POST(request: NextRequest) {
  await connectToMongoDB();

  try {
    const formData = await request.formData();
    
    // Handle screenshot upload
    let screenshotData = null;
    const screenshotFile = formData.get('screenshot');
    
    if (screenshotFile && typeof screenshotFile !== 'string') {
      try {
        const fileBuffer = Buffer.from(await (screenshotFile as Blob).arrayBuffer());
        const fileBase64 = fileBuffer.toString('base64');
        const dataURI = `data:${screenshotFile.type};base64,${fileBase64}`;

        const uploadResponse = await new Promise<UploadApiResponse>((resolve, reject) => {
          cloudinary.uploader.upload(
            dataURI,
            {
              folder: 'platform_verification_screenshots',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as UploadApiResponse);
            }
          );
        });

        screenshotData = {
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        };
      } catch (uploadError) {
        console.error("Error uploading screenshot:", uploadError);
        return NextResponse.json({
          success: false,
          error: 'Failed to upload screenshot'
        }, { status: 400 });
      }
    }

    // Extract form fields
    const formFields = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      websiteURL: formData.get('websiteURL') as string,
      platformType: formData.get('platformType') as string,
      moneyInvolved: formData.get('moneyInvolved') as string,
      investmentAmount: formData.get('investmentAmount') as string,
      suspiciousFeatures: formData.get('suspiciousFeatures') as string,
      contactMethods: formData.get('contactMethods') as string,
      screenshot: screenshotData,
    };

    // Validate required fields
    const requiredFields = [
      'fullName',
      'email',
      'websiteURL',
      'platformType',
      'moneyInvolved',
      'suspiciousFeatures',
      'contactMethods'
    ];

    if (formFields.moneyInvolved === 'yes') {
      requiredFields.push('investmentAmount');
    }

    const missingFields = requiredFields.filter(field => !formFields[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Generate risk assessment
const riskAssessment = analyzePlatformRisk(formFields);

// Create the complete document
const currentDate = new Date();

// Simple, clear message for zero risk
const zeroRiskMessage = [
  'Give out only what you can afford to give out. While no immediate risks were detected, always use secure payment platforms like PayPal. Never share your credit/debit card details directly.'
];

const newReport = {
    ...formFields,
    submissionDate: currentDate,
    riskAssessment: {
        riskLevel: riskAssessment.riskLevel,
        riskFactors: riskAssessment.score === 0 
          ? ['No immediate risk factors detected'] 
          : riskAssessment.riskFactors,
        recommendations: riskAssessment.score === 0 
          ? zeroRiskMessage 
          : riskAssessment.recommendations,
        score: riskAssessment.score
    },
    detailedReport: {
        reportId: `PV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        submissionDate: currentDate,
        platformDetailsName: formFields.websiteURL,
        platformDetailsType: formFields.platformType,
        platformDetailsContact: formFields.contactMethods,
        riskSummary: riskAssessment.score === 0 
          ? 'No immediate risks detected. However, always prioritize secure payment methods.'
          : `This platform has been assessed as ${riskAssessment.riskLevel} risk based on the provided information.`,
        financialRequired: formFields.moneyInvolved === 'yes',
        financialAmount: formFields.investmentAmount || 'N/A',
        suspiciousDetails: formFields.suspiciousFeatures,
        suspiciousAnalyzed: riskAssessment.score === 0 
          ? ['No suspicious patterns detected'] 
          : riskAssessment.riskFactors,
        recommendationsImmediate: riskAssessment.score === 0 
          ? ['Give out only what you can afford to give out. Use secure payment platforms like PayPal. Never use credit/debit cards directly.']
          : riskAssessment.recommendations,
        recommendationsGeneral: riskAssessment.score === 0 
          ? ['Always use secure payment platforms like PayPal', 'Never share credit/debit card details']
          : [
              'Always conduct thorough due diligence',
              'Never invest more than you can afford to lose',
              'Be wary of platforms requiring urgent action',
              'Verify all regulatory compliance claims'
          ],
        hasScreenshot: !!screenshotData,
        screenshotURL: screenshotData?.url || 'Not provided'
    }
};


    // Save to database
    const savedReport = new PlatformVerification(newReport);
    await savedReport.save();

    return NextResponse.json({ 
      success: true, 
      report: savedReport.detailedReport,
      riskAssessment: savedReport.riskAssessment
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating platform verification report:", error);
    return NextResponse.json(
      { success: false, error: 'Report submission failed' },
      { status: 500 }
    );
  }
}