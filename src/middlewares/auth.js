const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const userAuth = async (req,res,next) => {
    //need to get the token
    // check token is valid
    // get the user from the token
    //send the user in the request
    try {
        const {token} = req.cookies
        if(!token){
            throw new Error ("Invalid token found, please login")
        }
        const loggedInUserId = await jwt.verify(token,"devTinder@2025")
        console.log('loggedInUserId',loggedInUserId);
        
        if(loggedInUserId){
            const user = await userModel.findById(loggedInUserId?._id)
            console.log(user);  
            req.user = user
            next()
        }else{
            throw new Error ("user not found")
        }
    } catch (error) {
        res.status(400).send("Error" + error.message)
    }
}

// const adminAuth =  (req,res,next) =>{
//     console.log('Authenticating');
//     const token = "abcd"
//     let adminAuthentication = token === "abcd"
//     if(!adminAuthentication){
//         res.status(401).send("Unauthorised User")
//     }else{
//         next()
//     }
// }

module.exports={userAuth}