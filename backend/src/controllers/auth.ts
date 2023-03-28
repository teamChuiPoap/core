import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const register = async (req: Request, res: Response)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        console.log(errors)
        let _errors = errors.array().map((error) => {
            return {
                msg: error.msg,
                field: error.param,
                success: false,
            }
        })[0]
        //check error handling in ussd case
        return res.status(400).json(_errors)
    }
    
    
}