const express = require('express')
const connectDb = require('./config/database');
//creating instance of application
require('./config/database')
const app = express();
const cookieParser = require('cookie-parser')
const authRouter = require('./Routers/authRouters')
const profileRouter = require('./Routers/profileRouter')
const requestRouter = require('./Routers/request')
app.use(express.json())
app.use(cookieParser())

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)

connectDb().then(()=>{
    console.log('db connected success')
    app.listen(7777,()=>{
        console.log(
        "Successfully listening on port 7777")
    })
}).catch((error)=>{
    console.log(error);
})

