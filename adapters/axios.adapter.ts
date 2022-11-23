const axios = require('axios');

// Load env variables
const dotenv = require('dotenv');
dotenv.config();
let { BGG_URI, MAX_RETRY } = process.env;

const client = axios.create();

client.interceptors.response.use((res) => {
    const { config: { url, retry, signal }, status } = res;

    // give in after 5 attempts
    if (retry === Number(MAX_RETRY)) {
        return res;
    }

    // processing the request
    if (status === 202) {
        return new Promise((resolve, _) => {
            setTimeout(async () => {
                console.log('retrying...');
                client.get(url, { retry: retry + 1, signal }).then(res => resolve(res));
            }, 2000 * retry)
        });
    }

    // too many requests
    if (status === 429) {
        return new Promise((resolve, _) => {
            setTimeout(async () => {
                console.log('retrying...');
                client.get(url, { retry: retry + 1, signal }).then(res => resolve(res));
            }, 10000)
        });
    }

    return res;
}, (error) => {
    console.error(error);
    return error;
})

export const execute = (route: string, options: { [key: string]: string }, signal?: AbortSignal) => {
    let uri = `${BGG_URI}${route}`
    
    if (Object.keys(options).length) {
        let params = Object.entries(options).map((val) => val.join('=')).join('&');
        uri += `?${params}`;
    }

    return client.get(uri, { retry: 0, signal });
}
