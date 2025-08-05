const express = require('express')

//creating instance of application

const app = express();

//request handler function

//Use app.get() instead of app.use() for specific routes, and don’t use / with app.use() like that unless you’re using middleware.

app.get("/",(req,res)=>{
    res.send("testing request")
})

app.get("hello",(req,res)=>{
    res.send("Hellow hellow hellow")
})

app.get("test",(req,res)=>{
    res.send("Hello from the server,otha")
})

app.listen(7777,()=>{
    console.log(
    "Successfully listening on port 1000")
})