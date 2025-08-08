const express = require('express')
const {userAuth,adminAuth} = require('./middlewares/auth');
const connectDb = require('./config/database');
const userModel = require('./models/userModel');
//creating instance of application
require('./config/database')
const app = express();

//creating post api to add dummy data to db

app.use(express.json())

app.post('/signup',async (req,res)=>{
    //creating instance of the model
    console.log(req.body);
    
    // const newUser = new userModel({
    //     firstName : 'gowthm',
    //     lastName : 'S',
    //     age : '27',
    //     gender : 'male',
    //     email : 'jokrish923@gmail.com',
    //     // PhoneNo : 
    // })

    const newUser = new userModel(req.body)

    //adding dynamic data reading from request sent

    try {
        await newUser.save()
        res.send('user Added successfully')
    } catch (error) {
        console.log(error);
        res.status(404).send('soemthing went wrong')
    }
})

connectDb().then(()=>{
    console.log('db connected success')
    app.listen(7777,()=>{
        console.log(
        "Successfully listening on port 7777")
    })
}).catch((error)=>{
    console.log(error);
})
