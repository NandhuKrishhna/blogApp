import mongoose, { Document, Model, Schema } from "mongoose";


export interface IOtpDocument extends Document {
    userId: mongoose.Types.ObjectId;
    code: string
    expiresAt: Date;
    createdAt: Date;

}

const otpVerificationSchema = new Schema<IOtpDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    code: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OtpVerificationModel: Model<IOtpDocument> =
    mongoose.model<IOtpDocument>("OtpVerification", otpVerificationSchema, "otp_verification");
export default OtpVerificationModel;
