import { Container } from "ferrum-plumbing";
import { ThemeConstantProvider } from "unifyre-react-helper";

export type ApplicationMode = 'web3' | 'unifyre';

export interface ReponsivePageWrapperProps {
    container?: Container;
    theme: ThemeConstantProvider;
    footerHtml?: string;
    homepage?: string;
    navBarContent?: any;
    tempTheme?: any;
    children: any;
    authError?: string;
    setter?: any;
    newTheme?: any;
}

export interface ThemeProps {

    setter?: any;
    newTheme?: any;
    themeConfig: any;
}

export interface ReponsivePageWrapperDispatch {
   
}

export interface ResponsiveConnectProps {
    error?: string;
    notiError?: string;
    success?: string
}

export class PageWrapperUtils {
    static container?: Container = undefined;
    static platform(): 'desktop' | 'iOS' | 'android' {
        var iOs = /Phone|iPad|iPod/i.test(navigator.userAgent);
        var android = /Android/i.test(navigator.userAgent);
        if (iOs) { return 'iOS'; };
        if (android) { return 'android'; };
        return 'desktop';
    }
}