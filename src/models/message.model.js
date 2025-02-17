import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
   
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'voice', 'pdf'],
      default: 'text',
    },

    content: {
      type: String,
      required: function () {
        return this.type === 'text';
      },
    },

    mediaUrl: {
      type: String,
      required: function () {
        return ['image', 'video', 'file', 'voice'].includes(this.type);
      },
    },

    voiceDuration: {
      type: String,
      required: function () {
        return this.type === 'voice';
      },
    },

    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for optimization
MessageSchema.index({ sender: 1, receiver: 1 });

export const Message = mongoose.model('Message', MessageSchema);
