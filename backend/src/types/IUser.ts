export interface IUserWallet {
    address: string,
    mnemonic: string,
    ownerID: string
}

export interface IUser {
    name: string,
    id_number: string,
    phoneNumber: string,
    PIN: string,
    wallet_id: string,
    chamas_joined: string[]

}