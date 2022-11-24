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

interface LinkItem {
    id: number;
    value: string;
}

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

export {
    ThingType,
    PlayerCountVote,
    PlayerAgeVote,
    LanguageDependenceVote,
    LinkItem,
    Version,
    Video,
    SubRank,
    Listing,
    BggComment
}
