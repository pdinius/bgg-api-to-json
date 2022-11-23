const xml2js = require('xml2js');

export const convert: (o: { data: string }) => Promise<{ error: string | null, response: any }> = ({ data }) => {
    return new Promise((res, _) => xml2js.parseString(data, (err, response) => res({ error: err, response })));
};
