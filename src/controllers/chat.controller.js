import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

//  Api: for create chat between two users. get two participants and check user exist if(exist){create chat}

// const createChat = asyncHandler(async (req, res) => {
//     try {
//         const { participants } = req.body;

//         if (!participants || participants.length !== 2) {
//             return res.status(400).json(new ApiError(400, "Two participants are required"));
//         }

//         const [participant1, participant2] = participants;

//         if (participant1 === participant2) {
//             return res.status(400).json(new ApiError(400, "Participants must be different users"));
//         }

//         // Validate users exist
//         const users = await User.find({ _id: { $in: participants } }).populate('contacts.contactsSaved.contact');
//         if (users.length !== 2) {
//             return res.status(400).json(new ApiError(400, "Some participants are not valid users"));
//         }

//         const user1 = users.find(u => u._id.toString() === participant1);
//         const user2 = users.find(u => u._id.toString() === participant2);

//         // Get contacts safely
//         const user1Contacts = (user1.contacts?.contactsSaved || []).map(c => c.contact?.phoneNumber || c.contact?._id.toString());
//         const user2Contacts = (user2.contacts?.contactsSaved || []).map(c => c.contact?.phoneNumber || c.contact?._id.toString());

//         const user1Identifier = user1.phoneNumber || participant1;
//         const user2Identifier = user2.phoneNumber || participant2;

//         const isUser1InUser2Contacts = user2Contacts.includes(user1Identifier);
//         const isUser2InUser1Contacts = user1Contacts.includes(user2Identifier);

//         if (!isUser1InUser2Contacts && !isUser2InUser1Contacts) {
//             return res.status(400).json(new ApiError(400, "At least one participant must be in the other's contact list"));
//         }

//         // Check if chat exists
//         const existingChat = await Chat.findOne({
//             participants: { $all: [participant1, participant2], $size: 2 }
//         });

//         if (existingChat) {
//             return res.status(200).json(new ApiResponse(200, existingChat, "Chat already exists"));
//         }

//         const chat = await Chat.create({ participants });
//         return res.status(200).json(new ApiResponse(200, chat, "Chat created successfully"));

//     } catch (error) {
//         console.log('Error:', error);
//         return res.status(500).json(new ApiError(500, error?.message || "Something went wrong"));
//     }
// });

//  UPDATED CODE //////////////////////////////////////////////////////////////////

const createChat = asyncHandler(async (req, res) => {
    try {
        const { participants } = req.body;

        if (!participants || participants.length !== 2) {
            return res.status(400).json(new ApiError(400, "Two participants are required"));
        }

        const [participant1, participant2] = participants;

        if (participant1 === participant2) {
            return res.status(400).json(new ApiError(400, "Participants must be different users"));
        }

        // Check if chat already exists (regardless of user validity)
        const existingChat = await Chat.findOne({
            participants: { $all: [participant1, participant2], $size: 2 }
        });

        if (existingChat) {
            return res.status(200).json(new ApiResponse(200, existingChat, "Chat already exists"));
        }

        // Check if users exist
        const users = await User.find({ _id: { $in: participants } }).populate('contacts.contactsSaved.contact');

        const user1 = users.find(u => u._id.toString() === participant1);
        const user2 = users.find(u => u._id.toString() === participant2);

        // Allow chat creation even if one or both users are not found
        let allowChatCreation = true;

        if (user1 && user2) {
            // Dono users ke contacts check karo
            const user1Contacts = (user1.contacts?.contactsSaved || []).map(c => c.contact?.phoneNumber || c.contact?._id.toString());
            const user2Contacts = (user2.contacts?.contactsSaved || []).map(c => c.contact?.phoneNumber || c.contact?._id.toString());

            const user1Identifier = user1.phoneNumber || participant1;
            const user2Identifier = user2.phoneNumber || participant2;

            const isUser1InUser2Contacts = user2Contacts.includes(user1Identifier);
            const isUser2InUser1Contacts = user1Contacts.includes(user2Identifier);

            if (!isUser1InUser2Contacts && !isUser2InUser1Contacts) {
                return res.status(400).json(new ApiError(400, "At least one participant must be in the other's contact list"));
            }
        }

        // Create chat (if not already existing, which we already checked above)
        const chat = await Chat.create({ participants });
        return res.status(200).json(new ApiResponse(200, chat, "Chat created successfully"));

    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json(new ApiError(500, error?.message || "Something went wrong"));
    }
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
