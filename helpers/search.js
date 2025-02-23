module.exports = (query)=>{
    let objectSearch = {
        keyword: ""
    };
    if (query.keyword){
        objectSearch.keyword = query.keyword;
        const regex = RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
}