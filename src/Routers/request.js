const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const requestModel = require('../models/ConnectionRequest')
const userModel = require('../models/userModel')

requestRouter.post('/request/send/:status/:userId',userAuth, async (req,res)=>{
    try {
        const user = req.user
        let fromUserId = user?._id
        let toUserId = req?.params?.userId
        let status = req?.params.status
        console.log(fromUserId,toUserId,status);
        
       
        const AcceptedStatus = ["interested", "ignored"]
        if(!AcceptedStatus.includes(status)){
            return res.send("status Invalid")
        }

        let isValidToUserId = await userModel.findOne({_id : toUserId})
        console.log('isValidToUserId',isValidToUserId);
        if(!isValidToUserId){
            return res.send("Invalid User")
        }
        

        let validConnectionRequest = await requestModel.findOne({
            $or : 
            [
                {fromUserId, toUserId},
                {fromUserId : toUserId , toUserId : fromUserId}
            ]
        })  
        
        if(validConnectionRequest){
            return res.send("Connection request already exists")
        }

         let ConnectionRequest = new requestModel({
            fromUserId,
            toUserId,
            status
        })

        await ConnectionRequest.save()
        res.json({
            message : status == 'interested' ? ( user.firstName + "has sent request to" + isValidToUserId.firstName) : (user.firstName + "has ignored" + isValidToUserId.firstName)  ,
            ConnectionRequest
        })

    } catch (error) {
        res.send("Error" + error.message)
    }
})

module.exports = requestRouter

// "email": "Bjohnson@example.com",
//   "password": "Bjohnson@123"