const express = require('express')
const userRequestRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const requestModel = require('../models/ConnectionRequest')
const userModel = require('../models/userModel')

userRequestRouter.get('/user/requests/recieved', userAuth,async(req,res)=>{
    try {
        const user = req.user

        const connectionRequest = await requestModel.find({
            toUserId : user._id,
            status : 'interested'
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "image", "skills"])
       res.json({message : "data fetched sucess", data : connectionRequest})
    } catch (error) {
        res.status(404).send('Error' + error.message)
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

userRequestRouter.get('/user/feed', userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user
        const page = req?.query?.page || 1
        let limit = req?.query?.limit || 10
        limit > 50 ? limit = 2 : limit
        let skip = (page-1)*limit
        const connectionRequest = await requestModel.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        //store it in a set to get unique values of whom we not show in feed
        const hideFromFeed = new Set()
        connectionRequest.map((req)=>{
            console.log('req', req)
            hideFromFeed.add(req.fromUserId.toString())
            hideFromFeed.add(req.toUserId.toString())
        })
        console.log('hideFromFeed', hideFromFeed)

        const showInFeed = await userModel.find({
            $and : [
                {_id : {$nin : Array.from(hideFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
           
        }).select("firstName lastName age gender about image skills").skip(skip).limit(limit)
        res.send(showInFeed)

    }catch(error){
        res.status(400).send("ERROR " + error.message)
    }
})

module.exports = userRequestRouter