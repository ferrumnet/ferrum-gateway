export interface Address {
  address: String;
  network: String;
  currency: String;
  balance: String;
  readableBalance: number;
}

export interface Accounts {
  address: Address;
}

export interface LeaderboardData {
  rank: number;
  balance: number;
  address: String;
  usd_frm_and_frmx;
  frm_holiday;
  frmx_holiday;
}
