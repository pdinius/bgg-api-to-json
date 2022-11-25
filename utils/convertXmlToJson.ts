const xml2js = require('xml2js');

export const convert: (o: { data: any }) => Promise<{ data: any }> = ({ data }) => {
    return new Promise((res, _) => {
        xml2js.parseString(data, (_: any, response: any) => res({ data: response }));
    });
};
