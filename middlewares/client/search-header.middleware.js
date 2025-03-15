module.exports.searchForm = (req, res, next) =>{
    const hasDisplay = true;
    res.locals.display = hasDisplay;
    next();
}