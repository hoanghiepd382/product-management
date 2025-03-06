const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("path");
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status");
            const currentId = button.getAttribute("data-id");

            const changeStatus = currentStatus == "active" ? "inactive" : "active";
            const action = path + `/${changeStatus}/${currentId}?_method=PATCH`;

            formChangeStatus.action = action;

            formChangeStatus.submit();
        })
    })
}

const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const checkAll = checkboxMulti.querySelector('input[name="checkall"]');
    const checkboxId = checkboxMulti.querySelectorAll('input[name="id"]');

    checkAll.addEventListener("click", () => {
        if (checkAll.checked) {
            checkboxId.forEach(box => {
                box.checked = true;
            })
        } else {
            checkboxId.forEach(box => {
                box.checked = false;
            })
        }
    });

    checkboxId.forEach(box => {
        box.addEventListener("click", () => {
            const countChecked = document.querySelectorAll('input[name="id"]:checked').length;
            if (countChecked == checkboxId.length) {
                checkAll.checked = true;
            } else {
                checkAll.checked = false;
            }
        });
    });
}

    const formChangeMulti = document.querySelector("[form-change-multi]");
    if (formChangeMulti){
        const showId = formChangeMulti.querySelector('input[name="ids"]');

        formChangeMulti.addEventListener("submit", (event) => {
            event.preventDefault();
            const boxChecked = checkboxMulti.querySelectorAll('input[name=id]:checked');

            const typeSelect = event.target.elements.type.value;
            if (typeSelect == "delete-all") {
                const confirmm = confirm("Bạn có chắc chắn muốn xóa những sản phẩm này?");
                if (!confirmm) {
                    return;
                }
            }
            if (boxChecked.length > 0) {
                let ids = [];
                boxChecked.forEach(item => {
                    const id = item.value;     
                    if (typeSelect == "change-position"){
                        const position = item.closest("tr").querySelector('input[name="position"]').value;
                        ids.push(`${id}-${position}`);
                    }
                    else{
                        ids.push(id);
                    }
                });
                showId.value = ids.join(', ');

                formChangeMulti.submit();
            } else {
                alert("Vui lòng chọn ít nhất 1 sản phẩm");
            }
            
        });
    }
    if (checkboxMulti){
        const buttonDelete = checkboxMulti.querySelectorAll("[data-item]");
        const formDelete = document.querySelector("#form-delete-product");

        buttonDelete.forEach(but => {
            but.addEventListener("click", () => {
                const checkDel = confirm("Bạn có chắc chắn muốn xóa sản phẩm này chứ?");
                const id = but.getAttribute("data-item");
                if (checkDel) {
                    console.log(id);
                    let path = formDelete.getAttribute("path");
                    let action = `${path}/${id}?_method=DELETE`;

                    formDelete.action = action;

                    formDelete.submit();
                }
            })
        })
    }
const showAlert = document.querySelector("[show-alert]");
if (showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

   
    closeAlert.addEventListener("click", ()=>{
        showAlert.classList.add("alert-hidden");
    });
}

const formCreateProduct = document.querySelector("#form-create-product");
if (formCreateProduct){
    const uploadImage = document.querySelector("[upload-image]");
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadPreview = uploadImage.querySelector("[upload-preview]");
    const container = uploadImage.querySelector('.image-preview-container');

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

const formEditProduct = document.querySelector("#form-edit-product");
if (formEditProduct){
    const uploadImage = document.querySelector("[upload-image]");
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadPreview = uploadImage.querySelector("[upload-preview]");
    const container = uploadImage.querySelector('.image-preview-container');

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
            container.style.display = "none";
        }
    });

    const deleteImage = uploadImage.querySelector(".delete-preview");
    deleteImage.addEventListener("click", ()=>{
        uploadImageInput.value = "";
        uploadPreview.removeAttribute("src");
        container.style.display = 'none'; 
    });
}

const sort = document.querySelector("[sort]");
if (sort){
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");

    let url = new URL (window.location.href);
    sortSelect.addEventListener("change", (e)=>{
        const [sortKey, sortValue] = e.target.value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);
        
        window.location.href = url.href;
    });

    sortClear.addEventListener("click", (e)=>{
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    });

    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    if (sortKey && sortValue){
        const optionValue = `${sortKey}-${sortValue}`;
        const optionChecked = sortSelect.querySelector(`option[value=${optionValue}]`);
        optionChecked.selected = true;
    }
}
