import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from '../../../../Lib/db'
import RomanceScamReport from "../../../../Models/RomanceFormSchema";
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  await connectToMongoDB();

  try {
    const formData = await request.formData();
    
    // Get conditional fields first
    const sharedPhotosVideos = formData.get('sharedPhotosVideos') as string;
      const photosAuthentic = formData.get('photosAuthentic') as string;
      const locationOfPartner = formData.get('locationOfPartner') as string;
    
    // Handle conditional file upload
    let photoUploadData = null;
    if (sharedPhotosVideos === 'yes' && photosAuthentic === 'yes') {
      const photoFile = formData.get('photoUpload');
      
      if (photoFile && typeof photoFile !== 'string') {
        try {
          const fileBuffer = Buffer.from(await (photoFile as Blob).arrayBuffer());
          const fileBase64 = fileBuffer.toString('base64');
          const dataURI = `data:${photoFile.type};base64,${fileBase64}`;

          const uploadResponse = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload(
              dataURI,
              {
                folder: 'romance_scam_photos',
                resource_type: 'auto',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result as UploadApiResponse);
              }
            );
          });

          photoUploadData = {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
          };
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          // Don't return error here, continue with form submission
          // Just log the error and continue without the photo
        }
      }
    }

    // Extract other form fields
    const formFields = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      country: formData.get('country') as string,
        address: formData.get('address') as string,
      locationOfPartner: formData.get('locationOfPartner') as string,
      personName: formData.get('personName') as string,
      contactDuration: formData.get('contactDuration') as string,
      meetingPlace: formData.get('meetingPlace') as string,
      otherMeetingPlace: formData.get('otherMeetingPlace') as string,
      metInRealLife: formData.get('metInRealLife') as string,
      whyNotMet: formData.get('whyNotMet') as string,
      communicationFrequency: formData.get('communicationFrequency') as string,
      discussionTopics: formData.get('discussionTopics') as string,
      sharedPhotosVideos,
        photosAuthentic,
      
      askedForMoney: formData.get('askedForMoney') as string,
      moneyAmount: formData.get('moneyAmount') as string,
      moneyPurpose: formData.get('moneyPurpose') as string,
      personalInfoShared: formData.get('personalInfoShared') as string,
      suspiciousBehavior: formData.get('suspiciousBehavior') as string,
    };

    // Validate required fields (excluding conditional ones)
    const requiredFields = [
      'fullName', 'email', 'country', 'address', 'personName',
      'contactDuration', 'meetingPlace', 'metInRealLife',
      'communicationFrequency', 'discussionTopics', 'sharedPhotosVideos',
      'askedForMoney', 'personalInfoShared', 'suspiciousBehavior'
    ];

    const missingFields = requiredFields.filter(field => !formFields[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Create new report object
    const newReport = {
      ...formFields,
      moneyAmount: formFields.moneyAmount ? parseFloat(formFields.moneyAmount) : undefined,
      photoUpload: photoUploadData, // Will be null if no photo was uploaded or if upload failed
      submissionDate: new Date(),
    };

    // Save to database
    const savedNewReport = new RomanceScamReport(newReport);
    await savedNewReport.save();

    return NextResponse.json({ 
      success: true, 
      report: savedNewReport
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating romance scam report:", error);
    return NextResponse.json(
      { success: false, error: 'Report submission failed' },
      { status: 500 }
    );
  }
}