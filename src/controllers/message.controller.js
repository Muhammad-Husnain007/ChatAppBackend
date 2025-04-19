import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from '../models/message.model.js';
import { Chat } from '../models/chat.model.js';
import { User } from '../models/user.model.js';
import { fileUploadCloudinary } from '../utils/Fileupload.js';
import { ContactNotSaved } from '../models/contact.model.js';


const sendMessage = asyncHandler(async (req, res, next) => {
  try {
    const { senderId, receiverId, type, content, voiceDuration } = req.body;
    const { chatId } = req.params;

    // 🔹 Fetch Chat & Users
    const [chatCollection, sender, receiver] = await Promise.all([
      Chat.findById(chatId),
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!chatCollection || !sender || !receiver) {
      return res.status(404).json({ message: "Chat, sender, or receiver not found" });
    }

    const receiverSaved = receiver.contacts?.contactsSaved || [];
    const receiverNotSaved = receiver.contacts?.contactsNotSaved || [];

const isSenderInReceiverSaved = receiverSaved.some(
  (c) => c?.contact?.toString() === senderId.toString()
);
const isSenderInReceiverNotSaved = receiverNotSaved.some(
  (c) => c?.user?.toString() === senderId.toString()
);

// 🔹 Already saved → Delete from notSaved if exists
if (isSenderInReceiverSaved) {
  const existingContact = await ContactNotSaved.findOne({
    sender: senderId,
    receiver: receiverId,
  });

  if (existingContact) {
    const deleted = await ContactNotSaved.deleteOne({ _id: existingContact._id });
    console.log("Deleted notSaved because already in saved list:", deleted.deletedCount);
  }
}
// 🔹 Not in saved or notSaved → Create notSaved entry
else if (!isSenderInReceiverNotSaved) {
  const contactNotSavedDoc = new ContactNotSaved({
    sender: senderId,
    receiver: receiverId,
    phoneNumber: sender.phoneNumber,
    displayProfile: sender.displayProfile,
  });
  await contactNotSavedDoc.save();
  console.log("New notSaved contact created");
}
    // 🔹 Create Message Data
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      type,
      chatId,
      status: "sent",
    };

    // 🔹 Handle Media Messages
    if (["image", "video", "pdf", "voice"].includes(type)) {
      const file = req.files?.media?.[0]?.path;
      if (!file) {
        return res.status(400).json({ message: `${type} file is required` });
      }

      const uploadedFile = await fileUploadCloudinary(file);
      if (!uploadedFile?.url) {
        return res.status(500).json({ message: "File upload failed" });
      }

      messageData.mediaUrl = uploadedFile.url;

      if (type === "voice") {
        if (!voiceDuration) {
          return res.status(400).json({ message: "Voice duration is required" });
        }
        messageData.voiceDuration = voiceDuration;
      }
    }
    // 🔹 Handle Text Message
    else if (type === "text") {
      if (!content) {
        return res.status(400).json({ message: "Text content is required" });
      }
      messageData.content = content;
    }
    else {
      return res.status(400).json({ message: "Invalid message type" });
    }

    // 🔹 Save Message
    const newMessage = new Message(messageData);
    await newMessage.save();

    // 🔹 Add Message to Chat
    chatCollection.chats = chatCollection.chats || [];
    chatCollection.chats.push(newMessage._id);
    await chatCollection.save();

    // 🔹 Success Response
    res.status(201).json({
      success: true,
      data: newMessage,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
});


const receiveMessage = asyncHandler(async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      throw new ApiError(404, "Chat Id not Found");
    }
    const chat = await Chat.findById(chatId).populate('chats'); 
    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    const messages = chat;
   
    return res.status(200).json(
      new ApiResponse(200, messages , "Messages received successfully")
    );
  } catch (error) {
    throw new ApiError(500, error?.message, "Something went wrong");
  }
});

// Update a specific message by messageId
const updateMessage = asyncHandler(async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    if (!messageId) {
      throw new ApiError(404, "Message Id not Found");
    }

    // Update message content
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $set: { content } },
      { new: true } // Return updated message
    );

    return res.status(200).json(
      new ApiResponse(200, message, "Message updated successfully")
    );
  } catch (error) {
    throw new ApiError(500, error?.message, "Something went wrong");
  }
});

// Retrieve a message by messageId
const getByIdMessage = asyncHandler(async (req, res) => {
  try {
    const { messageId } = req.params;
    if (!messageId) {
      throw new ApiError(404, "Message Id not Found");
    }

    const message = await Message.findById(messageId); // Find message by Id
    return res.status(200).json(
      new ApiResponse(200, message, "Message retrieved by Id successfully")
    );
  } catch (error) {
    throw new ApiError(500, error?.message, "Something went wrong");
  }
});

// Delete a message by messageId
const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const { messageId } = req.params;
    if (!messageId) {
      throw new ApiError(404, "Message Id not Found");
    }

    // Delete message
    const message = await Message.findByIdAndDelete(messageId);

    return res.status(200).json(
      new ApiResponse(200, message, "Message deleted successfully")
    );
  } catch (error) {
    throw new ApiError(500, error?.message, "Something went wrong");
  }
});

export {
  sendMessage,
  receiveMessage,
  updateMessage,
  deleteMessage,
  getByIdMessage
};
