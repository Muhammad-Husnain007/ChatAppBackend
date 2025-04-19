import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    otp: {
        type: String
    },
    contacts: {
        contactsSaved:[{
        contact: {
            type: Schema.Types.ObjectId,
            ref: "Contact"
        },
        exists: {
            type: Boolean,
            default: false
        }
    }],

    contactsNotSaved: [{
        contact: {
            type: Schema.Types.ObjectId,
            ref: "ContactNotSaved"
        },
        saved: {
            type: Boolean,
            default: false
        }
    }],
  
    },
    
    displayProfile: [{
        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile"
        },
    }
],

    // refreshToken: {
    //     type: String,
    // },
    accessToken: {
        type: String,
    },

}, { timestamps: true });

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        phoneNumber: this.phoneNumber,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });
};

export const User = mongoose.model('User', userSchema);
