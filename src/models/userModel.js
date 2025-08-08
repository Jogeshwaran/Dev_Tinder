const { default: mongoose, Schema } = require("mongoose");

//creating a userSchema
const userSchema = new Schema({
    firstName : {type: String},
    lastName : {type: String},
    age : {type: Number},
    gender : {type: String},
    email : {type: String},
    PhoneNo : {type: Number},
})

module.exports = mongoose.model('user', userSchema)

