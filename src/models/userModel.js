const { default: mongoose, Schema } = require("mongoose");
const validator = require('validator')
const jwtToken = require('jsonwebtoken')
const bcrypt = require('bcrypt')


//creating a userSchema
const userSchema = new Schema({
    firstName : {
        type: String,
        required : true,
        minLength : 3,
        maxLength : 50,
        trim : true
    },
    lastName : {
        type: String,
        required : true,
        minLength : 3,
        maxLength : 50,
        trim : true
    },
    age : {
        type: Number,
        min : 18,
        max : 70
    },
    gender : {
        type: String,
        enum : ['male', 'female', 'others']
    },
    email : {
        type: String,
        required : true,
        unique : true,
        validate(value){
            // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // if(!regex.test(value)){
            //     throw new Error("Email is not valid.");
                
            // }
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid.");
            }
        }
    },
    phoneNo : {
        type: Number,
        required : true,
        unique : true,
        validate : {
            validator : function(value){
                return /^(?!^(\d)\1{9}$)\d{10}$/.test(value);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    password : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error ("password not met requirements")
            }
        }
    },
    about : {
        type : String,
        default : "This is a default about"
    },
    image : {
        type : String,
        default : 'https://i.pinimg.com/474x/18/b9/ff/18b9ffb2a8a791d50213a9d595c4dd52.jpg',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ("please enter correct URL")
            }
        }
    },
    skills : {
        type : [String]
    }
},{
    timestamps : true
})

userSchema.methods.getJwt = async function(){
    const user = this;    
    const token = await jwtToken.sign({_id : user._id},"devTinder@2025",{ expiresIn: '1h' })    
    return token
}

userSchema.methods.validatePassword = async function(passwordInputByuser) {
    const user = this;
    console.log('passwordInputByuser', passwordInputByuser);
    
    const passwordMatch = await bcrypt.compare(passwordInputByuser, user?.password)
    console.log('passwordMatch', passwordMatch);
    
    return passwordMatch
}
module.exports = mongoose.model('user', userSchema)

