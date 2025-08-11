const express = require('express')
const profileRouter = express.Router()
const userModel = require('../models/userModel')
const {userAuth} = require('../middlewares/auth')

profileRouter.get("/getProfile",userAuth,  async (req,res)=>{
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

module.exports = profileRouter