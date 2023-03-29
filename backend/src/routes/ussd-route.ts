import express, { NextFunction, Request, Response } from 'express';
import { ussdRouter } from 'ussd-router';
import { menu } from '../services/ussd';

const router = express.Router()


router.post("/", async(req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    //res.set('Content-Type: text/plain')
    
    //const { body: { phoneNumber: phoneNumber, sessionId: sessionId, serviceCode: serviceCode  }} = req
    //const { body: { text: rawText } } = req

    /*const text = req.body.text
    var data = text.split('*')
    const footer = '\n0: Back 00: Home';
    const home = '\n00: Home';
    let msg = ''*/

    //ussd builder
    
    /*if (text === '') {
        console.log('hit endpoint')
        msg = "CON Welcome to PennFi \n1: Create Wallet \n2: Get Balance \n3: Transfer"
        res.send(msg)
    }*/

    menu.run(req.body, (ussdResult: any) =>{
        res.send(ussdResult)
    })


})

export default router


