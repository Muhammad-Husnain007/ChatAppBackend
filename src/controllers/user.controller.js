import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from '../models/user.model.js';
import jwt, { decode } from "jsonwebtoken";
import { Profile } from "../models/profile.model.js";

// Generate access and refresh tokens for a user
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong");
    }
};

// Refresh the access token using the refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized Token");
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid Token");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        const options = {
            httpOnly: true,
            secure: true,
        };

        res.cookie("accessToken", accessToken, options);
        // res.cookie("refreshToken", refreshToken, options);

        return res.status(200).json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Token Refresh Successful"
            )
        );
    } catch (error) {
        throw new ApiError(401, error.message || "Server Error");
    }
});

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { phoneNumber, name, email } = req.body;

        let user = await User.findOne({ phoneNumber });
        if (user) {
            throw new ApiError(400, "User with this phone number already exists");
        }

        user = await User.create({
            phoneNumber,
            name,
            email,
        });

        const accessToken = user.generateAccessToken();

        user.accessToken = accessToken;
        await user.save({ validateBeforeSave: false });

        const createdUser = await User.findById(user._id).select("-accessToken");

        // Response
        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    user: createdUser,
                    accessToken,
                },
                "User created and logged in successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});


// Retrieve all users and update their contacts and profiles
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find(req.user)
            .populate('contacts.contactsSaved.contact')
            .populate("contacts.contactsNotSaved", "phoneNumber displayProfile")
            .populate('displayProfile.profile');

        for (const user of users) {
            // Contacts check and update
            for (const contactObj of user.contacts.contactsSaved) {
                if (contactObj.contact && !contactObj.exists) {
                    const contactUser = await User.findOne({ 
                        phoneNumber: contactObj.contact.phoneNumber 
                    });

                    if (contactUser) {
                        contactObj.exists = true;
                        contactObj.contact = contactUser._id; 
                    }
                } 
                else if (contactObj.exists && contactObj.contact.user == null) {
                    const contactUser = await User.findOne({ 
                        phoneNumber: contactObj.contact.phoneNumber 
                    });

                    if (contactUser) {
                        contactObj.contact.user = contactUser._id;
                    }
                }
            }

            // Profile check and update
            for (const profileObj of user.displayProfile) {
                if (profileObj.profile && !profileObj.upload) {
                    const profileUser = await User.findOne({ 
                        phoneNumber: profileObj.profile.phoneNumber 
                    });

                    if (profileUser && profileUser.profile.length > 0) {
                        profileObj.upload = true;
                        profileObj.profile = profileUser.profile[0]._id;
                    }
                }
            }

            await user.save();
        }

        return res.status(200).json(new ApiResponse(
            200,
            users,
            "Users retrieved successfully"
        ));
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});

// Retrieve a specific user by ID
const getByIdUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        // console.log('Fetching user with ID:', userId);

        // Step 1: Fetch User and Populate Contacts
        const user = await User.findById(userId).populate({
            path: 'contacts.contactsSaved.contact',
            populate: {
                    path: 'displayProfile',
                    select: 'profile',
            },
        }).populate('contacts.contactsNotSaved')

        if (!user) {
            console.error(`User with ID ${userId} not found`);
            throw new ApiError(404, "User not found");
        }

        // Step 2: Validate and Update Contacts
        const updatedContacts = await Promise.all(
            user.contacts.contactsSaved.map(async (contactObj) => {
                if (contactObj.contact && !contactObj.exists) {
                    // Check if contact user exists by phone number
                    const contactUser = await User.findOne({ phoneNumber: contactObj.contact.phoneNumber });
                    if (contactUser) {
                        contactObj.exists = true;
                        contactObj.contact.user = contactUser._id;
                    }
                }
                return contactObj; // Return updated contact object
            })
        );

        // Step 3: Save Updated Contacts Back to User
        user.contacts.contactsSaved = updatedContacts;
        await user.save();

        // Step 4: Send Response
        return res.status(200).json(new ApiResponse(200, user, "User getById retrieve successfully"));

    } catch (error) {
        console.error('Error occurred:', error.message);
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});

// Delete a specific user by ID
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const deleteUser = await User.findByIdAndDelete(userId);

        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "User deleted successfully"
                )
            );
    } catch (error) {
        throw new ApiError(500, error?.message || "Server error while deleting user data");
    }
});

const getAccessToken = asyncHandler(async (req, res, next) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findById(userId);
      if (!user) {
        return next(new ApiError(404, 'User not found'));
      }
   
      return res.status(200).json(
        new ApiResponse(
          200,
          {accessToken: user?.accessToken},
          "Token retrieved successfully"
        )
      );
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'Internal Server Error', error));
    }
  });

  const verifyToken = asyncHandler(async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ valid: false, message: "Token is required" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('decoded:', decoded)

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ valid: false, message: "Invalid token" });
        }
        
        return res.status(200).json({ valid: true });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ valid: false, message: "Token has expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ valid: false, message: "Invalid token" });
        }

        return res.status(500).json({ valid: false, message: "Internal server error" });
    }
});
 
  

export {
    registerUser,
    getAllUsers,
    getByIdUser,
    deleteUser,
    refreshAccessToken,
    generateAccessAndRefreshTokens,
    getAccessToken,
    verifyToken,
};
