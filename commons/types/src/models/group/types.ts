
export interface GroupInfo {
    groupId: string;
    network: string;
    themeVariables: any;
    defaultCurrency: string;
    homepage: string;
    noMainPage: boolean; // Main page should redirect to home page
    headerHtml?: string;
    footerHtml?: string;
    mainLogo?: string;
	bridgeCurrencies: string[];
    bridgeTheme:  {[k: string]: string}
}