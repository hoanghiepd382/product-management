// Gửi yêu cầu
const btnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (btnAddFriend.length>0){
   btnAddFriend.forEach(button =>{
    button.addEventListener("click", ()=>{
        const userId = button.getAttribute("btn-add-friend");
        button.closest(".box-user").classList.add("add");
        

        socket.emit("CLIENT_ADD_FRIEND", userId);
    })
   })
}

// Hủy gửi yêu cầu
const btnCancelAddFriend = document.querySelectorAll("[btn-cancel-friend]");
if (btnCancelAddFriend.length>0){
    btnCancelAddFriend.forEach(button=>{
        button.addEventListener("click", ()=>{
            const userId = button.getAttribute("btn-cancel-friend");
            button.closest(".box-user").classList.remove("add");

            socket.emit("CLIENT_CANCEL_ADD_FRIEND", userId);

        })
    })
}
const refuseFriend = (button)=>{
    button.addEventListener("click", ()=>{
        const userId = button.getAttribute("btn-refuse-friend");
        button.closest(".box-user").classList.add("refuse");
        socket.emit("CLIENT_REFUSE_FRIEND", userId);

    })
}
// Hủy yêu cầu kết bạn
const btnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (btnRefuseFriend.length>0){
    btnRefuseFriend.forEach(button=>{
        refuseFriend(button);
    })
}

const acceptFriend = (button)=>{
    button.addEventListener("click", ()=>{
        const userId = button.getAttribute("btn-accept-friend");
        button.closest(".box-user").classList.add("accepted");

        socket.emit("CLIENT_ACCEPT_FRIEND", userId);

    })
}

// Chấp nhận kết bạn

const btnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (btnAcceptFriend.length>0){
    btnAcceptFriend.forEach(button=>{
        acceptFriend(button);
    })
}

//Xóa bạn trong danh sách bạn bè
const btnDeleteFriend = document.querySelectorAll("[btn-delete-friend]");
if (btnDeleteFriend.length>0){
    btnDeleteFriend.forEach(button=>{
        button.addEventListener("click", ()=>{
            const hasDelete = confirm("Bạn chắc chắn muốn xóa người bạn này chứ");
            if (hasDelete){
                const userId = button.getAttribute("btn-delete-friend");
                button.closest(".box-user").classList.add("delete");

                socket.emit("CLIENT_DELETE_FRIEND", userId);
            }
        })
    })
}

//Cập nhật số lượng yêu cầu kết bạn
const countAccept = document.querySelector("[badge-users-accept]");
if (countAccept){
    const user_id = countAccept.getAttribute("badge-users-accept")
    socket.on("SERVER_RETURN_LENGTH_ACCEPT", (data)=>{
        if (user_id == data.userId){
            countAccept.innerHTML = data.lengthAcceptList;
        }
    })
}

// Hien thi A ben B
socket.on("SERVER_RETURN_INFO", (data)=>{
    const dataUserAccept = document.querySelector("[data-users-accept]");
    if (dataUserAccept){
    const userId = dataUserAccept.getAttribute("data-users-accept");
    if (userId == data.userId){
        const div = document.createElement("div");
        div.classList.add("col-6");
        div.setAttribute("user-id", data.info._id);
        div.innerHTML = `

<div class="box-user">
<div class="inner-avatar">
  <img src=${data.info.avatar} alt=${data.info.fullName}">
</div>
<div class="inner-info">
  <div class="inner-name">
    ${data.info.fullName}
  </div>
  <div class="inner-buttons">
    <button class="btn btn-sm btn-primary mr-1" 
            btn-accept-friend=${data.info._id}>
      Chấp nhận
    </button>
    <button class="btn btn-sm btn-secondary mr-1" 
            btn-refuse-friend=${data.info._id}>
      Xóa
    </button>
    <button class="btn btn-sm btn-secondary mr-1"
            btn-deleted-friend="" 
            disabled="">
      Đã xóa
    </button>
    <button class="btn btn-sm btn-secondary mr-1" 
            btn-accepted-friend="" 
            disabled="">
      Đã chấp nhận
    </button>
  </div>
</div>
</div>
`
    dataUserAccept.appendChild(div);
    const btnAcceptFriend = div.querySelector("[btn-accept-friend]");
    acceptFriend(btnAcceptFriend);

    const btnRefuseFriend = div.querySelector("[btn-refuse-friend]");
    refuseFriend(btnRefuseFriend);
    }
}

    // Xóa A bên danh sách kết bạn của B
    const dataUserNotFriend = document.querySelector("[data-user-not-friend]");
    const userId = dataUserNotFriend.getAttribute("data-user-not-friend");
    if (userId == data.userId){
        const boxUserRemove = document.querySelector(`[user-id="${data.info._id}"]`);
        if (boxUserRemove){
            dataUserNotFriend.removeChild(boxUserRemove);
        }
    }
})

socket.on("SERVER_RETURN_ID_USER_CANCEL", (data)=>{
    const boxUserRemove = document.querySelector(`[user-id='${data.userIdA}']`);
    if (boxUserRemove){
        const dataUserAccept = document.querySelector("[data-users-accept]");
        if (dataUserAccept.getAttribute("data-users-accept") == data.userIdB){
            dataUserAccept.removeChild(boxUserRemove);
        }
    }
})

//Hiển thị trạng thái hoạt động
socket.on("SERVER_RETURN_STATUS_ONLINE", (userId)=>{
    const dataUserStatusOnline = document.querySelector("[data-user-status-online]");
    if (dataUserStatusOnline){
        const boxUser = dataUserStatusOnline.querySelector(`[user-id="${userId}"]`);
        if (boxUser){
            const statusBox = boxUser.querySelector(".inner-status");
            statusBox.setAttribute("status", "online");
        }
    }
})
socket.on("SERVER_RETURN_STATUS_OFFLINE", (userId)=>{
    const dataUserStatusOnline = document.querySelector("[data-user-status-online]");
    if (dataUserStatusOnline){
        const boxUser = dataUserStatusOnline.querySelector(`[user-id="${userId}"]`);
        if (boxUser){
            const statusBox = boxUser.querySelector(".inner-status");
            statusBox.setAttribute("status", "offline");
        }
    }
})
