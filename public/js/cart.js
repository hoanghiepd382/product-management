const inputQuantity = document.querySelectorAll("input[name='quantity']");
if (inputQuantity.length > 0){
    inputQuantity.forEach(input =>{
        input.addEventListener("change", (e)=>{
            const productId = input.getAttribute("product-id");
            const quantity = input.value;
            

            window.location.href = `/cart/update/${productId}/${quantity}`
        })
        
    })
}


const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const checkAll = checkboxMulti.querySelector('input[name="checkall"]');
    const checkboxId = checkboxMulti.querySelectorAll('input[name="id"]');
    const totalDisplay = document.querySelector("#total-checked");

    const updateTotal = () => {
        let total = 0;
        checkboxId.forEach(box => {
          if (box.checked) {
            total += parseFloat(box.dataset.price); 
          }
        });
        totalDisplay.textContent = total.toLocaleString("vi-VN"); 
      };

    checkAll.addEventListener("click", () => {
        if (checkAll.checked) {
            checkboxId.forEach(box => {
                box.checked = true;
            });         

        } else {
            checkboxId.forEach(box => {
                box.checked = false;
            })
        }
        updateTotal();
    });

    checkboxId.forEach(box => {
        box.addEventListener("click", () => {
            const countChecked = document.querySelectorAll('input[name="id"]:checked').length;
            checkAll.checked = countChecked === checkboxId.length;
            updateTotal();
        });
    });
    updateTotal();
}