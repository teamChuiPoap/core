import express, { NextFunction, Request, Response } from 'express';
import { ussdRouter } from 'ussd-router';

const router = express.Router()


router.post("/", async(req: Request, res: Response, next: NextFunction) => {
    console.log(req)
    res.set('Content-Type: text/plain')
    
    const { body: { phoneNumber: phoneNumber, sessionId: sessionId, serviceCode: serviceCode  }} = req
    const { body: { text: rawText } } = req

    const text = ussdRouter(rawText)
    var data = text.split('*')
    const footer = '\n0: Back 00: Home';
    const home = '\n00: Home';
    let msg = ''

    if (text === '') {
        console.log('hit endpoint')
        msg = `Welcome to PennFi 
        \n1: Create Wallet
        \n2: Get Balance
        \n3: Transfer`
        res.status(200).send(msg)
    }


})

export default router


