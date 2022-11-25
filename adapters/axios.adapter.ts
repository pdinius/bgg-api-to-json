import axios from 'axios';
import { convert } from '../utils/convertXmlToJson';

const BGG_URI = 'https://boardgamegeek.com/xmlapi2/';
const BGG_URI_LEGACY = 'https://boardgamegeek.com/xmlapi/';
const MAX_RETRY = 5;

let retries = 0;

axios.interceptors.response.use(res => {
    const { config: { url, signal }, status } = res;

    // give in after 5 attempts
    if (++retries === Number(MAX_RETRY)) {
        throw Error('Reached maximum retry count');
    }

    // processing the request
    if (status === 202) {
        return new Promise((resolve, _) => {
            setTimeout(async () => {
                console.log('still processing...');
                axios.get(url!, { signal }).then((res: any) => resolve(res));
            }, 5000)
        });
    }

    // too many requests
    if (status === 429) {
        return new Promise((resolve, _) => {
            setTimeout(async () => {
                console.log('backing off...');
                axios.get(url!, { signal }).then((res: any) => resolve(res));
            }, 10000)
        });
    }

    return convert(res);
}, (error) => {
    throw error;
})

export const execute = (route: string, options: { [key: string]: string }, signal?: AbortSignal) => {
    let uri: string;
    
    if (options.useLegacy === 'true') {
        uri = `${BGG_URI_LEGACY}${route}/${options.key}`;
        delete options.key;
        delete options.useLegacy;
    } else {
        uri = `${BGG_URI}${route}`;
    }

    if (Object.keys(options).length) {
        let params = Object.entries(options).map((val) => val.join('=')).join('&');
        uri += `?${params}`;
    }

    return axios.get(uri, { signal });
}
