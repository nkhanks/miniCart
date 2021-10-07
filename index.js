
const access = require('./lib/accessControl.js')
const cart = require('./lib/cart.js')

const fs = require('fs');
const express = require('express')


const app = express()
const port = 3000


app.use(express.json());
app.use(express.urlencoded({extended: true}));


//Authorization Section
app.post('/add-client', function (req, res) {

    let isAdded = access.addClient(req.body.email)

    if (isAdded) {
        res.status(200).json({isAdded: isAdded});
    } else {
        res.status(200).json({isAdded: isAdded, error: "client already exists"});
    }

})

app.post('/login', function (req, res) {
    const token = access.hasAccess(req.body.email);

    if (!token) {
        res.status(401).json({error: "client does not exists"});
    } else {
        res.status(200).json({token: token});
    }

})



app.get('/test-auth', function (req, res) {


    access.checkAccess(req, res, (data) => {
        res.send("Works!!!");
    });

})

app.get('/cart/get/:itemID', function (req, res) {

    access.checkAccess(req, res, (data) => {
        cart.init(data);
        res.status(200).json(cart.get(req.params.itemID));
    });

})

app.post('/cart/update/:itemID', function (req, res) {

    access.checkAccess(req, res, (data) => {

        if (("qty" in req.body)) {
            cart.init(data);
            res.status(200).json({
                isUpdate: cart.update(req.params.itemID, req.body.qty), });

        } else {

            res.status(200).json({isUpdate: false});
        }

    });

})

app.get('/cart', function (req, res) {

    access.checkAccess(req, res, (data) => {
        cart.init(data);
        res.status(200).json(cart.getAll());
    });



})

app.post('/cart/add/:itemID', function (req, res) {

    access.checkAccess(req, res, (data) => {
        if (("qty" in req.body) && ("price" in req.body)) {
            cart.init(data);
            cart.add(req.params.itemID, req.body.price, req.body.qty)
            res.status(200).json({isAdded: true});
        } else {
            res.status(200).json({isAdded: false});
        }
    });


})

app.delete('/cart/remove/:itemID', function (req, res) {

    access.checkAccess(req, res, (data) => {
        cart.init(data);
        res.status(200).json({isRemoved: cart.remove(req.params.itemID)});

    });


})

app.post('/cart/empty', function (req, res) {

    access.checkAccess(req, res, (data) => {
        cart.init(data);
        res.status(200).json({isRemoved: cart.empty()});
    });


})

app.delete('/cart/delete', function (req, res) {

    access.checkAccess(req, res, (data) => {
        res.status(200).json({isDeleted: cart.delete(data)});
    });

})

// 400: Bad Request
app.use(function (req, res, next) {
    res.status(400).json( {error: 'Bad Request'});
});

// 500: Error reporting
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({error: 'Something Went Wrong Try Again Late'});
});

app.listen(port, () => {
    console.log(`Cart Challenge at http://localhost:${port}`)
})
