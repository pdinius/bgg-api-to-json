import { execute } from '../adapters/axios.adapter';

export interface GuildOptions {
    id: number;
    members?: boolean;
    sort?: 'username' | 'date';
    page?: number;
};

export interface GuildResponse {
    terms_of_use: string;
    id: number;
    name: string;
    created: Date;
    category: 'event' | 'group' | 'store' | 'hobby' | 'language' | 'occupation' | 'pbem' | 'podcast' | 'region';
    website: string | null;
    manager: string;
    description: string;
    location: {
        addr1: string;
        addr2: string;
        city: string;
        state_or_province: string;
        postal_code: string;
        country: string;
    };
};

const mapGuild: (o: { data: any }) => GuildResponse = ({ data }) => {
    const { guild } = data;

    return {
        terms_of_use: guild.$.termsofuse,
        id: Number(guild.$.id),
        name: guild.$.name,
        created: new Date(guild.$.created),
        category: guild.category[0],
        website: guild.website[0] || null,
        manager: guild.manager[0],
        description: guild.description[0],
        location: {
            addr1: guild.location[0].addr1[0],
            addr2: guild.location[0].addr2[0],
            city: guild.location[0].city[0],
            state_or_province: guild.location[0].stateorprovince[0],
            postal_code: guild.location[0].postalcode[0],
            country: guild.location[0].country[0]
        }
    }
};

export const guild = (options: GuildOptions, signal?: AbortSignal): Promise<GuildResponse> => {
    // data checks

    let optionsObject: { [key: string]: string } = {};

    optionsObject.id = String(options.id);
    
    if (options.members) {
        optionsObject.members = '1';
    }
    if (options.sort && /^(?:username|date)$/.test(options.sort)) {
        optionsObject.sort = options.sort;
    }
    if (options.page) {
        optionsObject.page = String(options.page);
    }

    return execute('guild', optionsObject, signal).then(mapGuild);
};
