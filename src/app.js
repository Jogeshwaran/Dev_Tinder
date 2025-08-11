const express = require('express')
const {userAuth,adminAuth} = require('./middlewares/auth');
const connectDb = require('./config/database');
const userModel = require('./models/userModel');
//creating instance of application
require('./config/database')
const app = express();
const signUpDataValidator = require('./utils/helperfunctions')
const bcrypt = require('bcrypt')
const validator = require("validator")
const cookieParser = require('cookie-parser')
//creating post api to add dummy data to db
const jwtToken = require('jsonwebtoken')
app.use(express.json())
app.use(cookieParser())

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
        
    }catch(error){
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
        
    }catch(error){
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
        
    }catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})
app.post('/signup',async (req,res)=>{
    //creating instance of the model
    console.log(req.body);

    //creating a validator function
    
    // const newUser = new userModel({
    //     firstName : 'gowthm',
    //     lastName : 'S',
    //     age : '27',
    //     gender : 'male',
    //     email : 'jokrish923@gmail.com',
    //     // PhoneNo : 
    // })

    

    //adding dynamic data reading from request sent

    try {
        signUpDataValidator(req)
        const {firstName, lastName, email , phoneNo, password} = req.body
        const passwordHash =await bcrypt.hash(password, 10)
        console.log(passwordHash);
        
        const newUser = new userModel({
            firstName : firstName,
            lastName : lastName,
            email : email,
            phoneNo : phoneNo,
            password : passwordHash
        })
        await newUser.save()
        res.send('user Added successfully')
    } catch (error) {
        console.log(error);
        res.status(404).send('soemthing went wrong' + error)
    }
})

//login api

app.post('/login', async (req,res)=>{
    try {
    const {email, password} = req.body
    if(!validator.isEmail(email)){
        throw new Error ("Invalid email format")
    }
    console.log('password', password);
    

    const user = await userModel.findOne({email : email})
    if(!user){
        throw new Error("Invalid Credentials")
    }
    console.log(user);
    
    const passwordMatch = await bcrypt.compare(password, user?.password)
    console.log(passwordMatch);
    
    if(passwordMatch){
        //creating a jwt token
        //for creating it we need to send a identifier and a password that server knows
        let token = await jwtToken.sign({_id : user._id},"devTinder@2025",{ expiresIn: '1h' })
        res.cookie('token',token,{
            expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
          })
        res.send("Login sucessfull")
    }else{
        throw new Error("Invalid Cred")
    }
    } catch (error) {
        res.send("ERROR : " + error.message)
    }
    

})

//getprofileapi
app.use("/getProfile", userAuth, async (req,res)=>{
    try {
        //handled in Auth.js - middleware
        // const cookie = req.cookies
        // console.log(cookie);

        // let {token} = cookie
        // console.log('token', token);
        
        // if(!token){
        //     throw new Error ("Invalid token, please login")
        // }
        // const decodedToken = await jwtToken.verify(token,"devTinder@2025")
        // console.log('decodedToken', decodedToken?._id);

        let user = req.user        
        
        if(user){
            let loggedInUser = await userModel.findById(user?._id)
            res.send(loggedInUser)
        }else{
            throw new Error ("user not found")
        }
        
    } catch (error) {
        res.send("ERROR : " + error.message)
    }
})

//sendconnection request api

app.post('/sendConnectionRequest', userAuth, (req,res)=>{
    try {
        const user = req.user
        if(user){
            res.send(user.firstName + "sent a connection request")
        }
    } catch (error) {
        res.send("Error" + error.message)
    }
})

// delete 

app.delete('/user', async (req,res) => {  
    const email = req.body.email
    // console.log(age);
    
    try{
        const users = await userModel.deleteOne({email : email})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send('user Delted sucess')
        }
        
    }catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})

//patch 
app.patch('/user/:userId', async (req,res) => {  
    const id = req.params?.userId
    const data = req.body
    // console.log(age);
    
    try{
        const changeableData = ['phoneNo', 'password', 'about', 'image', 'skills',"age"]
        console.log(data);
        
        const allowedChangeableData = Object.keys(data).every((k)=>
            changeableData.includes(k)
        )
        console.log('allowedChangeableData', allowedChangeableData);
        
        if(!allowedChangeableData){
            throw new Error("Cannot modify restricted Data");
            
        }
        if(data?.skills.length > 10){
            throw new Error ("Cannot add more than 10 skills")
        }
        if(data?.about?.length > 100){
            throw new Error ("Cannot add more than 100 chars")
        }
        const users = await userModel.findByIdAndUpdate(id, data,{runValidators : true})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send('user Delted sucess')
        }
        
    }
    catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong' + error.message)
    }
})

app.put('/user', async (req,res) => {  
    const id = req.body.id
    const data = req.body
    // console.log(age);
    
    try{
        const users = await userModel.findOneAndReplace({_id : id}, data)
        if(users.length < 1){
            res.status(404).send('user replaced')
        }else{
            res.send('user Delted sucess')
        }
        
    }catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong' + error.message)
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
