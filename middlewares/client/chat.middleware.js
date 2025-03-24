const User = require("../../models/user.model");
const roomChat = require("../../models/rooms_chat.model");


module.exports.isMemberChat = async (req, res, next) =>{
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;

    const existRoomChat = await roomChat.findOne({
        _id: roomChatId,
        "users.user_id": userId,
        deleted: false
    });
    if (existRoomChat){
        next();
    }
    else{
        res.redirect("/");
    }
}