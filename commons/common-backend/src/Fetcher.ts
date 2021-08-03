import fetch from 'cross-fetch';

export class Fetcher {
	async fetch<T>(url: string, init: RequestInit | undefined): Promise<T> {
        try {
            const res = await fetch(url, init);
            const resText = await res.text();
            if (Math.round(res.status / 100) === 2) {
                return resText ? JSON.parse(resText) : undefined;
            }
            const error = resText;
            let jerror: any;
            try {
                jerror = JSON.parse(error);
            } catch (e) { }
            console.error('Server returned an error when calling ' + url + JSON.stringify({
                status: res.status, statusText: res.statusText, error}), new Error());
            throw new Error(jerror?.error ? jerror.error : error);
        } catch (e) {
            console.error('Error calling api with ' + url + JSON.stringify(init), e);
            throw e;
        }
	}
}