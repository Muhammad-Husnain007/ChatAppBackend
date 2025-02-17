import { asyncHandler } from '../utils/AsyncHandler.js';
import { User } from '../models/user.model.js';
import { Status } from '../models/status.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { deleteFileFromCloudinary, fileUploadCloudinary } from '../utils/Fileupload.js';

const uploadStatus = asyncHandler(async (req, res) => {
  try {
    const { userId, mediaType } = req.body;

    const findUser = await User.findById(userId);
    if (!findUser) {
      throw new ApiError(404, 'User Id not Found');
    }

    const statusLocalPath = req.files?.status?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!statusLocalPath) {
      throw new ApiError(400, 'No file uploaded');
    }

    const uploadResponse = await fileUploadCloudinary(statusLocalPath);
    const uploadResponseThumbnail = await fileUploadCloudinary(thumbnailLocalPath);
    console.log('Upload Video Dura:', uploadResponse.duration)
    if (!uploadResponse || !uploadResponse.url) {
      throw new ApiError(500, 'File upload failed');
    }
    // if (!uploadResponseThumbnail || !uploadResponseThumbnail.url) {
    //   throw new ApiError(500, 'File upload failed');
    // }

    const newStatus = new Status({
      userId: findUser._id,
      mediaType: mediaType,
      mediaUrl: uploadResponse.url,
      videoDuration: mediaType === 'video' ? uploadResponse.duration : undefined,
      thumbnail: mediaType === 'video' ? uploadResponseThumbnail.url : undefined,
    });

    const savedStatus = await newStatus.save();
    return res.status(200).json(
      new ApiResponse(200, savedStatus, 'Status Upload Successfull')
    )

  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong");
  }
});

const getStatus = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const findUser = await User.findById(userId);
    if (!findUser) {
      throw new ApiError(404, 'User ID not found');
    }

    const status = await Status.find({ userId });
    if (!status) {
      throw new ApiError(404, 'Status not found for this user');
    }

    return res.status(200).json(
      new ApiResponse(200, status, 'Status retrieved successfully')
    );
  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong");
  }
});


const deleteStatus = asyncHandler(async (req, res) => {
  try {
    const { statusId } = req.params;
    const status = await Status.findByIdAndDelete(statusId)
    if (!status) {
      throw new ApiError(404, "Staus id not found")
    }
    const publicId = status.mediaUrl;
    console.log('public id:', publicId)
    const deleteFromCloud = await deleteFileFromCloudinary(publicId);

    if (!deleteFromCloud) {
      throw new ApiError(500, "Failed to delete file from Cloudinary");
    }

    return res.status(200).json(
      new ApiResponse(200, status, "Delete Status Successfull")
    )
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

export {
  uploadStatus,
  getStatus,
  deleteStatus
}