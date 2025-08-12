const express = require('express')
const authRouter = express.Router()
const {signUpDataValidator} = require('../utils/helperfunctions')
const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
const validator = require("validator")

//SignUpAPI
authRouter.post('/signup',async (req,res)=>{
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
//loginAPI
authRouter.post('/login', async (req,res)=>{
    try {
    const {email, password} = req.body
    if(!validator.isEmail(email)){
        throw new Error ("Invalid email format")
    }
    const user = await userModel.findOne({email : email})
    if(!user){
        throw new Error("Invalid Credentials")
    }    
    const passwordMatch = await user.validatePassword(password)
    console.log('models',passwordMatch);
    
    if(passwordMatch){
        //creating a jwt token
        //for creating it we need to send a identifier and a password that server knows
        let token = await user.getJwt()
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

authRouter.post('/logout', (req, res)=>{
    res.cookie('token', null , {expires : new Date (Date.now())}).send("user logged out successfully")
})

module.exports = authRouter;
