import { ContactNotSaved } from "../models/contact.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const importNotSaved = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔍 Confirm user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 📥 Get all not saved contacts *received* by this user
    const notSavedContacts = await ContactNotSaved.find({ receiver: userId })
    .populate({
      path: 'displayProfile',
      select: 'profile',
    })

    return res.status(200).json(
      new ApiResponse(200, notSavedContacts, "Contacts not saved retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong");
  }
});

export { importNotSaved };
