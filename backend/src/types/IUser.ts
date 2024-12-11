export interface IUserWallet {
  address: string;
  mnemonic: string;
  ownerID: string;
}

export interface IUser {
  name: string;
  id_number: string;
  phoneNumber: string;
  date_of_conception: any;
  alert_messages: string[];
  estimated_delivery: string;
  checkup_dates: [];
  /* PIN: string,
    wallet_id: string,
    chamas_joined: string[] */
}
