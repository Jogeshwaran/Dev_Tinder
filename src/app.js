const express = require('express')
const {userAuth,adminAuth} = require('./middlewares/auth');
const connectDb = require('./config/database');
const userModel = require('./models/userModel');
//creating instance of application
require('./config/database')
const app = express();

//creating post api to add dummy data to db

app.use(express.json())

// getApi 

app.get('/getUserByEmail', async (req,res) => {
    const email = req.body.email
    console.log(email);
    
    try{
        const users = await userModel.find({email : email})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send(users)
        }
        
    }catch{
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})

//feed api

app.get('/feed', async (req,res) => {  
    try{
        const users = await userModel.find({})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send(users)
        }
        
    }catch{
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})

app.get('/findById', async (req,res) => {  
    const id = req.body.id
    console.log(id);
    
    try{
        const users = await userModel.findById(id)
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send(users)
        }
        
    }catch{
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})
app.get('/findByage', async (req,res) => {  
    const age = req.body.age
    console.log(age);
    
    try{
        const users = await userModel.findOne({age : age})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send(users)
        }
        
    }catch{
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})
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
