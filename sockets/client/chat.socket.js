const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = (req, res)=>{
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once('connection', (socket) => {
      socket.join(roomChatId);
        socket.on("CLIENT_SEND_MESSAGE", async (data)=>{
          let images = [];

          for (const image of data.images) {
            const link = await uploadToCloudinary(image);
            images.push(link);
          }
          const chat = new Chat({
            user_id: userId,
            room_chat_id: req.params.roomChatId,
            content: data.content,
            images: images
          });
          await chat.save();

          _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE",{
            userId: userId,
            fullName: fullName,
            content: data.content,
            images: images
          });
        }); 
        
        socket.on("CLIENT_SEND_TYPING", async(type)=>{
          socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
            userId: userId,
            fullName: fullName,
            type: type,           
          });
        });
  });
}