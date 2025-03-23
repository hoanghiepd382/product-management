const User = require("../../models/user.model");


module.exports = async (res)=>{
    const MyUserId = res.locals.user.id;
    const myUser = await User.findOne({
      _id: MyUserId
    });

    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId)=>{

            //Thêm id của A vào acceptList của B
          const existInB = await User.findOne({
            _id: userId,
            acceptList: MyUserId
          });
          if (!existInB){
            await User.updateOne({
                _id: userId
            },{
                $push : {acceptList: MyUserId}
            });
          }
          
            //Thêm id của B vào requestList của A
          const existInA = await User.findOne({
            _id: MyUserId,
            requestList: userId
          });
          if (!existInA){
            await User.updateOne({
                _id: MyUserId
            },{
                $push: {requestList: userId}
            })
          }

          // Gửi số lượng yêu cầu kết bạn lại cho B
          const userB = await User.findOne({
            _id: userId
          });
          const cntAcceptB = userB.acceptList.length;
          socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT", {
            userId: userId,
            lengthAcceptList : cntAcceptB
          });

          // Gui info A hien thi ben B
          const infoA = await User.findOne({
            _id: MyUserId
          }).select("id fullName avatar");
          socket.broadcast.emit("SERVER_RETURN_INFO", {
            userId: userId,
            info: infoA
          })
        });

        socket.on("CLIENT_CANCEL_ADD_FRIEND", async (userId)=>{

          //Xóa id của A trong acceptList của B
          const existInB = await User.findOne({
            _id: userId,
            acceptList: MyUserId           
          });
          if (existInB){
            await User.updateOne({
              _id: userId
            },{
              $pull : {acceptList: MyUserId}
            });
          }

          // Xóa id của B trong requestList của A
          const existInA = await User.findOne({
            _id: MyUserId,
            requestList: userId
          });
          if (existInA){
            await User.updateOne({
              _id: MyUserId
            },{
              $pull: {requestList : userId}
            });
          }
          const userB = await User.findOne({
            _id: userId
          });
          const lengthAccept = userB.acceptList.length;
          socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT", {
            userId: userId,
            lengthAcceptList: lengthAccept
          });
          socket.broadcast.emit("SERVER_RETURN_ID_USER_CANCEL", {
            userIdA: MyUserId,
            userIdB: userId
          })
        });

        socket.on("CLIENT_REFUSE_FRIEND", async (userId)=>{

          // Xóa id của A trong acceptList của B
          const existInB = await User.findOne({
            _id: userId,
            acceptList: MyUserId
          });
          if (existInB){
            await User.updateOne({
              _id: userId
            },{
              $pull: {acceptList : MyUserId}
            });
          }
        });

        socket.on("CLIENT_ACCEPT_FRIEND", async (userId)=>{
          // Xóa id của B trong acceptList của A và thêm id của B vào friendList của A
          const existBinA = await User.findOne({
            _id: MyUserId,
            acceptList: userId
          });
         
          if (existBinA){
            await User.updateOne({
              _id: MyUserId
            },{
              $push : {
                friendList : {
                  user_id: userId,
                  room_chat_id: ""
                }
              },
              $pull: {acceptList : userId}
            });
          }
          // Xóa id của A trong requestList của B và thêm id của A vào friendList của B
          const existAinB = await User.findOne({
            _id: userId,
            requestList: MyUserId
          });
          if (existAinB){
            await User.updateOne({
              _id: userId
            },{
              $push : {
                friendList : {
                  user_id: MyUserId,
                  room_chat_id: ""
                }
              },
              $pull: {requestList : MyUserId}
            });
          }

        });

        socket.on("CLIENT_DELETE_FRIEND", async (userId) =>{

          //Xóa B khỏi friendList của A
          const friendIds = myUser.friendList.map(friend => friend.user_id);
          const existBinA = friendIds.includes(userId);
          if (existBinA){
            await User.updateOne({
              _id: MyUserId
            },{
              $pull: { friendList: { user_id: userId }}
            });
          }
          
          //Xóa A khỏi friendList của B
          const userB = await User.findOne({
            _id: userId
          });
          const friendIdsB = userB.friendList.map(friend => friend.user_id);
          const existAinB = friendIdsB.includes(MyUserId);
          if (existAinB){                    
            await User.updateOne({
              _id: userId
            },{
              $pull: { friendList: { user_id: MyUserId }}
            });
        }
    })
    });
}