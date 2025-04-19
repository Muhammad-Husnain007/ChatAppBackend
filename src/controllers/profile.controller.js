import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Profile } from '../models/profile.model.js';
import { User } from '../models/user.model.js';
import { fileUploadCloudinary, deleteFileFromCloudinary } from "../utils/Fileupload.js"
import { Contact, ContactNotSaved } from "../models/contact.model.js";

// Function to handle profile upload and replace the existing profile with a new one
const Uploadprofile = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const profileLocalPath = req.files?.profile?.[0]?.path;

        if (!profileLocalPath) {
            throw new ApiError(400, "Profile is required");
        }

        const user = await User.findById(userId).populate('displayProfile.profile');
        
        // const contact = await Contact.find({ user: userId })
        // console.log('contact', contact);
        if (!user) {
            throw new ApiError(400, "UserId not found");
        }

        let oldProfile = user.displayProfile.find(dp => dp.profile);
        let oldProfileUrl = oldProfile ? oldProfile.profile.profile : null;

        const uploadProfile = await fileUploadCloudinary(profileLocalPath);
        if (!uploadProfile) {
            throw new ApiError(400, "Profile upload to cloud failed");
        }

        if (oldProfileUrl) {
            await deleteFileFromCloudinary(oldProfileUrl); 
        }


        const displayProfile = await Profile.create({ user: userId, profile: uploadProfile.url });
        
        user.displayProfile = [{ profile: displayProfile._id }];
        await ContactNotSaved.updateMany(
            { sender: userId },
            { $set: { displayProfile: displayProfile._id } } 
          );
        
        await Contact.updateMany(
            { user: userId },
            { $set: { displayProfile: displayProfile._id } },
            // {$set: { uploaded: true }}
        );
        // await ContactNotSaved.updateMany(
        //     { receiver: userId },
        //     { $set: { displayProfile: displayProfile._id } },
        //     // {$set: { uploaded: true }}
        // );
        await user.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                displayProfile,
                "Profile uploaded successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});

// Function to retrieve a profile by its profileId
const receiveProfile = asyncHandler(async (req, res) => {
    try {
        const { profileId } = req.params;
        if (!(profileId)) {
            throw new ApiError(400, "UserId not found");
        }
        const getProfile = await Profile.findById(profileId);
        return res.status(201)
            .json(new ApiResponse(
                200, getProfile, "Profile received successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});

// Function to retrieve the display profile associated with a user by userId
const receiveDP = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('displayProfile.profile');
        console.log('user', user);
        if (!user) {
            throw new ApiError(404, "User not found with this id");
        }
      const profile = user.displayProfile;
      console.log('profile', user);  
        return res.status(201).json(
            new ApiResponse(
                201,
                profile,
                "Profile by userId received successfully"
            )
        );
    } catch (error) {
     
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});

const receiveContactsProfile = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        // Find user and populate contactsSaved & contactsNotSaved profiles
        const user = await User.find({ _id: userId })
            .populate({
                path: "contacts.contactsSaved.contact",
                select: "displayProfile",
                populate: {
                    path: "displayProfile",
                    select: "profile"
                }
            });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Extract profiles from all contacts
        const profiles = user.map(x => {
            console.log(x.contacts.contactsSaved.map(y => y.contact.displayProfile));
            return x.contacts.contactsSaved.map(y => y.contact.displayProfile);
        });
        console.log("Contacts profile:", profiles);

        return res.status(200).json(
            new ApiResponse(
                200,
                profiles, 
                "Contacts Profile received successfully"
            )
        );

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});


export {
    Uploadprofile,
    receiveProfile,
    receiveDP,
    receiveContactsProfile,
}
