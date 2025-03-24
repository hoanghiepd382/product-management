const User = require("../../models/user.model");
const UsersSocket = require("../../sockets/client/users.socket");


module.exports.notFriend = async (req, res) =>{

    UsersSocket(res);

    const MyUserId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: MyUserId
    });
    const requestList = myUser.requestList;
    const acceptList = myUser.acceptList;
    const user = await User.find({
        $and: [
            {_id: {$ne: MyUserId}},
            {_id: {$nin: requestList}},
            {_id: {$nin: acceptList}}
        ],
        status: "active",
        deleted: false
    }).select("id fullName avatar");
    res.render("client/pages/users/not-friend",{
        pageTitle: "Danh sách người dùng",
        users: user
    })
}

module.exports.request = async (req, res) =>{
    UsersSocket(res);

    const MyUserId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: MyUserId
    });
    const requestList = myUser.requestList;
    const acceptList = myUser.acceptList;
    const user = await User.find({
        _id: {$in : requestList},
        status: "active",
        deleted: false
    }).select("id fullName avatar");
    res.render("client/pages/users/request",{
        pageTitle: "Lời mời đã gửi",
        users: user
    })
}


module.exports.accept = async (req, res) =>{
    UsersSocket(res);

    const MyUserId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: MyUserId
    });
    const requestList = myUser.requestList;
    const acceptList = myUser.acceptList;
    const user = await User.find({
        _id: {$in : acceptList},
        status: "active",
        deleted: false
    }).select("id fullName avatar");
    res.render("client/pages/users/accept",{
        pageTitle: "Yêu cầu kết bạn",
        users: user
    })
}

module.exports.listFriend = async (req, res) =>{
    await UsersSocket(res);

    const MyUserId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: MyUserId
    });
    const friendIds = myUser.friendList.map(friend => friend.user_id);
    const users = await User.find({
        _id: {$in : friendIds},
        status: "active",
        deleted: false
    }).select("id fullName avatar statusOnline");

    for (const user of users) {
        const infoUser = myUser.friendList.find(friend => friend.user_id==user.id);
        user.infoUser = infoUser;
    }

    res.render("client/pages/users/list-friend",{
        pageTitle: "Danh sách bạn bè",
        users: users
    })
}