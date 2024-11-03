import mongoose, { Schema, Document } from "mongoose";

interface IImage {
    url: string;
    publicId: string;
}

interface IRomanceScamReport extends Document {
    fullName: string;
    email: string;
    locationOfPartner?: string;
    country: string;
    personName: string;
    contactDuration: string;
    meetingPlace: string;
    otherMeetingPlace?: string;
    metInRealLife: string;
    whyNotMet?: string;
    communicationFrequency: string;
    discussionTopics: string;
    sharedPhotosVideos: string;
    photosAuthentic?: string;
    photoUpload?: IImage;
    askedForMoney: string;
    moneyAmount?: number;
    moneyPurpose?: string;
    personalInfoShared: string;
    suspiciousBehavior: string;
    submissionDate: Date;
}

const ImageSchema: Schema = new Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
});

const RomanceFormSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
   locationOfPartner: { type: String },
    country: { type: String, required: true },
    personName: { type: String, required: true },
    contactDuration: { type: String, required: true },
    meetingPlace: { type: String, required: true },
    otherMeetingPlace: { type: String },
    metInRealLife: { type: String, required: true },
    whyNotMet: { type: String },
    communicationFrequency: { type: String, required: true },
    discussionTopics: { type: String, required: true },
    sharedPhotosVideos: { type: String, required: true },
    photosAuthentic: { type: String },
    photoUpload: { type: ImageSchema },
    askedForMoney: { type: String, required: true },
    moneyAmount: { type: Number },
    moneyPurpose: { type: String },
    personalInfoShared: { type: String, required: true },
    suspiciousBehavior: { type: String, required: true },
    submissionDate: { type: Date, default: Date.now },
});

export default mongoose.models.RomanceScamReport || mongoose.model<IRomanceScamReport>("RomanceScamReport", RomanceFormSchema);