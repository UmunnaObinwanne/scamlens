import mongoose, { Schema, Document } from "mongoose";

interface IImage {
    url: string;
    publicId: string;
}

interface ISocialVendorVerification extends Document {
    // Basic Information
    fullName: string;
    email: string;
    socialMediaPlatform: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'telegram' | 'other';
    accountUsername: string;
    accountURL: string;
    businessType: 'retail' | 'investment' | 'services' | 'dropshipping' | 'other';
    
    // Business Details
    businessCategory: string;  // e.g., 'wigs', 'clothes', 'shoes', 'crypto', 'forex', etc.
    priceRange: string;  // e.g., '$10-$100'
    paymentMethods: string[];  // e.g., ['bank transfer', 'crypto', 'gift cards', etc.]
    
    // Verification Details
    accountAge: string;  // How long the account has been active
    followersCount: string;
    hasBusinessProfile: boolean;
    verifiedAccount: boolean;
    
    // Customer Protection
    hasRefundPolicy: boolean;
    refundPolicyDetails?: string;
    deliveryMethod?: string[];  // e.g., ['in-person', 'shipping', 'digital delivery']
    
    // Risk Indicators
    urgencyTactics: boolean;  // Using urgency to push sales
    limitedTimeOffers: boolean;
    requestsPersonalBanking: boolean;
    prePaymentRequired: boolean;
    
    // Evidence
    screenshots: IImage[];
    suspiciousFeatures: string;
    
    // Assessment
    riskAssessment: {
        riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
        score: number;
        riskFactors: string[];
        recommendations: string[];
        summary: string;
    };
    
    submissionDate: Date;
}

const ImageSchema = new Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true }
});

const SocialVendorSchema = new Schema({
    // Basic Information
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
    socialMediaPlatform: {
        type: String,
        required: true,
        enum: ['facebook', 'instagram', 'tiktok', 'whatsapp', 'telegram', 'other']
    },
    accountUsername: {
        type: String,
        required: true,
        trim: true
    },
    accountURL: {
        type: String,
        required: true
    },
    businessType: {
        type: String,
        required: true,
        enum: ['retail', 'investment', 'services', 'dropshipping', 'other']
    },

    // Business Details
    businessCategory: {
        type: String,
        required: true
    },
    priceRange: {
        type: String,
        required: true
    },
    paymentMethods: [{
        type: String,
        required: true
    }],

    // Verification Details
    accountAge: {
        type: String,
        required: true
    },
    followersCount: {
        type: String,
        required: true
    },
    hasBusinessProfile: {
        type: Boolean,
        default: false
    },
    verifiedAccount: {
        type: Boolean,
        default: false
    },

    // Customer Protection
    hasRefundPolicy: {
        type: Boolean,
        required: true
    },
    refundPolicyDetails: {
        type: String
    },
    deliveryMethod: [{
        type: String
    }],

    // Risk Indicators
    urgencyTactics: {
        type: Boolean,
        required: true
    },
    limitedTimeOffers: {
        type: Boolean,
        required: true
    },
    requestsPersonalBanking: {
        type: Boolean,
        required: true
    },
    prePaymentRequired: {
        type: Boolean,
        required: true
    },

    // Evidence
    screenshots: [ImageSchema],
    suspiciousFeatures: {
        type: String,
        required: true
    },

    // Assessment
    riskAssessment: {
        riskLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        riskFactors: [String],
        recommendations: [String],
        summary: {
            type: String,
            required: true
        }
    },

    submissionDate: {
        type: Date,
        default: Date.now
    }
});

// Indexes
SocialVendorSchema.index({ accountUsername: 1 });
SocialVendorSchema.index({ socialMediaPlatform: 1 });
SocialVendorSchema.index({ businessType: 1 });
SocialVendorSchema.index({ 'riskAssessment.riskLevel': 1 });
SocialVendorSchema.index({ submissionDate: -1 });

// Prevent duplicate reports within 24 hours
SocialVendorSchema.index(
    { accountUsername: 1, socialMediaPlatform: 1, submissionDate: 1 },
    { 
        unique: true,
        partialFilterExpression: {
            submissionDate: {
                $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        }
    }
);

    const SocialVendorModel = mongoose.models.SocialVendorVerification || 
    mongoose.model('SocialVendorVerification', SocialVendorSchema);

export default SocialVendorModel;