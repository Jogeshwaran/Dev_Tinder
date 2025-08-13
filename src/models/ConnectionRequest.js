const mongoose = require('mongoose')

const ConnectionRequestSchema = new mongoose.Schema({
        fromUserId : 
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true
        },
        toUserId :
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true
        },
        status : {
            type : String,
            enum : {
                values : ["interested", "ignored", "accepted", "rejected"],
                message : `{VALUE} is not defined`
            }
        }
}, {
    timestamps : true
})

ConnectionRequestSchema.index({fromUserId : 1}, {toUserId : 1})

ConnectionRequestSchema.pre("save" , function(){
        let connectionRequest = this
        console.log('connectionRequest.fromUserId', connectionRequest.fromUserId);
        console.log('connectionRequest.toUserId',connectionRequest.toUserId);
        
        
        if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
            throw new Error ("You can't give request to yourself , you dumbass")
        }
       
  
       
})

module.exports = mongoose.model('connectionRequest', ConnectionRequestSchema)