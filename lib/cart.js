const { getUser } = require("./accessControl");
const fs = require('fs')  

var user = ""
var cartPath = ""

/**
 * 
 * set user and cartPath( json file )
 * 
 * 
 */
exports.init = function(apiKey)  {
    user = getUser(apiKey);
    cartPath = "./data/"+user;

    if(!fs.existsSync(cartPath) ){
        fs.writeFileSync(cartPath, JSON.stringify({
            items: [],
            total : 0
        }));
    }
}

exports.add = function(itemID,price,qty)  {
    var cart = JSON.parse(fs.readFileSync(cartPath, 'utf8')); 
    
    var isItem = false
    cart.total = 0
    cart.items.forEach((item) =>{
        if(item.itemID == itemID){ 
            isItem = true
            item.qty += parseFloat(qty)
        }
        cart.total += item.price * item.qty
    })

    

    if(!isItem){
        cart.items.push({
            itemID : itemID,
            price : price,
            qty : parseFloat(qty)
        })

        cart.total += price * qty
    }

    return fs.writeFileSync(cartPath, JSON.stringify(cart));
}

exports.getAll = function()  {
    var cart = JSON.parse(fs.readFileSync(cartPath, 'utf8')); 
    return cart;
}

exports.get = function(itemID)  {
    var cart = JSON.parse(fs.readFileSync(cartPath, 'utf8')); 
    var needItem = {}

    cart.items.forEach((item) =>{
        if(item.itemID == itemID){ 
            needItem  = item
        }

    })

    return needItem;
}

exports.update = function(itemID,qty)  {
    var cart = JSON.parse(fs.readFileSync(cartPath, 'utf8')); 

    var isUpdate = false;
    cart.items.forEach((item) =>{
        if(item.itemID == itemID){ 
          isUpdate = true;
            item.qty  += qty
        }
        cart.total += item.price * item.qty
    })

    fs.writeFileSync(cartPath, JSON.stringify(cart));
    return isUpdate;
}

exports.remove = function(itemID)  {
    var cart = JSON.parse(fs.readFileSync(cartPath, 'utf8')); 

    newCart = {
        items: [],
        total : 0
    }

    cart.items.forEach((item) =>{
        if(item.itemID != itemID){  
            newCart.items.push(item);
        }
        newCart.total += item.price * item.qty
    })

    fs.writeFileSync(cartPath, JSON.stringify(newCart));

    return true;
}

exports.empty = function()  {
    fs.writeFileSync(cartPath, JSON.stringify({
        items: [],
        total : 0
    }));

    return true;
}

exports.delete = function(apiKey)  {

    user = getUser(apiKey);
    cartPath = "./data/"+user;
    

    if(fs.existsSync(cartPath) ){
        fs.unlinkSync(cartPath)
        return true;
    }
    return false;
}