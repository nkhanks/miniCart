const fs = require('fs')  

let user = ""
let cartPath = ""
let cart = {}
/**
 * 
 * set user and cartPath( json file )
 * 
 * 
 */
exports.init = function(data)  {
    user = data.email;
    cartPath = "./data/"+data.email;;

    if(!fs.existsSync(cartPath) ){
        fs.writeFileSync(cartPath, JSON.stringify({
            items: [],
            total : 0
        }));
    }
    
    cart = JSON.parse(fs.readFileSync(cartPath, 'utf8'));
}

exports.add = function(itemID,price,qty)  {
    let isItem = false
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
    return cart;
}

exports.get = function(itemID)  {
    let needItem = {}

    cart.items.forEach((item) =>{
        if(item.itemID == itemID){ 
            needItem  = item
        }

    })

    return needItem;
}

exports.update = function(itemID,qty)  {

    let isUpdate = false;
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

exports.delete = function(data)  {

    user = data.email;;
    cartPath = "./data/"+user;
    

    if(fs.existsSync(cartPath) ){
        fs.unlinkSync(cartPath)
        return true;
    }
    return false;
}