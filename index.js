import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 3000
import mongoose from "mongoose"
import User from "./routes/Users.js"
import cors from "cors"

mongoose.connect(process.env.MONGOURI)
.then(()=>console.log("Connected to Database"))
.catch(()=>console.log("Disconnected from database"))
app.use(cors())
app.use(express.json())
app.use("/api",User)
app.get("/",async(req,res)=>{
    console.log("hello server")
    res.send("hello pandit ji")
})




app.listen(PORT,()=>console.log(`Server is running on PORT ${PORT}`))