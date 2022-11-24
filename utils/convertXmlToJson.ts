const xml2js = require('xml2js');

export const convert: (o: { data, error? }) => Promise<{ error: string | null, response: any }> = ({ data, error }) => {
    if (error) {
        throw error;
    }

    return new Promise((res, _) => {
        xml2js.parseString(data, (error, response) => res({ error, response }))
    });
};
