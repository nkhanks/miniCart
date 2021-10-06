
var access = require('./lib/accessControl.js')
var cart = require('./lib/cart.js')



var fs = require('fs');
const {v4: uuidv4} = require('uuid');
const express = require('express')

const app = express()
const port = 3000


app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.post('/add-client', function (req, res)  {
    var accessData = JSON.parse(fs.readFileSync('./data/access.json', 'utf8'));

    var isEntity = false;
    var email = req.body.email;

    accessData.forEach((entity) => {
        if (entity.email == email) {
            isEntity = true
        }
    })

    if (!isEntity) {
        accessData.push({
            "apiKey": "",
            "email": email,
            "permission": access.getPermission(email)
        });
    }

    fs.writeFileSync("./data/access.json", JSON.stringify(accessData));

    res.status(200).json({isAdded: true});
})

app.post('/login', function (req, res)  {
    var accessData = JSON.parse(fs.readFileSync('./data/access.json', 'utf8'));

    var isEntity = false;
    var apiKey = uuidv4();
    var email = req.body.email;

    accessData.forEach((entity) => {
        if (entity.email == email) {
            isEntity = true
            entity.apiKey = apiKey;
        }
    })

    if (isEntity) {
        fs.writeFileSync("./data/access.json", JSON.stringify(accessData));
        res.status(200).json({token: apiKey});
    } else {
        res.status(401).json({error: "you are not registered"});
    }

})



app.get('/test-auth', function (req, res)  {

    
    access.checkAccess(req, res, (apiKey ,req, res) => {
 res.send("Works!!!");
    });

   

})

app.get('/cart/get/:itemID', function (req, res)  {
    
    access.checkAccess(req, res, (apiKey ,req, res) => {


            cart.init(apiKey);
            res.status(200).json(cart.get(req.params.itemID));


    });

})

app.post('/cart/update/:itemID', function (req, res)  {
    
    access.checkAccess(req, res, (apiKey ,req, res) => {

        if (("qty" in req.body)) {
            cart.init(apiKey);
            res.status(200).json({
                isUpdate: cart.update(req.params.itemID, req.body.qty),});

        } else {

            res.status(200).json({isUpdate: false});
        }

    });

})

app.get('/cart', function (req, res)  {
    
    access.checkAccess(req, res, (apiKey ,req, res) => {
        cart.init(apiKey);
        res.status(200).json(cart.getAll());
    });



})

app.post('/cart/add/:itemID', function (req, res)  {
    
    access.checkAccess(req, res, (apiKey ,req, res) => {
        if (("qty" in req.body) && ("price" in req.body)) {
            cart.init(apiKey);
            cart.add(req.params.itemID, req.body.price, req.body.qty)
            res.status(200).json({isAdded: true});
        } else {
            res.status(200).json({isAdded: false});
        }
    });


})

app.delete('/cart/remove/:itemID', function (req, res)  {
    
    access.checkAccess(req, res, (apiKey ,req, res) => {
        cart.init(apiKey);
        res.status(200).json({isRemoved: cart.remove(req.params.itemID)});

    });


})

app.post('/cart/empty', function (req, res)  {
    
    access.checkAccess(req, res, (apiKey ,req, res) => {
        cart.init(apiKey);
        res.status(200).json({isRemoved: cart.empty()});
    });


})

app.delete('/cart/delete', function (req, res)  {
    
    access.checkAccess(req, res, (apiKey ,req, res) => {
        res.status(200).json({isDeleted: cart.delete(apiKey)});
    });

})

// 400: Bad Request
app.use(function (req, res, next) {
    res.json(400, {ERROR: 'Bad Request'});
});

// 500: Error reporting
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ERROR: 'Something Went Wrong Try Again Late'});
});

app.listen(port, () => {
    console.log(`Cart Challenge at http://localhost:${port}`)
})
