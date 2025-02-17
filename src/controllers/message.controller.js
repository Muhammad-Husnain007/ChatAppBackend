import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from '../models/message.model.js';
import { Chat } from '../models/chat.model.js';
import { User } from '../models/user.model.js';
import { fileUploadCloudinary } from '../utils/Fileupload.js';


const sendMessage = asyncHandler(async (req, res, next) => {
  try {
    const { senderId, receiverId, type, content, voiceDuration } = req.body;
    const { chatId } = req.params;

    console.log("Message Request Data:", req.body);
    
    // 🔹 Fetch Chat & Users
    const [chatCollection, sender, receiver] = await Promise.all([
      Chat.findById(chatId),
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!chatCollection || !sender || !receiver) {
      return res.status(404).json({ message: "Chat, sender, or receiver not found" });
    }

    // 🔹 Check if sender exists in receiver's contacts
    const isInSavedContacts = receiver.contacts.contactsSaved.includes(senderId);
    const isInNotSavedContacts = receiver.contacts.contactsNotSaved.includes(senderId);

    if (!isInSavedContacts && !isInNotSavedContacts) {
      receiver.contacts.contactsNotSaved.push(senderId);
      await receiver.save();
    }

    // 🔹 Create Message Object
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      type,
    };

    // 🔹 Handle File Upload for Media Messages (Image, Video, PDF)
    if (["image", "video", "pdf", "voice"].includes(type)) {
      const file = req.files?.media?.[0]?.path;
      console.log("file", file);

      if (!file) {
        return res.status(400).json({ message: `${type} file is required` });
      }

      const uploadedFile = await fileUploadCloudinary(file);
      if (!uploadedFile.url) {
        return res.status(500).json({ message: "File upload failed" });
      }
      console.log('upload file', uploadedFile.url);
      messageData.mediaUrl = uploadedFile.url;

      if (type === "voice") {
        if (!voiceDuration) return res.status(400).json({ message: "Voice duration is required" });
        messageData.voiceDuration = voiceDuration;
      }
    } 
    else if (type === "text") {
      if (!content) return res.status(400).json({ message: "Text content is required" });
      messageData.content = content;
    } 
    else {
      return res.status(400).json({ message: "Invalid message type" });
    }

    // 🔹 Save Message & Update Chat
    const newMessage = new Message(messageData);
    await newMessage.save();

    chatCollection.chats.push(newMessage._id);
    await chatCollection.save();

    // 🔹 Send Response
    res.status(201).json({
      success: true,
      data: newMessage,
      message: "Message sent successfully",
    });

  } catch (error) {
    next(error);
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
