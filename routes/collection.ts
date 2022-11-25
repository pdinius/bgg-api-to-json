import { execute } from '../adapters/axios.adapter';
import { ThingType, LinkItem, SubRank } from '../interfaces/general-interfaces';
import { timeout } from '../utils/timeout';

export interface CollectionOptions {
    username: string;
    version?: boolean;
    exclude_subtype?: ThingType | Array<ThingType>;
    id?: number | Array<number>;
    brief?: boolean;
    stats?: boolean;
    own?: boolean;
    rated?: boolean;
    played?: boolean;
    comment?: boolean;
    trade?: boolean;
    want?: boolean;
    wishlist?: boolean;
    wishlist_priority?: Number;
    preordered?: boolean;
    want_to_play?: boolean;
    want_to_buy?: boolean;
    prev_owned?: boolean;
    has_parts?: boolean;
    want_parts?: boolean;
    min_rating?: Number;
    max_rating?: Number;
    min_bgg_rating?: Number;
    max_bgg_rating?: Number;
    min_plays?: Number;
    max_plays?: Number;
    modified_since?: Date;
};

interface CollectionItem {
    id: number;
    name: string;
    original_name?: string;
    type: ThingType;
    year_published?: string | null;
    image?: string;
    thumbnail?: string;
    rating?: number;
    status: {
        own: boolean;
        prev_own: boolean;
        for_trade: boolean;
        want: boolean;
        want_to_play: boolean;
        want_to_buy: boolean;
        wishlist: boolean;
        preordered: boolean;
        last_modified: Date;
    }
    num_plays?: number;
    version?: {
        name: string;
        publisher?: LinkItem;
        artist?: LinkItem;
        language?: string;
        year_published: string | null;
        product_code: string;
        width: number;
        length: number;
        depth: number;
        weight: number;
    }
    stats?: {
        num_ratings: number;
        average: number;
        bayes_average: number;
        rank: number;
        sub_ranks: Array<SubRank>;
        std_dev: number;
        num_owned: number;
        min_players: number;
        max_players: number;
        playing_time: number;
        min_play_time: number;
        max_play_time: number;
    };
}

export interface CollectionResponse {
    terms_of_use: string;
    total_items: number;
    pub_date: Date;
    items: Array<CollectionItem>;
};

const mapCollection: (o: { data: any }) => CollectionResponse = ({ data }) => {
    let items: Array<CollectionItem> = data.items.item.map((i: any) => {
        const itemStatus = i.status[0].$;
        let status = {
            own: itemStatus.own === '1' ? true : false,
            prev_own: itemStatus.prevowned === '1' ? true : false,
            for_trade: itemStatus.fortrade === '1' ? true : false,
            want: itemStatus.want === '1' ? true : false,
            want_to_play: itemStatus.wanttoplay === '1' ? true : false,
            want_to_buy: itemStatus.wanttobuy === '1' ? true : false,
            wishlist: itemStatus.wishlist === '1' ? true : false,
            preordered: itemStatus.preordered === '1' ? true : false,
            last_modified: new Date(itemStatus.lastmodified)
        }

        let res: CollectionItem = {
            id: Number(i.$.objectid),
            name: i.name[0]._,
            type: i.$.subtype,
            status,
        }

        if (i.image) {
            res.image = i.image[0];
        }
        if (i.thumbnail) {
            res.thumbnail = i.thumbnail[0];
        }
        if (i.numplays) {
            res.num_plays = Number(i.numplays[0]);
        }
        if (i.yearpublished === '0') {
            res.year_published = null;
        } else if (i.yearpublished) {
            res.year_published = i.yearpublished[0]
        }
        if (i.originalname) {
            res.original_name = i.originalname[0]
        }
        if (i.version) {
            const version = i.version[0].item[0];
            const publisher = version.link.find((v: any) => v.$?.type === 'boardgamepublisher');
            const artist = version.link.find((v: any) => v.$?.type === 'boardgameartist');
            const language = version.link.find((v: any) => v.$?.type === 'language');

            res.version = {
                name: version.name[0].$.value,
                year_published: version.yearpublished[0].$.value === '0' ? null : version.yearpublished[0].$.value,
                product_code: version.productcode[0].$.value,
                width: Number(version.width[0].$.value),
                length: Number(version.length[0].$.value),
                depth: Number(version.depth[0].$.value),
                weight: Number(version.weight[0].$.value)
            }

            if (publisher) res.version.publisher = {
                id: Number(publisher.$.id),
                value: publisher.$.value
            }
            if (artist) res.version.artist = {
                id: Number(artist.$.id),
                value: artist.$.value
            }
            if (language) res.version.language = language.$.value
        }
        if (i.stats) {
            const stats = i.stats[0];
            const rating = stats.rating[0];

            res.rating = Number(rating.$.value);

            res.stats = {
                num_ratings: Number(rating.usersrated[0].$.value),
                average: Number(rating.average[0].$.value),
                bayes_average: Number(rating.bayesaverage[0].$.value),
                rank: Number(rating.ranks[0].rank.find((r: any) => r.$.name === 'boardgame').$.value) || -1,
                sub_ranks: rating.ranks[0].rank.filter((r: any) => r.$.name !== 'boardgame').map((r: any) => ({
                    family: r.$.name,
                    rank: Number(r.$.value) || -1
                })),
                std_dev: Number(rating.stddev[0].$.value),
                num_owned: Number(stats.$.numowned),
                min_players: Number(stats.$.minplayers),
                max_players: Number(stats.$.maxplayers),
                playing_time: Number(stats.$.playingtime),
                min_play_time: Number(stats.$.minplaytime),
                max_play_time: Number(stats.$.maxplaytime)
            }
        }

        return res;
    });

    return {
        terms_of_use: data.items.$.termsofuse,
        total_items: Number(data.items.$.totalitems),
        pub_date: new Date(data.items.$.pubdate),
        items
    }
};

export const collection = async (options: CollectionOptions, signal?: AbortSignal): Promise<CollectionResponse> => {
    if (options.wishlist_priority && (options.wishlist_priority < 1 || options.wishlist_priority > 5 || !Number.isInteger(options.wishlist_priority))) {
        throw Error('Wishlist priority must be at least 1, no greater than 5, and an integer')
    }
    if (options.min_rating && (options.min_rating < 1 || options.min_rating > 10)) {
        throw Error('Min rating must be at least 1 and no greater than 10')
    }

    let optionsObject: { [key: string]: string } = {};

    optionsObject.username = options.username;

    if (options.version) {
        optionsObject.version = '1';
    }
    if (options.exclude_subtype) {
        if (options.exclude_subtype === 'boardgame' || (options.exclude_subtype.length === 1 && options.exclude_subtype.includes('boardgame'))) {
            optionsObject.subtype = 'boardgameexpansion';
        } else {
            optionsObject.excludesubtype = Array.isArray(options.exclude_subtype)
                ? options.exclude_subtype.join(',')
                : options.exclude_subtype;
        }
    }
    if (options.id) {
        optionsObject.id = Array.isArray(options.id)
            ? options.id.join(',')
            : String(options.id);
    }
    if (options.brief) {
        optionsObject.brief = '1';
    }
    if (options.stats) {
        optionsObject.stats = '1';
    }
    if (options.own !== undefined) {
        optionsObject.own = options.own ? '1' : '0';
    }
    if (options.rated !== undefined) {
        optionsObject.rated = options.rated ? '1' : '0';
    }
    if (options.played !== undefined) {
        optionsObject.played = options.played ? '1' : '0';
    }
    if (options.comment !== undefined) {
        optionsObject.comment = options.comment ? '1' : '0';
    }
    if (options.trade !== undefined) {
        optionsObject.trade = options.trade ? '1' : '0';
    }
    if (options.want !== undefined) {
        optionsObject.want = options.want ? '1' : '0';
    }
    if (options.wishlist !== undefined) {
        optionsObject.wishlist = options.wishlist ? '1' : '0';
    }
    if (options.wishlist_priority === Number(options.wishlist_priority)) {
        optionsObject.wishlistpriority = String(options.wishlist_priority);
    }
    if (options.preordered !== undefined) {
        optionsObject.preordered = options.preordered ? '1' : '0';
    }
    if (options.want_to_play !== undefined) {
        optionsObject.wanttoplay = options.want_to_play ? '1' : '0';
    }
    if (options.want_to_buy !== undefined) {
        optionsObject.wanttobuy = options.want_to_buy ? '1' : '0';
    }
    if (options.prev_owned !== undefined) {
        optionsObject.prevowned = options.prev_owned ? '1' : '0';
    }
    if (options.has_parts !== undefined) {
        optionsObject.hasparts = options.has_parts ? '1' : '0';
    }
    if (options.want_parts !== undefined) {
        optionsObject.wantparts = options.want_parts ? '1' : '0';
    }
    if (options.min_rating === Number(options.min_rating)) {
        optionsObject.minrating = String(options.min_rating);
    }
    if (options.max_rating === Number(options.max_rating)) {
        optionsObject.rating = String(options.max_rating);
    }
    if (options.min_bgg_rating === Number(options.min_bgg_rating)) {
        optionsObject.minbggrating = String(options.min_bgg_rating);
    }
    if (options.max_bgg_rating === Number(options.max_bgg_rating)) {
        optionsObject.bggrating = String(options.max_bgg_rating);
    }
    if (options.min_plays === Number(options.min_plays)) {
        optionsObject.minplays = String(options.min_plays);
    }
    if (options.max_plays === Number(options.max_plays)) {
        optionsObject.maxplays = String(options.max_plays);
    }
    if (options.modified_since) {
        optionsObject.modifiedsince = new Date(options.modified_since).toISOString().split('T')[0].slice(2);
    }

    try {
        const totalCollection = await execute('collection', optionsObject, signal);
        const res = mapCollection(totalCollection);

        if (!options.exclude_subtype?.includes('boardgameexpansion')) {
            delete optionsObject.excludesubtype;
            await timeout(2000);
            const collectionOnlyExpansions = await execute('collection', {
                ...optionsObject,
                subtype: 'boardgameexpansion'
            }, signal)
            const expansionNames = collectionOnlyExpansions.data.items.item.map((i: any) => i.name[0]._);

            for (let item of res.items) {
                if (expansionNames.includes(item.name)) {
                    item.type = 'boardgameexpansion';
                }
            }
        }

        return res;
    } catch (error) {
        throw error;
    }
};
