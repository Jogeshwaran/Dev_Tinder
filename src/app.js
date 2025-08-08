const express = require('express')
const {userAuth,adminAuth} = require('./middlewares/auth')

//creating instance of application

const app = express();

//request handler function

//Use app.get() instead of app.use() for specific routes, and don’t use / with app.use() like that unless you’re using middleware.



// app.use("/hello",(req,res)=>{
//     res.send("Hellow hellow hellow")
// })

// app.use("/test",(req,res)=>{
//     res.send("testing request")
// })

// // app.use("/",(req,res)=>{
// //     res.send("Hello from the server,otha")
// // })

// //testing http methods
// app.get("/user",(req,res)=>{
//     res.send({firstName : "Jogeshwaran", lastName : 'S'})
// })

// app.post("/user", (req,res)=>{
//     //adding to the DB
//     res.send("changes saved to the database")
// })

// app.patch("/user", (req,res)=>{
//     //adding to the DB
//     res.send("changes updated to the database")
// })

// app.delete("/user", (req,res)=>{
//     res.send("changes deleted from database")
// })

// //multiple router handlers

// app.use('/user',
    
// (req,res,next)=>{
//     next()
//     console.log('1st response');
//     res.send('1st response')
    
// },

// (req,res,next)=>{
//     console.log('2nd response');
//     res.send('2nd response')
//     next()
// },

// (req,res,next)=>{
//     console.log('3rd response');
//     res.send('3rd response')
//     next()
// },

// (req,res,next)=>{
//     console.log('4th response');
//     res.send('4th response')
//     next()
// },

// (req,res)=>{
//     console.log('5th response');
//     res.send('5th response') 
//     next()
// },

// )

app.use('/admin', adminAuth)

//error handling.



app.get("/admin/getAllData", (req,res)=>{
    try {
        //   throw new error()
        res.send('All data fetched sucessfully')    
    } catch (error) {

        res.status(404).send("Something went wrong")
    }
        
})

app.get("/admin/DeleteData", (req,res)=>{
    res.send('data Deleted sucessfully')
})

app.get("/user/getData",userAuth,(req,res)=>{
    res.send('feteched user data')
})

app.get("/user/login",(req,res)=>{
    res.send('logged In')
})

app.use('/', (error, req, res, next)=>{
    if(error) res.status(404).send("oops.. something went wrong")
    else next()
})

app.listen(7777,()=>{
    console.log(
    "Successfully listening on port 1000")
})