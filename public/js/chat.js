import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

const formSendDate = document.querySelector(".inner-form");
if (formSendDate){
    formSendDate.addEventListener("submit", (e)=>{
        e.preventDefault();
        const content = e.target.elements.content.value;

        if(content){
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value="";
        }
    });
}

socket.on("SERVER_RETURN_MESSAGE", (data)=>{
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".inner-body");
    let htmlFullName = "";

    const div = document.createElement("div");
    if(myId==data.userId){
        div.classList.add("inner-outgoing")
    }
    else{
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }
    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
});

const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

const buttonIcon = document.querySelector('.button-icon');
if (buttonIcon){
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

   buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown');
      }
}

const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker){
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener('emoji-click', (event) =>{
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
    });
    
    inputChat.addEventListener("keyup", ()=>{
        socket.emit("CLIENT_SEND_TYPING", "show");
    });
}
socket.on("SERVER_RETURN_TYPING", (data)=>{
    console.log(data);
})