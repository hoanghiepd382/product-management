import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js';

const upload = new FileUploadWithPreview('upload-images',{
    multiple: true,
    maxFileCount: 10
});

const formSendDate = document.querySelector(".inner-form");
if (formSendDate){
    formSendDate.addEventListener("submit", (e)=>{
        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray;
        console.log(images);
        if(content || images.length>0){
            socket.emit("CLIENT_SEND_MESSAGE",{
                content: content,
                images: images
            });
            e.target.elements.content.value="";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}

socket.on("SERVER_RETURN_MESSAGE", (data)=>{
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".inner-body");
    const boxTyping = document.querySelector(".inner-list-typing")

    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";

    const div = document.createElement("div");

    if(myId==data.userId){
        div.classList.add("inner-outgoing")
    }
    else{
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }
    if (data.content){
        htmlContent = `
            <div class="inner-content">${data.content}</div>
        `
    }
    if (data.images.length>0){
        htmlImages += `<div class="inner-images">` ;

        for (const image of data.images) {
            htmlImages += `<img src="${image}">`;
        }
        htmlImages += `</div>`;
    }
    
    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;
    body.insertBefore(div,boxTyping);
    body.scrollTop = body.scrollHeight;
    const gallery = new Viewer(div);
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

var timeOut;
const showTyping = ()=>{
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(()=>{
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    },3000);
}
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker){
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener('emoji-click', (event) =>{   
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;

        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();

        showTyping();
    });
    inputChat.addEventListener("keyup", ()=>{
        showTyping();
    });
}

const elementsListTyping = document.querySelector(".inner-list-typing");
if (elementsListTyping){
    socket.on("SERVER_RETURN_TYPING", (data)=>{
        if (data.type=="show"){
            const body = document.querySelector(".inner-body");
            const existTyping = elementsListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping){
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);
                boxTyping.innerHTML= `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;
                elementsListTyping.appendChild(boxTyping);
                body.scrollTop = body.scrollHeight;
            }     
        }
        else {
            const boxTypingRemove = elementsListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove){
                elementsListTyping.removeChild(boxTypingRemove);
            }
        }
    })
}

const bodyChatPreviewImage = document.querySelector(".inner-body");
if (bodyChatPreviewImage){
    const gallery = new Viewer(bodyChatPreviewImage);
}

