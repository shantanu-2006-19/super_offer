import express from 'express'

const app=express()
const PORT=4000


app.use(express.json())
app.use(express.urlencoded({extended :true }))


app.use((req,res)=>{
    res.status(404).json({
        success:true,
        message:'Route Not found'
    })
})

app.listen(PORT,()=>{
    console.log("App is listening on port 4000");
})