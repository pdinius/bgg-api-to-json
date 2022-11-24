const axios = require('axios');

// Load env variables
const dotenv = require('dotenv');
dotenv.config();
let { BGG_URI, BGG_URI_LEGACY, MAX_RETRY } = process.env;

const client = axios.create();

client.interceptors.response.use((res: any) => {
    const { config: { url, retry, signal }, status } = res;

    // give in after 5 attempts
    if (retry === Number(MAX_RETRY)) {
        return {
            data: null,
            error: Error('Reached maximum retry count')
        };
    }

    // processing the request
    if (status === 202) {
        return new Promise((resolve, _) => {
            setTimeout(async () => {
                console.log('retrying...');
                client.get(url, { retry: retry + 1, signal }).then((res: any) => resolve(res));
            }, 2000 * retry)
        });
    }

    // too many requests
    if (status === 429) {
        return new Promise((resolve, _) => {
            setTimeout(async () => {
                console.log('retrying...');
                client.get(url, { retry: retry + 1, signal }).then((res: any) => resolve(res));
            }, 10000)
        });
    }

    return {
        data: res.data
    };
}, (error: Error) => {
    return {
        data: null,
        error
    };
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

    return client.get(uri, { retry: 0, signal });
}
