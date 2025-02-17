import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

//  Api: for create chat between two users. get two participants and check user exist if(exist){create chat}

const createChat = asyncHandler(async (req, res) => {
    const { participants } = req.body;

    if (!participants || participants.length !== 2) {
        throw new ApiError(400, "Two participants are required");
    }

    // Validate participants exist
    const validParticipants = await User.find({ _id: { $in: participants } });
    if (validParticipants.length !== participants.length) {
        throw new ApiError(400, "Some participants are not valid users");
    }

    const [participant1, participant2] = participants;

    // Check if a chat between these participants already exists
    const existingChat = await Chat.findOne({
        participants: { $all: [participant1, participant2], $size: 2 }
    });

    if (existingChat) {
        return res.status(200).json(
            new ApiResponse(200, existingChat, "Chat already exists")
        );
    }

    // Fetch both users and their contacts
    const user1 = await User.findById(participant1).populate('contacts.contactsSaved.contact');
    const user2 = await User.findById(participant2).populate('contacts.contactsSaved.contact');

    if (!user1 || !user2) {
        throw new ApiError(400, "One or both users do not exist");
    }

    // Extract contacts' phone numbers or IDs for comparison
    const user1Contacts = user1.contacts.contactsSaved.map(contactObj => contactObj.contact.phoneNumber || contactObj.contact._id.toString());
    const user2Contacts = user2.contacts.contactsSaved.map(contactObj => contactObj.contact.phoneNumber || contactObj.contact._id.toString());

    const participant1PhoneNumberOrId = user1.phoneNumber || participant1;
    const participant2PhoneNumberOrId = user2.phoneNumber || participant2;

    // Check if at least one participant is in the other's contact list
    const isUser1InUser2Contacts = user2Contacts.includes(participant1PhoneNumberOrId);
    const isUser2InUser1Contacts = user1Contacts.includes(participant2PhoneNumberOrId);

    if (!isUser1InUser2Contacts && !isUser2InUser1Contacts) {
        throw new ApiError(400, "At least one participant must be in the other's contact list");
    }

    // Create chat
    const chat = await Chat.create({ participants });
    return res.status(200).json(
        new ApiResponse(200, chat, "Chat created successfully")
    );
});

//  Api: for get users chats.

const getAllChats = asyncHandler(async (req, res) => {
    try {
        const chats = await Chat.find(req.users);
        return res.status(200)
            .json(new ApiResponse(
                200,
                chats,
                "Chats retrieved successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});

//  Api: for check participants alaredy exists.

const participantsExist = asyncHandler(async (req, res) => {
    try {
        const { participants } = req.body;
    
        const existingChat = await Chat.findOne({
          participants: { $all: participants }
        });
    
        if (existingChat) {
          return res.status(200).json({ success: true, data: existingChat });
        } else {
          return res.status(200).json({ success: false, message: 'No chat found' });
        }
      } catch (error) {
        console.error('Error finding chat:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
}); 

//  Api: for get by id of any chat.

const getByIdChat = asyncHandler(async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId);

        if (!chat) {
            throw new ApiError(404, "Chat not found");
        }
      const populate = await Chat.findById(chatId).populate('chats')
      
        return res.status(200)
            .json(new ApiResponse(
                200,
                populate,
                "Chat retrieved successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});

//  Api: for delete chat between users.

const deleteChat = asyncHandler(async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findByIdAndDelete(chatId);
        return res.status(200)
            .json(new ApiResponse(
                200,
                chat,
                "Chat deleted successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});

export {
    createChat,
    getAllChats,
    getByIdChat,
    deleteChat,
    participantsExist
};
