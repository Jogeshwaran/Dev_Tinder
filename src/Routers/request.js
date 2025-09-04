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

requestRouter.post('/request/review/:status/:reqId', userAuth, async(req,res)=>{
    const {status,reqId} = req?.params
    const loggedInUser = req?.user
    //check status is valid
    console.log('hola',status,reqId)
    const acceptedStatus = ["accepted", "rejected"]
    if(!acceptedStatus.includes(status)){
        return res.status(400).send("staus Invalid")
    }
    //check in the db whether the connection request exists
    const connectionRequestValid = await requestModel.findOne({
        _id : reqId,
        toUserId : loggedInUser._id,
        status : "interested"
    })

    if(connectionRequestValid){
        connectionRequestValid.status = status
      const data =  await connectionRequestValid.save()
        res.json({message : "request" + status , data})
    }else{
        res.status(404).send("invalid")
    }
    

})

module.exports = requestRouter

// "email": "Bjohnson@example.com",
//   "password": "Bjohnson@123"