import { execute } from '../adapters/axios.adapter';
import { ThingType, LinkItem, SubRank } from '../interfaces/general-interfaces';

interface PlayerCountVote {
    total_votes: number;
    results: Array<{
        num_players: string;
        votes_best: number;
        votes_recommended: number;
        votes_not_recommended: number;
    }>;
};

interface PlayerAgeVote {
    total_votes: number;
    results: Array<{
        age: string;
        votes: number;
    }>;
};

interface LanguageDependenceVote {
    total_votes: number;
    results: Array<{
        value:
        'No necessary in-game text'
        | 'Some necessary text - easily memorized or small crib sheet'
        | 'Moderate in-game text - needs crib sheet or paste ups'
        | 'Extensive use of text - massive conversion needed to be playable'
        | 'Unplayable in another language'
        votes: number;
    }>;
};

interface Version {
    id: number;
    name: string;
    thumbnail_uri: string;
    image_uri: string;
    year_published: string | null;
    product_code: string;
    language: string;
    width: number | null;
    length: number | null;
    depth: number | null;
    weight: number | null;
    publishers: Array<LinkItem>;
    artists: Array<LinkItem>;
};

interface Video {
    id: number;
    title: string;
    category: 'review' | 'unboxing' | 'instructional' | 'session';
    language: string;
    link: string;
    username: string;
    userid: number;
    post_date: Date;
};

interface Listing {
    list_date: Date;
    price: {
        currency: string;
        value: string;
    }
    condition: 'new' | 'like new' | 'very good' | 'good' | 'acceptable';
    notes: string;
    link: string;
};

interface BggComment {
    username: string;
    rating?: number;
    comment?: string;
};

interface Thing {
    id: number;
    type: ThingType;
    base_game?: {
        id: number;
        name: string;
    };
    name: string;
    alternate_names: Array<string>;
    thumbnail_uri: string;
    image_uri: string;
    description: string;
    year_published: string | null;
    min_players: number;
    max_players: number;
    recommended_player_count?: PlayerCountVote;
    recommended_player_age?: PlayerAgeVote;
    language_dependence?: LanguageDependenceVote;
    playing_time: number;
    min_play_time: number;
    max_play_time: number;
    min_age: number;
    categories: Array<LinkItem>;
    mechanics: Array<LinkItem>;
    families: Array<LinkItem>;
    expansions: Array<LinkItem>;
    designers: Array<LinkItem>;
    artists: Array<LinkItem>;
    publishers: Array<LinkItem>;
    versions?: Array<Version>;
    videos?: Array<Video>;
    stats?: {
        num_ratings: number;
        average: number;
        bayes_average: number;
        rank: number;
        sub_ranks: Array<SubRank>;
        std_dev: number;
        num_owned: number;
        num_trading: number;
        num_wanting: number;
        num_wishing: number;
        avg_weight: number;
    };
    listings?: Array<Listing>;
    comments?: Array<BggComment>;
};

export interface ThingOptions {
    id: number | Array<number>;
    type?: ThingType | Array<ThingType>;
    versions?: boolean;
    videos?: boolean;
    stats?: boolean;
    marketplace?: boolean;
    ratings_and_comments?: 'comments' | 'both';
    page?: number;
    pagesize?: number;
};

export interface ThingResponse {
    terms_of_use: string;
    items: {
        [key: string]: Thing;
    }
};

const mapThing: (o: { data: any }) => ThingResponse = ({ data }) => {
    let things: { [key: string]: Thing } = {};

    for (let item of data.items.item) {
        const id = item.$.id;
        // votes
        const playerCountVote = item.poll.find((p: any) => p.$.name === 'suggested_numplayers');
        const playerAgeVote = item.poll.find((p: any) => p.$.name === 'suggested_playerage');
        const languageVote = item.poll.find((p: any) => p.$.name === 'language_dependence');
        // links
        const categories = item.link.filter((l: any) => l.$.type === 'boardgamecategory');
        const mechanics = item.link.filter((l: any) => l.$.type === 'boardgamemechanic');
        const families = item.link.filter((l: any) => l.$.type === 'boardgamefamily');
        const expansions = item.link.filter((l: any) => l.$.type === 'boardgameexpansion' && l.$.inbound === undefined);
        const designers = item.link.filter((l: any) => l.$.type === 'boardgamedesigner');
        const artists = item.link.filter((l: any) => l.$.type === 'boardgameartist');
        const publishers = item.link.filter((l: any) => l.$.type === 'boardgamepublisher');

        things[id] = {
            id: Number(item.$.id),
            type: item.$.type,
            name: item.name.find((n: any) => n.$.type === 'primary').$.value.trim(),
            alternate_names: item.name.filter((n: any) => n.$.type === 'alternate').map((n: any) => n.$.value.trim()),
            thumbnail_uri: item.thumbnail[0],
            image_uri: item.image[0],
            description: item.description[0].trim(),
            year_published: item.yearpublished[0].$.value === '0' ? null : item.yearpublished[0].$.value,
            min_players: Number(item.minplayers[0].$.value),
            max_players: Number(item.maxplayers[0].$.value),
            recommended_player_count: {
                total_votes: Number(playerCountVote.$.totalvotes),
                results: playerCountVote.results.map((v: any) => ({
                    num_players: v.$.numplayers,
                    votes_best: Number(v.result.find((r: any) => r.$.value === 'Best').$.numvotes),
                    votes_recommended: Number(v.result.find((r: any) => r.$.value === 'Recommended').$.numvotes),
                    votes_not_recommended: Number(v.result.find((r: any) => r.$.value === 'Not Recommended').$.numvotes),
                }))
            },
            recommended_player_age: {
                total_votes: Number(playerAgeVote.$.totalvotes),
                results: playerAgeVote.results[0].result.map((v: any) => ({
                    age: v.$.value,
                    votes: Number(v.$.numvotes)
                }))
            },
            language_dependence: {
                total_votes: Number(languageVote.$.totalvotes),
                results: languageVote.results[0].result.map((v: any) => ({
                    value: v.$.value,
                    votes: Number(v.$.numvotes)
                }))
            },
            playing_time: Number(item.playingtime[0].$.value),
            min_play_time: Number(item.minplaytime[0].$.value),
            max_play_time: Number(item.maxplaytime[0].$.value),
            min_age: Number(item.minage[0].$.value),
            categories: categories.map((v: any) => ({
                id: Number(v.$.id),
                value: v.$.value
            })),
            mechanics: mechanics.map((v: any) => ({
                id: Number(v.$.id),
                value: v.$.value
            })),
            families: families.map((v: any) => ({
                id: Number(v.$.id),
                value: v.$.value
            })),
            expansions: expansions.map((v: any) => ({
                id: Number(v.$.id),
                value: v.$.value
            })),
            designers: designers.map((v: any) => ({
                id: Number(v.$.id),
                value: v.$.value
            })),
            artists: artists.map((v: any) => ({
                id: Number(v.$.id),
                value: v.$.value
            })),
            publishers: publishers.map((v: any) => ({
                id: Number(v.$.id),
                value: v.$.value
            }))
        };

        if (item.versions) {
            things[id].versions = item.versions.item.map((v: any) => {
                const versionPublishers = v.link.filter((l: any) => l.$.type === 'boardgamepublisher');
                const versionArtists = v.link.filter((l: any) => l.$.type === 'boardgameartist');

                return {
                    id: Number(v.$.id),
                    name: v.name.find((n: any) => n.$.type === 'primary').$.value,
                    thumbnail_uri: v.thumbnail[0],
                    image_uri: v.image[0],
                    year_published: v.yearpublished[0].$.value === '0' ? null : v.yearpublished[0].$.value,
                    product_code: v.productcode[0].$.value,
                    language: v.link.find((l: any) => l.$.type === 'language').$.value,
                    width: Number(v.width.$.value),
                    length: Number(v.length.$.value),
                    depth: Number(v.depth.$.value),
                    weight: Number(v.weight.$.value),
                    publishers: versionPublishers.map((v: any) => ({
                        id: Number(v.$.id),
                        value: v.$.value
                    })),
                    artists: versionArtists.map((v: any) => ({
                        id: Number(v.$.id),
                        value: v.$.value
                    }))
                }
            });
        }

        if (item.videos) {
            things[id].videos = item.videos.map((v: any) => ({
                id: Number(v.$.id),
                title: v.$.title,
                category: v.$.category,
                language: v.$.language,
                link: v.$.link,
                username: v.$.username,
                userid: v.$.userid,
                post_date: new Date(v.$.postdate)
            }))
        }

        if (item.statistics) {
            const stats = item.statistics[0].ratings[0];

            things[id].stats = {
                num_ratings: Number(stats.usersrated[0].$.value),
                average: Number(stats.average[0].$.value),
                bayes_average: Number(stats.bayesaverage[0].$.value),
                rank: Number(stats.ranks[0].rank.find((r: any) => r.$.name === 'boardgame').value) || -1,
                sub_ranks: stats.ranks[0].rank.filter((f: any) => f.$.name !== 'boardgame').map((f: any) => ({
                    family: f.$.name,
                    rank: Number(f.$.value) || -1
                })),
                std_dev: Number(stats.stddev[0].$.value),
                num_owned: Number(stats.owned[0].$.value),
                num_trading: Number(stats.trading[0].$.value),
                num_wanting: Number(stats.wanting[0].$.value),
                num_wishing: Number(stats.wishing[0].$.value),
                avg_weight: Number(stats.averageweight[0].$.value)
            }
        }

        if (item.marketplacelistings) {
            const listings = item.marketplacelistings[0].listing;

            things[id].listings = listings.map((l: any) => ({
                list_date: new Date(l.listdate[0].$.value),
                price: {
                    currency: l.price[0].$.currency,
                    value: l.price[0].$.value
                },
                condition: l.condition[0].$.value.replace(/verygood|likenew/, (m: any) => m === 'verygood' ? 'very good' : 'like new'),
                notes: l.notes[0].$.value,
                link: l.link[0].$.href
            }));
        }

        if (item.comments) {
            const comments = item.comments[0].comment;

            things[id].comments = comments.map((c: any) => {
                let res: BggComment = { username: c.$.username };
                if (c.$.rating !== 'N/A') res.rating = Number(c.$.rating);
                if (c.$.value) res.comment = c.$.value;
                return res;
            });
        }
    }

    return {
        terms_of_use: data.items.$.termsofuse,
        items: things
    };
};

export const thing = (options: ThingOptions, signal?: AbortSignal): Promise<ThingResponse> => {
    if (options.page && !Number.isInteger(options.page)) {
        throw Error('Page must be an integer number')
    }
    if (options.pagesize && (options.pagesize < 10 || options.pagesize > 100 || !Number.isInteger(options.pagesize))) {
        throw Error('Page size must be at least 10, at most 100, and an integer');
    }

    let optionsObject: { [key: string]: string } = {};

    optionsObject.id = Array.isArray(options.id) ? options.id.join(',') : String(options.id);

    if (options.type) {
        optionsObject.type = Array.isArray(options.type) ? options.type.join(',') : options.type;
    }
    if (options.versions) {
        optionsObject.versions = '1';
    }
    if (options.videos) {
        optionsObject.videos = '1';
    }
    if (options.stats) {
        optionsObject.stats = '1';
    }
    if (options.marketplace) {
        optionsObject.marketplace = '1';
    }
    if (options.ratings_and_comments === 'comments') {
        optionsObject.comments = '1';
    } else if (options.ratings_and_comments === 'both') {
        optionsObject.ratingcomments = '1';
    }
    if (options.page === Number(options.page)) {
        optionsObject.page = String(options.page);
    }
    if (options.pagesize === Number(options.pagesize)) {
        optionsObject.pagesize = String(options.pagesize);
    }

    return execute('thing', optionsObject, signal).then(mapThing);
};
