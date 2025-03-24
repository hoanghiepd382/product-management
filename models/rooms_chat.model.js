const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomChatSchema = new Schema ({
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    users: [
        {
            user_id: String,
            role: String
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
},
{
    timestamps: true,
}
);

const roomChat = mongoose.model('roomChat', roomChatSchema, 'rooms_chat');
module.exports = roomChat;