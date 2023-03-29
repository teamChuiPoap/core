import express from "express"
import { configureMiddleware } from "./middlewares/config"
import {createServer} from 'http'
import { connectDB } from "./config/db"
import router from './routes/ussd-route'

let db: any ;(async ()=> {
    db = await connectDB()
}) ()

const app = express()
const ussdRoute  = router

//setup middleware
configureMiddleware(app)

//setup routes
app.use('/ussd', ussdRoute)

//setup routes

//start server
const httpServer = createServer(app)

httpServer.listen(5000, ()=>{
    console.info(
        `PENNY-FI V1 SERVER STARTED ON`,
        httpServer.address(),
        `PID ${process.pid} \n`
    )
})