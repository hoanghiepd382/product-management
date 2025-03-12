module.exports.generateRandomString = (lengths)=>{
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i=0; i<lengths; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
        
}

module.exports.generateRandomNumber = (lengths)=>{
    const characters = "0123456789";

    let result = "";

    for (let i=0; i<lengths; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
 
}