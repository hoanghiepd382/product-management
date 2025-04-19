const roomsChat = require("../../models/rooms_chat.model");
const User = require("../../models/user.model");

module.exports.index = async (req, res)=>{
    const roomChat = await roomsChat.find({
        "users.user_id": res.locals.user.id,
        deleted: false,
        typeRoom: "group"
    })
    res.render("client/pages/rooms-chat/index", {
        pageTitle: "Danh sách phòng chat",
        listRoomChat: roomChat
    })
}

module.exports.create = async (req, res)=>{
    const friendList = res.locals.user.friendList;

    for (const friend of friendList) {
        const infoFriend = await User.findOne({
            _id: friend.user_id,
            deleted: false
        }).select("fullName avatar");
        friend.infoFriend = infoFriend;
    } 

    res.render("client/pages/rooms-chat/create", {
        pageTitle: "Tạo phòng chat",
        friendList: friendList
    })
}

module.exports.createPost = async (req, res)=>{
    const title = req.body.title;
    const usersId = req.body.usersId;
    
    const dataRoom = {
        title: title,
        typeRoom: "group",
        users: []
    };
    if (Array.isArray(usersId)){
        for (const userId of usersId) {
            dataRoom.users.push({
                user_id: userId,
                role: "user"
            });
        }
    }
    else{
        dataRoom.users.push({
            user_id: usersId,
            role: "user"
        })
    }
    dataRoom.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    });
    const newRoomChat = new roomsChat(dataRoom);
    await newRoomChat.save();

    res.redirect(`/chat/${newRoomChat.id}`);
}