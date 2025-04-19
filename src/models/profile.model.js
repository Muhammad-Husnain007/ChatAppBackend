import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema({
    profile: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

}, { timestamps: true });

export const Profile = mongoose.model('Profile', profileSchema);