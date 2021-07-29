import { Accounts, LeaderboardData } from "../types/LeaderboardTypes";
import { orderBy } from "lodash";
import Big from "big.js";
export const formatData = (
  accounts: Accounts[],
  frmUSD: number,
  frmxUSD: number
): LeaderboardData[] => {
  // console.log(accounts.length);
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
  // console.log(frm.length);
  // console.log(frmx.length);
  // console.log(frm);
  // console.log(frmx);

  frm.forEach((item) => {
    let balance = new Big(item.address.balance);
    toReturn.push({
      rank: 0,
      address: item.address.address,
      balance: +balance.div(1000000).toFixed(2),
      usd_frm_and_frmx: +balance.div(1000000).mul(frmUSD).toFixed(2),
      frm_holiday: +balance.div(1000000).toFixed(2),
      frmx_holiday: 0,
    });
  });

  frmx.forEach((item) => {
    const xItem = toReturn.findIndex(
      (tItem) => tItem.address === item.address.address
    );
    if (xItem >= 0 && xItem !== undefined) {
      let oldBalance = new Big(toReturn[xItem].balance);
      let newBalance = new Big(item.address.balance);

      toReturn[xItem].balance = +newBalance
        .div(1000000000000000000)
        .add(oldBalance)
        .toFixed(2);
      toReturn[xItem].frmx_holiday = +newBalance
        .div(1000000000000000000)
        .toFixed(2);
      toReturn[xItem].usd_frm_and_frmx = +new Big(toReturn[xItem].frm_holiday)
        .add(new Big(toReturn[xItem].frmx_holiday).mul(frmxUSD))
        .toFixed(2);
    } else {
      toReturn.push({
        rank: 0,
        address: item.address.address,
        balance: +new Big(item.address.balance)
          .div(1000000000000000000)
          .toFixed(2),
        usd_frm_and_frmx: +new Big(item.address.balance)
          .div(1000000000000000000)
          .toFixed(2),
        frm_holiday: 0,
        frmx_holiday: +new Big(item.address.balance).div(1000000000000000000),
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
