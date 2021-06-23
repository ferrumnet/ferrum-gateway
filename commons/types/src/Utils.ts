import moment from 'moment';

export function logError(msg: string, err: Error) {
    console.error(msg, err);
    // Sentry.captureException(err);
}

function href(): string {
    // @ts-ignore
    return window.location.href;
}

export class Utils {
    static getQueryparams(): any {
        const rv: any = {};
        const queryParams = (href().split('?')[1] || '').split('&').map(p => p.split('='));
        queryParams.forEach(p => rv[p[0]] = p[1]);
        return rv;
    }

    static getQueryparam(param: string): string | undefined {
        const queryParams = (href().split('?')[1] || '').split('&').map(p => p.split('='));
        return (queryParams.find(p => p[0] === param) || [])[1];
    }

    static getRoute(subRoute: string) {
        let base = href().split('?')[0];
        if (!base.endsWith('/')) {
            base = base + '/';
        }
        return base + subRoute;
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
            case 'mumbai_testnet':
                return `https://explorer-mumbai.maticvigil.com/tx/${tid}`;
        }
        return '';
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