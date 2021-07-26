import { Accounts, LeaderboardData } from "../types/LeaderboardTypes";
import { orderBy } from "lodash";
export const formatData = (
  accounts: Accounts[],
  frmUSD: number,
  frmxUSD: number
): LeaderboardData[] => {
  console.log(accounts.length);
  let toReturn: LeaderboardData[] = [];
  let frm: Accounts[] = [];
  let frmx: Accounts[] = [];
  accounts.forEach((element) => {
    if (
      element.address.currency ===
      "ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c"
    ) {
      frm.push(element);
    } else if (
      element.address.currency ===
      "ETHEREUM:0xf6832ea221ebfdc2363729721a146e6745354b14"
    ) {
      frmx.push(element);
    }
  });
  console.log(frm.length);
  console.log(frmx.length);
  frm.forEach((item) => {
    toReturn.push({
      rank: 0,
      address: item.address.address,
      balance: +item.address.balance / 1000000,
      usd_frm_and_frmx: (+item.address.balance / 1000000) * frmUSD,
      frm_holiday: +item.address.balance / 1000000,
      frmx_holiday: 0,
    });
  });

  frmx.forEach((item) => {
    const xItem = toReturn.findIndex(
      (tItem) => tItem.address === item.address.address
    );
    if (xItem >= 0 && xItem !== undefined) {
      toReturn[xItem].balance += +item.address.balance / 1000000000000000000;
      toReturn[xItem].frmx_holiday =
        +item.address.balance / 1000000000000000000;
      toReturn[xItem].usd_frm_and_frmx =
        toReturn[xItem].frm_holiday + toReturn[xItem].frmx_holiday * frmxUSD;
    } else {
      toReturn.push({
        rank: 0,
        address: item.address.address,
        balance: +item.address.balance / 1000000000000000000,
        usd_frm_and_frmx: +item.address.balance / 1000000000000000000,
        frm_holiday: 0,
        frmx_holiday: +item.address.balance / 1000000000000000000,
      });
    }
  });
  // let topRanked = {};
  // let a = 0;
  // toReturn.forEach((item) => {
  //   if (item.usd_frm_and_frmx > a) {
  //     topRanked = { ...item };
  //     a = item.usd_frm_and_frmx;
  //   }
  // });

  // console.log(topRanked);

  toReturn = [...orderBy([...toReturn], "usd_frm_and_frmx", "desc")];

  let count = 1;
  toReturn.forEach((item) => {
    item.rank = count;
    count++;
  });

  // console.log(toReturn);

  return toReturn;
};
