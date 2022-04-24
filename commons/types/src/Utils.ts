import moment from 'moment';
import { Big } from 'big.js';
import { HexString, Networks } from 'ferrum-plumbing';

export function logError(msg: string, err: Error) {
    console.error(msg, err);
    // Sentry.captureException(err);
}

function href(): string {
    // @ts-ignore
    return window.location.href;
}

export class Utils {
    static readonly ZERO_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000000000';

    static getQueryparams(): any {
        const rv: any = {};
        const queryParams = (href().split('?')[1] || '').split('&').map(p => p.split('='));
        queryParams.forEach(p => rv[p[0]] = p[1]);
        return rv;
    }

    static getQueryparam(param: string): string | undefined {
        return Utils._getQueryparam(href(), param);
    }

    static _getQueryparam(href: string, param: string): string | undefined {
        const queryParams = (href.split('?')[1] || '').split('&').map(p => p.split('='));
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
        if (!network) {
            return '';
        }
        switch (network.toLocaleLowerCase()) {
            case 'rinkeby':
                return `https://rinkeby.etherscan.io/address/${addr}`;
            case 'ethereum':
                return `https://etherscan.io/address/${addr}`;
            case 'bsc':
                return `https://bscscan.com/address/${addr}`;
            case 'bsc_testnet':
                return `https://testnet.bscscan.com/address/${addr}`;
            case 'mumbai_testnet':
                return `https://mumbai.polygonscan.com/address/${addr}`;
            case 'polygon':
                return `https://polygonscan.com/address/${addr}`;
            default:
                return Networks.for(network).explorer + `/address/${addr}`;
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
                return `https://mumbai.polygonscan.com/tx/${tid}`;
            case 'polygon':
                return `https://polygonscan.com/tx/${tid}`;
            case 'avax_testnet':
                return `https://testnet.snowtrace.io//tx/${tid}`;
            case 'moon_moonbase':
                return `https://moonbase.moonscan.io/tx/${tid}`;
            case 'avax_mainnnet':
                return `https://snowtrace.io//tx/${tid}`;
            case 'moon_moonriver':
                return `https://moonriver.moonscan.io/tx/${tid}`;
            case 'ftm_testnet':
                return `https://testnet.ftmscan.com/tx/${tid}`;
            case 'harmony_testnet_0':
                return `https://explorer.pops.one/tx/${tid}`;
            case 'ftm_mainnet':
                return `https://ftmscan.com/tx/${tid}`;
            case 'shiden_testnet':
                 return `https://shibuya.subscan.io/tx/${tid}`;
            case 'shiden_mainnet':
                return `https://blockscout.com/shiden/tx/${tid}`;
            default:
                return Networks.for(network).explorer + `/tx/${tid}`;
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

    static toCurrency(network: string, address: string): string | undefined {
		if (!network || !address) return undefined;
        return `${network.toUpperCase()}:${address.toLowerCase()}`
    }

	static isCurrencyValid(cur: string): boolean {
		if (!cur) { return false; }
		const [network, token] = Utils.parseCurrency(cur);
		if (!token) { return false; }
		if (!network) { return false; }
		if (!token.startsWith('0x')) {
			return false;
		}
		if (token.length != 42) {
			return false;
		}
		if (!Networks.CHAINS_BY_ID.get(network)) {
			return false;
		}
		return true;
	}

	static isNonzeroAddress(address: string) {
		if(!address) { return false; }
		const zero = address.replace('0x', '').replace(/0/g,'').length == 0;
		return !zero;
	}

	static addressEqual(a1: string, a2: string) {
		if (!a1 || !a2) return false;
		return a1.toLowerCase() === a2.toLowerCase();
	}

    static trim0x(s: string): HexString {
        if (s.startsWith('0x') || s.startsWith('0X')) {
            return s.substring(2);
        }
        return s;
    }

    static add0x(s: HexString): string {
        if (s.startsWith('0x') || s.startsWith('0X')) {
            return s;
        }
        return '0x' + s;
    }
}

export class ParseBigError extends Error { }

export class BigUtils {
	static truthy(b?: Big): boolean {
		return !!b && !(new Big(0).eq(b));
	}

	static safeParse(s: string): Big {
		try {
			return new Big(s);
		} catch (e) {
			return new Big('0');
		}
	}

	static parseOrThrow(s: string, varName: string): Big {
		try {
			return new Big(s);
		} catch (e) {
			throw new ParseBigError(`Error parsing ${varName}. "${s}" is not a valid number`);
		}
	}
}