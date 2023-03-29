import UssdMenu from "ussd-builder";
import { User } from "../models/User";
import { UserWallet } from "../models/UserWallet";
import { createWallet } from "./polkdot-services";

export const menu = new UssdMenu

let name: string,
    id_number: string,
    PIN: string,
    phoneNumber: string

try{
menu.startState({
    run: ()=>{
        menu.con('welcome to pennyfi. Select option:' + 
            '\n1. Register' +
            '\n2. Join Chama' +
            '\n3. Create Chama'+
            '\n4. Active Chama Menus'+
            '\n5. end'
)
        console.log(menu.val)
    },
        next:{
            "1":"Register",
            "2":"Join Chama",
            "3":"Create Chama",
            "4":"Active Chama Menus"
        }
    })

    menu.state('Join Chama',{
        run: ()=>{
            menu.con('Enter Chama name')
            let chamaName = menu.val
            
        }
    })

    menu.state('Register', {
        run: ()=>{
            menu.con('Enter full name')            
             name = menu.val
             console.log('name', name)
        },
        defaultNext: "EnterIdNumber"
    })

    menu.state("EnterIdNumber",{
        run: ()=>{
            menu.con('Enter id number')
            id_number = menu.val 
        }
    ,
    defaultNext: "EnterPIN"
    })

    menu.state("EnterPIN", {
        run: async ()=>{
            menu.con('Enter preferred PIN')
            PIN = menu.val
            phoneNumber = menu.args.phoneNumber

            let user:any = await User.create({name,id_number,phoneNumber,PIN })

            let _wallet = await createWallet(),
                address = _wallet.address,
                mnemonic = _wallet.mnemonic,
                ownerID = user._id

            let wallet = await UserWallet.create({address,mnemonic,ownerID})

            user = await User.findOneAndUpdate({name:name},{wallet_id: wallet._id},{new: true})

            console.log(user)

        },
        defaultNext: "end"

    })

    menu.state("end",{
        run: ()=>{
            menu.end('Success!')
        }
    })
}
catch(err){
    console.log(err)
}    
