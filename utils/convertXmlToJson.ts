const xml2js = require('xml2js');

export const convert: (o: { data: any, error?: Error }) => Promise<{ error: string | null, response: any }> = ({ data, error }) => {
    if (error) {
        throw error;
    }

    return new Promise((res, _) => {
        xml2js.parseString(data, (error: string, response: any) => res({ error, response }))
    });
};

export const timeout = (n: number = 2000) => new Promise((res, _) => setTimeout(res, n));
