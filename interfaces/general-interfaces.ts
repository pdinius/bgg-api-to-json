type ThingType = 'boardgame' | 'boardgameexpansion' | 'boardgameaccessory';

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

interface Category {
    id: number;
    value: string;
}

interface Mechanic {
    id: number;
    value: string;
}

interface Family {
    id: number;
    value: string;
}

interface Expansion {
    id: number;
    value: string;
}

interface Designer {
    id: number;
    value: string;
}

interface Artist {
    id: number;
    value: string;
}

interface Publisher {
    id: number;
    value: string;
}

interface Version {
    id: number;
    name: string;
    thumbnail: string;
    image: string;
    year_published: string;
    product_code: string;
    language: string;
    width: number | null;
    length: number | null;
    depth: number | null;
    weight: number | null;
    publishers: Array<Publisher>;
    artists: Array<Artist>;
}

interface Video {
    id: number;
    title: string;
    category: 'review' | 'unboxing' | 'instructional' | 'session';
    language: string;
    link: string;
    username: string;
    userid: number;
    post_date: Date;
}

interface SubRank {
    family: string;
    rank: number;
}

interface Listing {
    list_date: Date;
    price: {
        currency: string;
        value: string;
    }
    condition: 'new' | 'like new' | 'very good' | 'good' | 'acceptable';
    notes: string;
    link: string;
}

interface BggComment {
    username: string;
    rating?: number;
    comment?: string;
}

interface Thing {
    id: number;
    type: ThingType;
    base_game?: {
        id: number;
        name: string;
    };
    name: string;
    alternate_names: Array<string>;
    thumbnail: string;
    image: string;
    description: string;
    year_published: string;
    min_players: number;
    max_players: number;
    recommended_player_count: PlayerCountVote;
    recommended_player_age: PlayerAgeVote;
    language_dependence: LanguageDependenceVote;
    playing_time: number;
    min_play_time: number;
    max_play_time: number;
    min_age: number;
    categories: Array<Category>;
    mechanics: Array<Mechanic>;
    families: Array<Family>;
    expansions: Array<Expansion>;
    designers: Array<Designer>;
    artists: Array<Artist>;
    publishers: Array<Publisher>;
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
}

interface Item {
    id: number;
    name: string;
    original_name?: string;
    type: ThingType;
    year_published?: string;
    image?: string;
    thumbnail?: string;
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
        publisher?: Publisher;
        artist?: Artist;
        language?: string;
        year_published: string;
        product_code: string;
        width: number;
        length: number;
        depth: number;
        weight: number;
    }
}

interface Collection {
    total_items: number;
    pub_date: Date;
    items: Array<Item>;
}

export {
    ThingType,
    PlayerCountVote,
    PlayerAgeVote,
    LanguageDependenceVote,
    Category,
    Mechanic,
    Family,
    Expansion,
    Designer,
    Artist,
    Publisher,
    Thing,
    Collection,
    BggComment,
    Item
}
