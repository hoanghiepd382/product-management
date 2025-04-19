const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");
const roomsChat = require("../../models/rooms_chat.model");
const chatSocket = require("../../sockets/client/chat.socket");

module.exports.index = async (req, res) =>{
  const roomChatId = req.params.roomChatId;

  chatSocket(req,res); 

  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false
  });
  const roomChat = await roomsChat.findOne({
    _id: roomChatId
  });
  const roomChatMember = roomChat.users;
  const userFriend = await User.find({
    $and: [
      {_id: {$in: res.locals.user.friendList.map(user=>user.user_id)}},
      {_id: {$nin: roomChatMember.map(user=>user.user_id)}}
    ]
  }).select("fullName avatar statusOnline");
  roomChat.userNotMember = userFriend;

  for (const user of roomChatMember) {
    const infoMember = await User.findOne({
      _id: user.user_id,
      deleted: false
    }).select("fullName avatar statusOnline");

    user.infoMember = infoMember;
    if(roomChat.typeRoom == "friend"){
      const friend = await User.findOne({
       $and: [
        {_id: {$ne: res.locals.user.id}},
        {_id: {$in: roomChatMember.map(user=>user.user_id)}}
       ]
      }).select("fullName avatar");
      roomChat.infoFriend = friend;
    }
  }

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName");
    chat.infoUser = infoUser;
  }
    res.render("client/pages/chat/index", {
        pageTitle: "Trò chuyện",
        chats: chats,
        roomChat: roomChat
    })
}