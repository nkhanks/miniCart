const fs = require('fs');

/**
 * 
 * get if the apiKey is in file ./data/access.json
 * 
 * @returns onSuccess() ? error
 * 
 */
exports.checkAccess = function(req,res,onSuccess)  {
    var apiKey = req.headers.authorization;

    var isAccess = false;
    var accessData = JSON.parse(fs.readFileSync('./data/access.json', 'utf8')); 
       
        accessData.forEach((entity) =>{
           
                if(entity.apiKey == apiKey){ 
                   isAccess = true;
                }
            })
            
    if(!isAccess){
        res.status(401).json({ error: "Not Authorized" })
        return;
     }
       
    return onSuccess(apiKey,req,res) ;
}

/**
 * 
 * get get user permissions
 * 
 * 
 * 
 */
exports.getPermission = function(email)  {
    // future code
    return { 
        cart : true
    }
}

/**
 * 
 * get get user by apiKey
 * 
 * 
 */
exports.getUser = function(apiKey)  {
    var accessData = JSON.parse(fs.readFileSync('./data/access.json', 'utf8')); 
       var user = "";
        accessData.forEach((entity) =>{
                if(entity.apiKey == apiKey){ 
                   user = entity.email;
                }
            })
        
    return user
}