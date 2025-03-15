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
})