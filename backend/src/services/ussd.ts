import UssdMenu from "ussd-builder";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";
import { createWallet} from "./polkdot-services";
import { Chama } from "../models/Chama";

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
            '\n4. View Chama Balances'
)
        console.log(menu.val)
    },
        next:{
            "1":"Register",
            "2":"Join Chama",
            "3":"Create Chama",
            "4":"View Chama Balances"
        }
    })

    menu.state('View Chama Balances',{
        run: async ()=>{
            let userPhoneNo = menu.args.phoneNumber

            let user = await User.findOne({phoneNumber: userPhoneNo}).select('chamas_joined')

            console.log(user?.chamas_joined)

            let res = 'Enter name of chama from below list:'
            user?.chamas_joined.forEach(element => res + `\n${element}`)

            menu.con(res)

        },
        defaultNext: 'View Selected Chama Balance'
    })

    menu.state('View Selected Chama Balance',{
        run: async ()=>{
            let chamaName = menu.val

            let chama = await Chama.findOne({name:chamaName}).select('wallet_id'),
                wallet_id = chama?.wallet_id
            
            let wallet = await Wallet.findById({wallet_id}).select('address'),
                wallet_address = JSON.stringify(wallet?.address)
            
            let balance = '4500'

            menu.end(`wallet balance is ${balance}`)
            

        }
    })

    menu.state('Create Chama',{
        run: ()=>{
            menu.con('Enter chama name')
        },
        defaultNext: "CreateChamaLogic"
    })

    menu.state('CreateChamaLogic',{
        run: async ()=>{
            let name = menu.val,
                chamaName = name
            let userPhoneNo = menu.args.phoneNumber

            let chama:any = await Chama.create({name})

            let _wallet = await createWallet(),
                address = _wallet.address,
                mnemonic = _wallet.mnemonic,
                ownerID = chama._id

            let wallet = await Wallet.create({address,mnemonic,ownerID}),
                walletId = wallet._id
            
            let chama_members = [menu.args.phoneNumber]

            let user = await User.findOne({phoneNumber: userPhoneNo}).select('chamas_joined'),
                user_chamas = user?.chamas_joined.push(chamaName)

            user = await User.findOneAndUpdate({phoneNumber:userPhoneNo}, {chamas_joined: user_chamas})            

            chama = await Chama.findOneAndUpdate({name: chamaName},{wallet_id:walletId, members:chama_members}, {new: true})

            console.log('new chama', chama)

            menu.end('Success!')

        },
    })

    menu.state('Join Chama',{
        run: ()=>{
            menu.con('Enter Chama name')
            
        },
        defaultNext:'JoinChamaLogic'
    })

    menu.state('JoinChamaLogic', {
        run: async ()=>{
            let chamaName = menu.val
            let userPhoneNo = menu.args.phoneNumber

            let chama = await Chama.findOne({name:chamaName}).select('members')

            let user = await User.findOne({phoneNumber: userPhoneNo}).select('_id chamas_joined')

            let userId = JSON.stringify(user?._id) 

            chama?.members.push(userId)

            let user_chamas = user?.chamas_joined.push(chamaName)

            user = await User.findOneAndUpdate({phoneNumber:userPhoneNo}, {chamas_joined: user_chamas}) 
            
            menu.end('Success!')
        },
    })

    menu.state('Register', {
        run: ()=>{
            menu.con('Enter full name')            
        },
        defaultNext: "EnterIdNumber"
    })

    menu.state("EnterIdNumber",{
        run: ()=>{
            menu.con('Enter id number')
            name = menu.val
        }
    ,
    defaultNext: "EnterPIN"
    })

    menu.state("EnterPIN", {
        run: async ()=>{
            menu.con('Enter preferred PIN')
            id_number = menu.val}
            ,
            defaultNext:"Registration Logic"})
            
    menu.state("Registration Logic",{
        run: async ()=>{
            PIN = menu.val

            phoneNumber = menu.args.phoneNumber

            let user:any = await User.create({name,id_number,phoneNumber,PIN })

            let _wallet = await createWallet(),
                address = _wallet.address,
                mnemonic = _wallet.mnemonic,
                ownerID = user._id

            let wallet = await Wallet.create({address,mnemonic,ownerID})

            user = await User.findOneAndUpdate({name:name},{wallet_id: wallet._id},{new: true})

            console.log(user)
            
            menu.end('Success!')
        },
        
        }
    )
    

    menu.state("end",{
        run: ()=>{
            menu.end('Success!')
        }
    })
}
catch(err){
    console.log(err)
}    
