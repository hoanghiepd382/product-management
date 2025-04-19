const unidecode = require("unidecode");

module.exports.converToSlug = (text) =>{
    const textSlug = unidecode(text);
    return textSlug.replace(/\s+/g, "-");
}