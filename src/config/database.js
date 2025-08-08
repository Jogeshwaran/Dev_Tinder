const mongoose = require('mongoose')
const URI = 'mongodb+srv://jokrish923:y5GMCTF8YYd032qW@nodejs.pkzw53y.mongodb.net/devTinder'
const connectDb = async () => {
    await mongoose.connect(URI)
}

module.exports = connectDb

