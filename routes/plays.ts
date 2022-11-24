import { execute } from '../adapters/axios.adapter';
import { ThingType } from '../interfaces/general-interfaces';
import { convert } from '../utils/convertXmlToJson';

interface PlaysOptions {
    username: string;
    id?: number;
    min_date?: Date;
    max_date?: Date;
    subtype?: ThingType;
    page?: number;
};

interface Player {
    username: string;
    user_id: number;
    start_position?: string;
    color?: string;
    score?: string;
    new?: boolean;
    rating?: number;
    win?: true;
}

interface Play {
    id: number;
    date: Date;
    quantity: number;
    length?: number;
    incomplete: boolean;
    location?: string;
    game: string;
    game_id: number;
    subtype: ThingType;
    players?: Array<Player>;
}

interface PlaysResponse {
    terms_of_use: string;
    user_id: number;
    username: string;
    total: number;
    page: number;
    plays: Array<Play>;
};

const mapPlays: (o: { error: string | null, response: any }) => PlaysResponse = ({ error, response }) => {
    if (error) {
        throw Error(error);
    }

    const { plays } = response;

    return {
        terms_of_use: plays.$.termsofuse,
        user_id: Number(plays.$.userid),
        username: plays.$.username,
        total: Number(plays.$.total),
        page: Number(plays.$.page),
        plays: plays.play.map(p => {
            let subtype: ThingType;

            if (p.item[0].subtypes[0].subtype.some(s => s.$.value === 'boardgameaccessory')) {
                subtype = 'boardgameaccessory';
            } else if (p.item[0].subtypes[0].subtype.some(s => s.$.value === 'boardgameexpansion')) {
                subtype = 'boardgameexpansion';
            } else {
                subtype = 'boardgame';
            }

            let res: Play = {
                id: Number(p.$.id),
                date: new Date(p.$.date),
                quantity: Number(p.$.quantity),
                game: p.item[0].$.name,
                game_id: Number(p.item[0].$.objectid),
                incomplete: p.$.incomplete === '1' ? true : false,
                subtype
            }

            if (p.$.length !== '0') {
                res.length = Number(p.$.length);
            }
            if (p.$.location) {
                res.location = p.$.location;
            }
            if (p.players) {
                res.players = p.players[0].player.map(({ $: l }) => {
                    let res: Player = {
                        username: l.username,
                        user_id: Number(l.userid)
                    }

                    if (l.startposition) {
                        res.start_position = l.start_position;
                    }
                    if (l.color) {
                        res.color = l.color;
                    }
                    if (l.score) {
                        res.score = l.score;
                    }
                    if (l.new === '1') {
                        res.new = true;
                    }
                    if (l.rating !== '0') {
                        res.rating = Number(l.rating);
                    }
                    if (l.win === '1') {
                        res.win = true;
                    }

                    return res;
                });
            }

            return res;
        })
    };
};

export const plays = (options: PlaysOptions, signal?: AbortSignal): Promise<PlaysResponse> => {
    let optionsObject: { [key: string]: string } = {};

    optionsObject.username = options.username;

    if (options.id) {
        optionsObject.id = String(options.id);
    }
    if (options.min_date) {
        optionsObject.username = new Date(options.min_date).toISOString().split('T')[0];
    }
    if (options.max_date) {
        optionsObject.maxdate = new Date(options.max_date).toISOString().split('T')[0];
    }
    if (options.subtype) {
        optionsObject.subtype = options.subtype;
    }
    if (options.page) {
        optionsObject.page = String(options.page);
    }

    return execute('plays', optionsObject, signal)
        .then(convert)
        .then(mapPlays);
};
