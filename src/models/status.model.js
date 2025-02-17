import mongoose, { Schema } from "mongoose";

const StatusSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        mediaType: { type: String, enum: ['image', 'video'], required: true },
        mediaUrl: { type: String, required: true },
        videoDuration: { type: String, required: false},
        thumbnail: { type: String, required: false},

    },
    { timestamps: true }
);


export const Status = mongoose.model('Status', StatusSchema);
