module.exports = (totalProduct, objectPagination, query ) =>{
    objectPagination.totalPage = Math.ceil(totalProduct/objectPagination.limitPage);

    if (query.page){
        objectPagination.currentPage = parseInt(query.page);     
    }
    objectPagination.skip = (objectPagination.currentPage-1)*objectPagination.limitPage;
    return objectPagination;
}