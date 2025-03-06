const formCreateAccount = document.querySelector("#form-create-account");
if (formCreateAccount){
    const uploadImage = document.querySelector("[upload-image]");
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadPreview = uploadImage.querySelector("[upload-preview]");
    const container = uploadImage.querySelector('.image-preview-container');
    console.log(uploadPreview);

    if (uploadPreview.src != window.location.href && uploadPreview.src != ""){
        container.style.display = "inline-block";
    }
    uploadImageInput.addEventListener("change", (e)=>{
        const file = e.target.files[0];
        if (file){
            uploadPreview.src = URL.createObjectURL(file);
            container.style.display = 'inline-block'; 
        }
        else{
            uploadPreview.src = "";
            container.style.display = 'none'; 
        }
    });

    const deleteImage = uploadImage.querySelector(".delete-preview");
    deleteImage.addEventListener("click", ()=>{
        uploadImageInput.value = "";
        uploadPreview.src = "";
        container.style.display = 'none'; 
    });
    
}