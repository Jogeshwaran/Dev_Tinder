const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middlewares/auth')

requestRouter.post('/sendConnectionRequest',userAuth, (req,res)=>{
    try {
        const user = req.user
        if(user){
            res.send(user.firstName + "sent a connection request")
        }
    } catch (error) {
        res.send("Error" + error.message)
    }
})

module.exports = requestRouter