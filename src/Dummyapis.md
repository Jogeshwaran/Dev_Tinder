
// getApi 

app.get('/getUserByEmail', async (req,res) => {
    const email = req.body.email
    console.log(email);
    
    try{
        const users = await userModel.find({email : email})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send(users)
        }
        
    }catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})

//feed api

app.get('/feed', async (req,res) => {  
    try{
        const users = await userModel.find({})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send(users)
        }
        
    }catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})

app.get('/findById', async (req,res) => {  
    const id = req.body.id
    console.log(id);
    
    try{
        const users = await userModel.findById(id)
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send(users)
        }
        
    }catch{
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})
app.get('/findByage', async (req,res) => {  
    const age = req.body.age
    console.log(age);
    
    try{
        const users = await userModel.findOne({age : age})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send(users)
        }
        
    }catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})


//login api



//getprofileapi


//sendconnection request api



// delete 

app.delete('/user', async (req,res) => {  
    const email = req.body.email
    // console.log(age);
    
    try{
        const users = await userModel.deleteOne({email : email})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send('user Delted sucess')
        }
        
    }catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong')
    }
})

//patch 
app.patch('/user/:userId', async (req,res) => {  
    const id = req.params?.userId
    const data = req.body
    // console.log(age);
    
    try{
        const changeableData = ['phoneNo', 'password', 'about', 'image', 'skills',"age"]
        console.log(data);
        
        const allowedChangeableData = Object.keys(data).every((k)=>
            changeableData.includes(k)
        )
        console.log('allowedChangeableData', allowedChangeableData);
        
        if(!allowedChangeableData){
            throw new Error("Cannot modify restricted Data");
            
        }
        if(data?.skills.length > 10){
            throw new Error ("Cannot add more than 10 skills")
        }
        if(data?.about?.length > 100){
            throw new Error ("Cannot add more than 100 chars")
        }
        const users = await userModel.findByIdAndUpdate(id, data,{runValidators : true})
        if(users.length < 1){
            res.status(404).send('user not found')
        }else{
            res.send('user Delted sucess')
        }
        
    }
    catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong' + error.message)
    }
})

app.put('/user', async (req,res) => {  
    const id = req.body.id
    const data = req.body
    // console.log(age);
    
    try{
        const users = await userModel.findOneAndReplace({_id : id}, data)
        if(users.length < 1){
            res.status(404).send('user replaced')
        }else{
            res.send('user Delted sucess')
        }
        
    }catch(error){
        console.log(error);
        res.status(400).send('soemthing went wrong' + error.message)
    }
})