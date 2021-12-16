import { LocaleManager } from "unifyre-react-helper";

const LOGO_TEMPLATE = 'https://unifyre-metadata-public.s3.us-east-2.amazonaws.com/logos/{NETWORK}/{TOKEN}-white.png';


export function logError(msg: string, err: Error) {
    console.error(msg, err);
}

export function getGroupIdFromHref() {
    let base = window.location.pathname;
    const parts = base.split('/');
    return parts[1];
}

export function getWebstieIdFromHref() {
    return window.location.host.split('.').reverse()[1];
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

export const Networks = ['ETHEREUM','BSC','RINKEBY','BSC_TESTNET','AVAX_TESTNET','MOON_MOONBASE','AVAX_MAINNET','MOON_MOONRIVER']
