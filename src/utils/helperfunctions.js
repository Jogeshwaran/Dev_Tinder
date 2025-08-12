const validator = require('validator')
const bcrypt = require('bcrypt')
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

const validateEditRequest = (req) => {
    //allowed edit objects
    const allowedEditObjects = ["firstName", "lastName", "phoneNo", "about", "image","skills"]
    let isEditableObjectsValid = Object.keys(req.body).every((k)=>allowedEditObjects.includes(k))
    if(req?.body.skills.length > 10){
        throw new Error ("Cannot add more than 10 skills")
    }
    if(req?.body?.about?.length > 100){
        throw new Error ("Cannot add more than 100 chars")
    }
    return isEditableObjectsValid
}

const validatePasswordforChangePassword = async (req, user) => {
    const {currentPassword, newPassword} = req.body
    const currentPasswordInDB = await bcrypt.compare(currentPassword, user?.password)
    return currentPasswordInDB
}

module.exports = {signUpDataValidator, validateEditRequest, validatePasswordforChangePassword}