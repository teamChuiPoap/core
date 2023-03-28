import express from "express"
import { configureMiddleware } from "./middlewares/config"
import {createServer} from 'http'
import { connectDB } from "./config/db"

let db: any ;(async ()=> {
    db = await connectDB()
}) ()

const app = express()

//setup middleware
configureMiddleware(app)

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