const express = require('express')
const profileRouter = express.Router()
const userModel = require('../models/userModel')
const {userAuth} = require('../middlewares/auth')
const validator = require('validator')
const bcrypt = require('bcrypt')
const { validateEditRequest, validatePasswordforChangePassword } = require('../utils/helperfunctions')

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

profileRouter.patch('/profile/edit', userAuth , async(req, res)=>{
    try {
        let isEditableObjectsValid =  validateEditRequest(req)
        if(!isEditableObjectsValid){
         throw new Error ("Invalid Edit Request")
        }
        const user = req.user
        console.log('userbefore', user);
        
        Object.assign(user,req.body)
        console.log('userafter', user);

        await user.save()

        res.send('user updated sucessfully' +  user)
        

    } catch (error) {
        res.send("ERROR : " + error.message)
    }

})

profileRouter.patch('/profile/changePassword', userAuth, async (req,res) => {
    try{
        const user = req?.user
        const {newPassword} = req.body
        let currentPassword = await validatePasswordforChangePassword(req, user)
        if(currentPassword){
        if(!validator.isStrongPassword(newPassword)){
            throw new Error ("Invalid password")
        }
        let passwordHash = await bcrypt.hash(newPassword,10)        
        let loggedInUser = userModel.findById(user?._id)
        loggedInUser.password = passwordHash        
        Object.assign(user,loggedInUser)
        user.save()
        res.send("passwordUpdated successfully" + user)
        
    }else{
        throw new Error ("Current password is not valid")
    }

    }catch(error){
        res.status(400).send("Error : " + error.message)
    }
    
})

module.exports = profileRouter