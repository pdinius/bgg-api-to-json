import { execute } from '../adapters/axios.adapter';
import { convert } from '../utils/convertXmlToJson';

export interface HotOptions {
    type: 'boardgame' | 'boardgameperson' | 'boardgamecompany';
};

interface HotItem {
    id: number;
    name: string;
    rank: number;
    thumbnail_uri: string;
    year_published?: string | null;
}

export interface HotResponse {
    terms_of_use: string;
    items: Array<HotItem>;
};

const mapHot: (o: { error: string | null, response: any }) => HotResponse = ({ error, response }) => {
    if (error) {
        throw Error(error);
    }
    
    const { items } = response;
    console.log(items);

    return {
        terms_of_use: items.$.termsofuse,
        items: items.item.map((i: any) => {
            let hotItem: HotItem = {
                id: Number(i.$.id),
                name: i.name[0].$.value,
                rank: Number(i.$.rank),
                thumbnail_uri: i.thumbnail[0].$.value
            };

            if (i.yearpublished === '0') {
                hotItem.year_published = null;
            } else if (i.yearpublished) {
                hotItem.year_published = i.yearpublished[0].$.value;
            }

            return hotItem;
        })
    };
};

export const hot = (options: HotOptions, signal?: AbortSignal): Promise<HotResponse> => {
    let optionsObject: { [key: string]: string } = {};

    optionsObject.type = options.type;

    return execute('hot', optionsObject, signal)
            .then(convert)
            .then(mapHot);
};
