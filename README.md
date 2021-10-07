# miniCart

How start system.
```
npm start

```

dependencies:

``` 
npm install express

npm install jsonwebtoken
```



mini Auth Plus Cart

*use expressjs*

*all cart action are found cart.js*

*accessControl.js authorization of client*

authorization uses headers request 

## Structure For System

-| /data

---| access.json

-| /lib

---| accessControl.js

---| cart.js

-| index.js



## routes

post /add-client - adds client to data.json

```
POST {
  email : string
}

return {
  isAdded: bool
  error: string - only when isAdded is false
}
```

post /login - get apiKey using email

get -/cart/get/:itemID

post -/cart/update/:itemID [qty]

get -/cart

post -/cart/add/:itemID [qty,price]

post -/cart/remove/:itemID 

post -/cart/empty

post -/cart/delete
