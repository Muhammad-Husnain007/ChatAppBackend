import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema({
    members: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupName: {
        type: String,
        required: true,
    },
   
    groupAvatar: {
        type: String,
        required: true,
    },
   

}, { timestamps: true });

export const Group = mongoose.model('Group', groupSchema);