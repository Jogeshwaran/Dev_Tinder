const express = require('express')
const userRequestRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const requestModel = require('../models/ConnectionRequest')

userRequestRouter.get('/user/requests/recieved', userAuth,async(req,res)=>{
    try {
        const user = req.user

        const connectionRequest = await requestModel.find({
            toUserId : user._id,
            status : 'interested'
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "image", "skills"])
       connectionRequest && res.json({message : "data fetched sucess", data : connectionRequest})
    } catch (error) {
        req.statusCode(404).send('Error' + error.message)
    }
})

userRequestRouter.get('/user/connections', userAuth, async(req,res)=>{
    const user = req.user
    const connectionRequest = await requestModel.find({
        $or : [
            {toUserId : user._id, status : 'accepted'},
            {fromUserId : user._id, status : 'accepted'}
        ]
    }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "image", "skills"])
    .populate("toUserId", ["firstName", "lastName", "age", "gender", "about", "image", "skills"])
    const data = connectionRequest.map((res) => {
        if(res.fromUserId._id.toString() === user._id.toString()){
            return res.toUserId
        }else{
            return res.fromUserId
        }
    })
    res.json({data : data})
})

module.exports = userRequestRouter