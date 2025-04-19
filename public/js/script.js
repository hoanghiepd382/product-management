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

const formCreateAccount = document.querySelector("#form-edit-info");
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
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.style.padding = '10px 0';
        header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.padding = '15px 0';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
      }
      
      lastScrollTop = scrollTop;
    });
    
    // Format cart quantity with badge
    const cartLink = document.querySelector('a[href="/cart"]');
    if (cartLink) {
      const cartText = cartLink.textContent;
      const quantity = cartText.match(/\((\d+)\)/);
      
      if (quantity && quantity[1]) {
        const cartQuantity = quantity[1];
        cartLink.innerHTML = 'Giỏ hàng <span class="cart-badge"><span>' + cartQuantity + '</span></span>';
      }
    }
    
    // Add active class to current page link
    const currentLocation = window.location.pathname;
    const menuItems = document.querySelectorAll('.inner-menu > ul > li > a');
    
    menuItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentLocation || (href !== '/' && currentLocation.startsWith(href))) {
        item.classList.add('active');
        item.style.color = '#3f51b5';
        item.style.fontWeight = '600';
      }
    });
    
    // Add dropdown arrow to submenu
    const subMenus = document.querySelectorAll('.sub-menu > a');
    subMenus.forEach(menu => {
      menu.innerHTML += ' <i class="fas fa-chevron-down" style="font-size: 10px; margin-left: 3px;"></i>';
    });
  });

const boxSearch = document.querySelector(".box-search");
if (boxSearch){
    const input = boxSearch.querySelector("input[name='keyword']");
    const boxSuggest = boxSearch.querySelector(".inner-suggest");
    input.addEventListener("keyup", ()=>{
        const keyword = input.value;

        const link = `/search/suggest?keyword=${keyword}`;

        fetch(link)
            .then(res => res.json())
            .then(data =>{
                const products = data.products;             
                if (products.length > 0){
                    boxSuggest.classList.add("show");

                    const htmls = products.map(product =>{
                        return `
                            <a href="/product/detail/${product.slug}"class="inner-item">
                                <div class="inner-image"><img src="${product.thumbnail}"/></div>
                                <div class="inner-info">
                                  <div class="inner-title">${product.title}</div>                               
                                </div> 
                            </a>                                                                                                       
                        `
                    });
                    const boxList = boxSuggest.querySelector(".inner-list");
                    boxList.innerHTML = htmls.join("");
                } else {
                    boxSuggest.classList.remove("show");
                }
            })
    })
}

const sort = document.querySelector("[sort-select]");
if (sort){
    let url = new URL (window.location.href);
    sort.addEventListener("change", (e)=>{
        const [sortKey, sortValue] = e.target.value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);
        
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

document.addEventListener("DOMContentLoaded", function () {
  const contactBox = document.querySelector("#contact-box");
  const contactToggle = document.querySelector("#contact-toggle");
  const contactLinks = document.querySelector("#contact-links");

  let isExpanded = false; // Mặc định thu gọn

  contactToggle.addEventListener("click", function () {
    if (isExpanded) {
      contactBox.classList.add("collapsed");
      contactLinks.classList.add("collapsed");
    } else {
      contactBox.classList.remove("collapsed");
      contactLinks.classList.remove("collapsed");
    }
    isExpanded = !isExpanded;
  });
});