const fs = require('fs');
const jwt = require('jsonwebtoken');

let defaultSercet = "thissercetaccess"

let accessData = JSON.parse(fs.readFileSync('./data/access.json', 'utf8'));

/**
 * 
 * get if the apiKey is in file ./data/access.json
 * 
 * @returns onSuccess() ? error
 * 
 */
exports.checkAccess = function (req, res, onSuccess) {
    let token = req.headers.authorization;

    let isAccess = false;

    let data = decodeToken(token);

    accessData.forEach((entity) => {

        if (entity.email == data.email) {
            isAccess = true;
        }
    })

    if (!isAccess || !data) {
        res.status(401).json({error: "Not Authorized"})
        return;
    }

    return onSuccess(data);
}

/**
 * 
 * get if the apiKey is in file ./data/access.json
 * 
 * @returns onSuccess() ? error
 * 
 */
exports.addClient = function (data) {
    let isEntity = false
    accessData.forEach((entity) => {
        if (entity.email == data) {
            isEntity = true
        }
    })

    if (!isEntity) {
        accessData.push({
            "email": data,
            "permission": getPermission(data)
        });
    }

    fs.writeFileSync("./data/access.json", JSON.stringify(accessData));

    return  !isEntity;
}

/**
 * 
 * @param {type} data
 * @returns {String} : {Boolean}
 * 
 * 
 */
exports.hasAccess = function (data) {

    client = {};
    let isEntity = false

    accessData.forEach((entity) => {
        if (entity.email == data) {
            client = entity;
            isEntity = true
            return;
        }
    })

    return isEntity ? genToken(client) : false;
}

function decodeToken(token) {
    if(token){
        return jwt.verify(token, defaultSercet);
    }
    
    return false;
}

function genToken(data) {
    return jwt.sign(data, defaultSercet);
}

/**
 * 
 * get get user permissions
 * 
 */
function getPermission(email) {
    // future code
    return {
        cart: true
    }
}

/**
 * 
 * get get user by apiKey
 * 
 * 
 */
exports.getUser = function (apiKey) {
    let accessData = JSON.parse(fs.readFileSync('./data/access.json', 'utf8'));
    let user = "";
    accessData.forEach((entity) => {
        if (entity.apiKey == apiKey) {
            user = entity.email;
        }
    })

    return user
}