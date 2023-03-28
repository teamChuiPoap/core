import { connect } from "mongoose"
import 'dotenv/config'

const MONGO_URI = process.env.MONGO_URI as string

export const connectDB = async () => {
    
    console.log(`- - -`.repeat(10))
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            keepAlive: true,
            connectTimeoutMS: 60000,
            socketTimeoutMS: 60000,
        }
        const db = await connect(MONGO_URI, options)
        console.log('Connected to MongoDb :) ✅✅✅')
        console.log(`- - -`.repeat(10))
        return db
    } catch (err: any) {
        console.error(err.message)
        process.exit(1)
    }
}