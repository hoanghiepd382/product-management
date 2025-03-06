module.exports = (query) =>{
    const filterButton = [
        {
           name : "Tất cả",
           class : "",
           status : "" 
        },
        {
            name : "Hoạt động",
            class : "",
            status : "active" 
        },
        {
            name : "Ngừng hoạt động",
            class : "",
            status : "inactive" 
        }
    ]

    if (query.status){
        const index = filterButton.findIndex(item => item.status == query.status);
        filterButton[index].class = "active";
    }
    else{
        const index = filterButton.findIndex(item => item.status =="");
        filterButton[index].class = "active";
    }
    return filterButton;
}
