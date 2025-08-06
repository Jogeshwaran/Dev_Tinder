const userAuth = (req,res,next) => {
    console.log('Authenticating user');
    const token = "abcd"
    let adminAuthentication = token === "abcd"
    if(!adminAuthentication){
        res.status(401).send("Unauthorised User")
    }else{
        next()
    }
}

const adminAuth =  (req,res,next) =>{
    console.log('Authenticating');
    const token = "abcd"
    let adminAuthentication = token === "abcd"
    if(!adminAuthentication){
        res.status(401).send("Unauthorised User")
    }else{
        next()
    }
}

module.exports={adminAuth,userAuth}