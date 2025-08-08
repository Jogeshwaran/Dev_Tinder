const validator = require('validator')
const signUpDataValidator = (req) => {
    let {firstName, lastName, email, phoneNo, password} = req.body
    if(!firstName || firstName.length < 3 || firstName.length > 50){
        throw new Error ("firstName entered is invalied, please enter between 3-50 chars")
    }
    if(!lastName || lastName.length < 3 || lastName.length > 50){
        throw new Error ("lastName entered is invalied, please enter between 3-50 chars")
    }
    if(!validator.isEmail(email)){
        throw new Error("Email is not valid.");
    }
    if(!(/^(?!^(\d)\1{9}$)\d{10}$/.test(phoneNo))){
       throw new Error ("is not a valid phone number!")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error ("password not met requirements")
    }
}

module.exports = signUpDataValidator