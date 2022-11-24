import { execute } from '../adapters/axios.adapter';
import { convert } from '../utils/convertXmlToJson';

interface UserOptions {
    username: string;
    buddies?: boolean;
    guilds?: boolean;
    top?: boolean;
    page?: number;
};

interface Buddy {
    id: number;
    username: string;
}

interface Guild {
    id: number;
    name: string;
}

interface TopGame {
    id: number;
    name: string;
    rank: number;
}

interface UserResponse {
    terms_of_use: string;
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar_uri: string;
    year_registered: string;
    last_login: Date;
    state_or_province: string;
    country: string;
    web_address: string;
    trade_rating: number;
    buddy_count?: number;
    buddy_page?: number;
    buddies?: Array<Buddy>;
    guild_count?: number;
    guild_page?: number;
    guilds?: Array<Guild>;
    top_games?: Array<TopGame>;
};

const mapUser: (o: { error: string | null, response: any }) => UserResponse = ({ error, response }) => {
    try {
        if (error) {
            throw Error(error);
        }

        const { user } = response;

        const res: UserResponse = {
            terms_of_use: user.$.termsofuse,
            id: Number(user.$.id),
            username: user.$.name,
            first_name: user.firstname[0].$.value,
            last_name: user.lastname[0].$.value,
            avatar_uri: user.avatarlink[0].$.value,
            year_registered: user.yearregistered[0].$.value,
            last_login: new Date(user.lastlogin[0].$.value),
            state_or_province: user.stateorprovince[0].$.value,
            country: user.country[0].$.value,
            web_address: user.webaddress[0].$.value,
            trade_rating: Number(user.traderating[0].$.value)
        }

        if (user.buddies) {
            const buddyInfo = user.buddies[0];
            res.buddy_count = Number(buddyInfo.$.total);
            res.buddy_page = Number(buddyInfo.$.page);
            res.buddies = buddyInfo.buddy.map(({ $: b }) => ({
                id: Number(b.id),
                username: b.name
            }))
        }

        if (user.guilds) {
            const guildInfo = user.guilds[0];
            res.guild_count = Number(guildInfo.$.total);
            res.guild_page = Number(guildInfo.$.page);
            res.guilds = guildInfo.guild.map(({ $: g }) => ({
                id: Number(g.id),
                name: g.name
            }))
        }

        if (user.top) {
            res.top_games = user.top[0].item.map(({ $: t }) => ({
                id: Number(t.id),
                name: t.name,
                rank: Number(t.rank)
            }));
        }

        return res;
    } catch (e) {
        console.log(e);
        return {} as UserResponse;
    }
};

export const user = (options: UserOptions, signal?: AbortSignal): Promise<UserResponse> => {
    let optionsObject: { [key: string]: string } = {};

    optionsObject.name = options.username;

    if (options.buddies) {
        optionsObject.buddies = '1';
    }
    if (options.guilds) {
        optionsObject.guilds = '1';
    }
    if (options.top) {
        optionsObject.top = '1';
        optionsObject.domain = 'boardgame';
    }
    if (options.page) {
        optionsObject.page = String(options.page);
    }

    return execute('user', optionsObject, signal)
        .then(convert)
        .then(mapUser);
};
