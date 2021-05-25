import { LocaleManager } from "unifyre-react-helper";
import { Big } from 'big.js';
import moment from 'moment';

const LOGO_TEMPLATE = 'https://unifyre-metadata-public.s3.us-east-2.amazonaws.com/logos/{NETWORK}/{TOKEN}-white.png';


export function logError(msg: string, err: Error) {
    console.error(msg, err);
}

export class Utils {
    static getQueryparams(): any {
        const rv: any = {};
        const queryParams = (window.location.href.split('?')[1] || '').split('&').map(p => p.split('='));
        queryParams.forEach(p => rv[p[0]] = p[1]);
        return rv;
    }

    static getQueryparam(param: string): string | undefined {
        const queryParams = (window.location.href.split('?')[1] || '').split('&').map(p => p.split('='));
        return (queryParams.find(p => p[0] === param) || [])[1];
    }

    static getRoute(subRoute: string) {
        let base = window.location.href.split('?')[0];
        if (!base.endsWith('/')) {
            base = base + '/';
        }
        return base + subRoute;
    }

    static getGroupIdFromHref() {
        let base = window.location.pathname;
        const parts = base.split('/');
        return parts[1];
    }

    static ellipsis(s: string, len: number) {
        if (s.length <= len) { return s; }
        return `${s.substr(0, len - 3)}...`;
    }

    static strLength(s: string) {
        return s.length
    }

    static shorten(s: string) {
        if (s.length <= 25) { return s; }
        return `${s.substr(0, 10)}...${s.substr(s.length - 10)}`;
    }

    static linkForAddress(network: string, addr: string) {
        switch (network.toLocaleLowerCase()) {
            case 'rinkeby':
                return `https://rinkeby.etherscan.io/address/${addr}`;
            case 'ethereum':
                return `https://etherscan.io/address/${addr}`;
            case 'bsc':
                return `https://bscscan.com/address/${addr}`;
            case 'bsc_testnet':
                return `https://testnet.bscscan.com/address/${addr}`;
        }
        return '';
    }

    static linkForTransaction(network: string, tid: string) {
        switch (network.toLocaleLowerCase()) {
            case 'rinkeby':
                return `https://rinkeby.etherscan.io/tx/${tid}`;
            case 'ethereum':
                return `https://etherscan.io/tx/${tid}`;
            case 'bsc':
                return `https://bscscan.com/tx/${tid}`;
            case 'bsc_testnet':
                return `https://testnet.bscscan.com/tx/${tid}`;
        }
        return '';
    }


    static icon(currency: string): string {
        const parts = currency.split(':');
        return LOGO_TEMPLATE.replace('{NETWORK}', parts[0]).replace('{TOKEN}', parts[1]);
    }

    static tillDate(date: number) {
        var endDate = new Date(date * 1000);
        var now = new Date();
      
        var m = moment(endDate);
        const d2 = moment(now);
        var years = m.diff(d2, 'years');
        m.add(-years, 'years');
        var months = m.diff(d2, 'months');
        m.add(-months, 'months');
        var days = m.diff(d2, 'days');
        m.add(-days, 'days');
        var hours = m.diff(d2, 'hours');
        m.add(-hours, 'hours');
        var minutes = m.diff(d2, 'minutes');
        m.add(-minutes, 'minutes');

      
        return [years*12 + months,
          days, hours, minutes];
    }

    static union<T>(a1: T[], a2: T[], keyFun: (v: T) => string): T[] {
        const rv = new Map<string, T>();
        a1.forEach(a => { rv.set(keyFun(a), a); });
        a2.forEach(a => { rv.set(keyFun(a), a); });
        return Array.from(rv.keys()).map(k => rv.get(k)!);
    }

    static parseCurrency(cur: string): [string, string] {
        const pars = cur.split(':', 2);
        return [pars[0], pars[1]];
    }
}

export class CurrencyFormatter {
    unFormat(num: string): string | undefined {
        if (num === '') { return '0';}
        if (!num) return num;
        return LocaleManager.unFormatDecimalString(num);
    }

    format(num: string, isFiat: boolean): string | undefined {
        if (!num) return num;
        const decimals = isFiat ? 2 : 4;
        const canonical = LocaleManager.unFormatDecimalString(num);
        if (!canonical) {
            return;
        }
        return LocaleManager.formatDecimalString(canonical, decimals);
    }
}

export const dataFormat = (data:number) =>  {
    return new Date(Number(data * 1000)).toLocaleString()}

export const dateFromNow = (data:number) => {
    let today = new Date();
    let proposedDate = new Date(Number(data * 1000));
    var timeinmilisec = proposedDate.getTime() - today.getTime() 
    return Math.floor(timeinmilisec / (1000 * 60 * 60 * 24));
}

export const formatter = new CurrencyFormatter();


  export const editableStakingFields = [
    "name", //editable
    "minContribution", //editable
    "maxContribution", //editable
    "emailWhitelist", //editable
    "addressWhitelist", //editable
    "logo",//editable
    "color",//editable
    "backgroundImage",//editable
    "rewardTokenPrice", //editable
    "earlyWithdrawRewardSentence", //editable
    "totalRewardSentence", //editable
    "rewardContinuationParagraph", //editable
    "gasLimitOverride", //editable
  ];

  export const newStaking = [
    "network", //editable
    "contractType", //editable
    "contractAddress", //editable
  ];

  export const stakingFields = [
        "contractType",
        "network",
        "currency",
        "rewardCurrency",
        "groupId",
        "symbol",
        "rewardSymbol",
        "contractAddress",
        "rewardContinuationAddress",
        "rewardContinuationCurrency",
        "rewardContinuationSymbol",
        "tokenAddress",
        "rewardTokenAddress",
        "stakedBalance",
        "rewardBalance",
        "stakingCap",
        "stakedTotal",
        "earlyWithdrawReward",
        "totalReward",
        "withdrawStarts",
        "withdrawEnds",
        "stakingStarts",
        "stakingEnds",
        "backgroundImageDesktop",
        "filled",     
  ];

export const defaultvar = `{"themePrimary": "",
    "themeLighterAlt": "",
    "themeLighter": "",
    "themeLight": "",
    "themeTertiary": "",
    "themeSecondary": "",
    "themeDarkAlt": "",
    "themeDark": "",
    "themeDarker": "",
    "neutralLighterAlt": "",
    "neutralLighter": "",
    "neutralLight": "",
    "neutralQuaternaryAlt": "",
    "neutralQuaternary": "",
    "neutralTertiaryAlt": "",
    "neutralTertiary": "",
    "neutralSecondary": "",
    "neutralPrimaryAlt": "",
    "neutralPrimary": "",
    "neutralDark": "",
    "black": "",
    "white": ""
}`

export const Networks = ['ETHEREUM','BSC','RINKEBY','BSC_TESTNET']
