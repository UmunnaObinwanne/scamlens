import mongoose, { Schema, Document } from "mongoose";

interface IImage {
    url: string;
    publicId: string;
}

interface IPlatformVerification extends Document {
    fullName: string;
    email: string;
    websiteURL: string;
    platformType: 'investment' | 'ecommerce' | 'crypto' | 'gaming' | 'social' | 'other';
    moneyInvolved: 'yes' | 'no';
    investmentAmount?: string;
    suspiciousFeatures: string;
    contactMethods: 'full' | 'limited' | 'none';
    screenshot: IImage;
    submissionDate: Date;
    riskAssessment: {
        riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
        riskFactors: string[];
        recommendations: string[];
        score: number;
    };
    detailedReport: {
        reportId: string;
        submissionDate: Date;
        platformDetailsName: string;
        platformDetailsType: string;
        platformDetailsContact: string;
        riskSummary: string;
        financialRequired: boolean;
        financialAmount: string;
        suspiciousDetails: string;
        suspiciousAnalyzed: string[];
        recommendationsImmediate: string[];
        recommendationsGeneral: string[];
        hasScreenshot: boolean;
        screenshotURL: string;
    };
}

const ImageSchema = new Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true }
});

const PlatformVerificationSchema = new Schema({
    fullName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    websiteURL: {
        type: String,
        required: true,
        match: [
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            'Please enter a valid URL'
        ]
    },
    platformType: {
        type: String,
        required: true,
        enum: ['investment', 'ecommerce', 'crypto', 'gaming', 'social', 'other']
    },
    moneyInvolved: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    investmentAmount: {
        type: String,
        required: function(this: IPlatformVerification) {
            return this.moneyInvolved === 'yes';
        }
    },
    suspiciousFeatures: {
        type: String,
        required: true,
        minLength: [10, 'Please provide a detailed description']
    },
    contactMethods: {
        type: String,
        required: true,
        enum: ['full', 'limited', 'none']
    },
    screenshot: {
        type: ImageSchema,
        required: true
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    riskAssessment: {
        riskLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            required: true
        },
        riskFactors: [{ type: String }],
        recommendations: [{ type: String }],
        score: { type: Number, required: true }
    },
    detailedReport: {
        reportId: { type: String, required: true, unique: true },
        submissionDate: { type: Date, required: true },
        platformDetailsName: { type: String, required: true },
        platformDetailsType: { type: String, required: true },
        platformDetailsContact: { type: String, required: true },
        riskSummary: { type: String, required: true },
        financialRequired: { type: Boolean, required: true },
        financialAmount: { type: String, required: true },
        suspiciousDetails: { type: String, required: true },
        suspiciousAnalyzed: [{ type: String }],
        recommendationsImmediate: [{ type: String }],
        recommendationsGeneral: [{ type: String }],
        hasScreenshot: { type: Boolean, required: true },
        screenshotURL: { type: String, required: true }
    }
});

// Indexes remain the same...

export default mongoose.models.PlatformVerification || 
    mongoose.model<IPlatformVerification>("PlatformVerification", PlatformVerificationSchema);