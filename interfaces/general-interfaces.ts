type ThingType = 'boardgame' | 'boardgameexpansion' | 'boardgameaccessory';

interface LinkItem {
    id: number;
    value: string;
}

interface SubRank {
    family: string;
    rank: number;
}

export {
    ThingType,
    LinkItem,
    SubRank
}
