import { execute } from '../adapters/axios.adapter';
import { LinkItem } from '../interfaces/general-interfaces';
import { convert } from '../utils/convertXmlToJson';

export interface FamilyOptions {
    id: number | Array<number>;
};

interface Family {
    id: number;
    name: string;
    image_uri: string;
    thumbnail_uri: string;
    description: string;
    games: Array<LinkItem>;
}

export interface FamilyResponse {
    terms_of_use: string;
    families: Array<Family>;
};

const mapFamily: (o: { error: string | null, response: any }) => FamilyResponse = ({ error, response }) => {
    if (error) {
        throw Error(error);
    }

    let families: Array<Family> = []; 

    for (let item of response.items.item) {
        families.push({
            id: Number(item.$.id),
            name: item.name.find((n: any) => n.$.type === 'primary').$.value,
            image_uri: item.image[0],
            thumbnail_uri: item.thumbnail[0],
            description: item.description[0],
            games: item.link.map((l: any) => ({
                id: Number(l.$.id),
                value: l.$.value
            }))
        })
    }

    return {
        terms_of_use: response.items.$.termsofuse,
        families
    }
};

export const family = (options: FamilyOptions, signal?: AbortSignal): Promise<FamilyResponse> => {
    if (!Number.isInteger(options.id)) {
        throw Error('id must be an integer number');
    }

    let optionsObject: { [key: string]: string } = {};

    optionsObject.id = Array.isArray(options.id) ? options.id.join(',') : String(options.id);

    return execute('family', optionsObject, signal)
            .then(convert)
            .then(mapFamily);
};
