import express, {Express} from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import hpp from 'hpp'
import expressRateLimit from 'express-rate-limit'
import cors from 'cors'
import { logger } from './logger'

const xss = require('xss-clean')

export const configureMiddleware = (app:Express)=>{

    // body parser middleware
    app.use(express.json())

    //form parser middleware
    app.use(express.urlencoded({extended: true}))

    //mongoDB sanitize middleware
    app.use(mongoSanitize())

    //improve api security by setting header checks
    app.use(helmet())

    //prevent xss attacks
    app.use(xss())

    //Prevent http param pollution
    app.use(hpp())

    //enable logger
    app.use(logger)

    //rate limit
    app.use(
        expressRateLimit({
            windowMs: 10*60*1000,
            max: 1000
        })
    )

    //enable CORS
    //app.use(cors())

    //enable logger
    app.use(logger)
}