import { collection, CollectionOptions, CollectionResponse } from './routes/collection';
import { family, FamilyOptions, FamilyResponse } from './routes/family';
import { forum, ForumOptions, ForumResponse } from './routes/forum';
import { geeklist, GeeklistOptions, GeeklistResponse } from './routes/geeklist';
import { guild, GuildOptions, GuildResponse } from './routes/guild';
import { hot, HotOptions, HotResponse } from './routes/hot';
import { plays, PlaysOptions, PlaysResponse } from './routes/plays';
import { search, SearchOptions, SearchResponse } from './routes/search';
import { thing, ThingOptions, ThingResponse } from './routes/thing';
import { thread, ThreadOptions, ThreadResponse } from './routes/thread';
import { user, UserOptions, UserResponse } from './routes/user';

export type {
    CollectionOptions,
    CollectionResponse,
    FamilyOptions,
    FamilyResponse,
    ForumOptions,
    ForumResponse,
    GeeklistOptions,
    GeeklistResponse,
    GuildOptions,
    GuildResponse,
    HotOptions,
    HotResponse,
    PlaysOptions,
    PlaysResponse,
    SearchOptions,
    SearchResponse,
    ThingOptions,
    ThingResponse,
    ThreadOptions,
    ThreadResponse,
    UserOptions,
    UserResponse
}

export default {
    collection,
    family,
    forum,
    geeklist,
    guild,
    hot,
    plays,
    search,
    thing,
    thread,
    user
};
