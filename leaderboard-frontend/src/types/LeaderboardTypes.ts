export interface Address {
  address: String;
  network: String;
  currency: String;
  balance: number;
  readableBalance: number;
}

export interface Accounts {
  address: Address;
}

export interface LeaderboardData {
  rank: number;
  balance: number;
  address: String;
  usd_frm_and_frmx: number;
  frm_holiday: number;
  frmx_holiday: number;
}
