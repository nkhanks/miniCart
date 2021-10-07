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
}

---exists---

return {
  isAdded: bool
  error: string 
}

```

post /login - get apiKey using email

```
POST {
  email : string
}

return {
  token: string
}

--or--

return {
  error: string 
}
```

get -/cart/get/:itemID

```
return Cart Item Object or empty Object
```

post -/cart/update/:itemID


```
POST {
  qty : int but string
} 

return {
  isUpdate: bool
}

---not exists---

return {
  isUpdate: bool
  error: string 
}
```


get -/cart

```
return Array Cart Item Object or empty Array
```

post -/cart/add/:itemID 

```
POST {
  qty : int but string
  price : float but string
} 

return {
  isAdded: bool
}

```

post -/cart/remove/:itemID 

```
return {
  isRemoved: bool
}

```

post -/cart/empty
```
return {
  isRemoved: bool
}

```

post -/cart/delete
```
return {
  isDeleted: bool
}

```
