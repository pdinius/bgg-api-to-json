import { execute } from '../adapters/axios.adapter';
import { ThingType } from '../interfaces/general-interfaces';
import { convert } from '../utils/convertXmlToJson';

export interface GeeklistOptions {
    id: number;
};

interface GeeklistItem {
    id: Number;
    name: string;
    type: ThingType;
    added_by: string;
    post_date: Date;
    last_edit_date: Date;
    likes: number;
    image_id: number;
    post_body: string;
}

export interface GeeklistResponse {
    terms_of_use: string;
    id: number;
    title: string;
    author: string;
    description: string;
    post_date: Date;
    last_edit_date: Date;
    num_items:number;
    likes: number;
    items: Array<GeeklistItem>;
};

const mapGeeklist: (o: { error: string | null, response: any }) => GeeklistResponse = ({ error, response }) => {
    if (error) {
        throw Error(error);
    }

    const { geeklist } = response;

    return {
        terms_of_use: geeklist.$.termsofuse,
        id: Number(geeklist.$.id),
        title: geeklist.title[0],
        author: geeklist.username[0],
        description: geeklist.description[0],
        post_date: new Date(geeklist.postdate[0]),
        last_edit_date: new Date(geeklist.editdate[0]),
        num_items: Number(geeklist.numitems[0]),
        likes: Number(geeklist.thumbs[0]),
        items: geeklist.item.map(g => ({
            id: Number(g.$.objectid),
            name: g.$.objectname,
            type: g.$.subtype,
            added_by: g.$.username,
            post_date: new Date(g.$.postdate),
            last_edit_date: new Date(g.$.editdate),
            likes: Number(g.$.thumbs),
            image_id: Number(g.$.imageid),
            post_body: g.body[0]
        }))
    }
};

export const geeklist = (options: GeeklistOptions, signal?: AbortSignal): Promise<GeeklistResponse> => {
    let optionsObject: { [key: string]: string } = {};

    optionsObject.key = String(options.id);
    optionsObject.useLegacy = 'true';

    return execute('geeklist', optionsObject, signal)
            .then(convert)
            .then(mapGeeklist);
};
