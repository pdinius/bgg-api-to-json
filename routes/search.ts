import { execute } from '../adapters/axios.adapter';
import { ThingType } from '../interfaces/general-interfaces';

export interface SearchOptions {
    query: string;
    type?: ThingType | Array<ThingType>;
    exact?: boolean;
};

interface SearchItem {
    id: number;
    name: string;
    subtype: ThingType;
    year_published?: string;
}

export interface SearchResponse {
    terms_of_use: string;
    total_items: number;
    items: Array<SearchItem>;
};

const mapSearch: (o: { data: any }) => SearchResponse = ({ data }) => {
    const { items } = data;

    return {
        terms_of_use: items.$.termsofuse,
        total_items: Number(items.$.total),
        items: items.item.map((i: any) => {
            let res: SearchItem = {
                id: Number(i.$.id),
                name: i.name[0].$.value,
                subtype: i.$.type
            }

            if (i.yearpublished) {
                res.year_published = i.yearpublished[0].$.value
            }

            return res;
        }).filter((i: any) => /boardgame/.test(i.subtype))
    }
};

export const search = (options: SearchOptions, signal?: AbortSignal): Promise<SearchResponse> => {
    let optionsObject: { [key: string]: string } = {};

    optionsObject.query = options.query.replace(/\s+/g, '+');

    if (options.type) {
        optionsObject.type = Array.isArray(options.type) ? options.type.join(',') : options.type;
    }
    if (options.exact) {
        optionsObject.exact = '1';
    }

    return execute('search', optionsObject, signal).then(mapSearch);
};
