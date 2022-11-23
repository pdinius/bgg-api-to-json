import { collection } from './routes/collection';
import family from './routes/family';
import forumlist from './routes/forumlist';
import forums from './routes/forums';
import geeklist from './routes/geeklist';
import guilds from './routes/guilds';
import hot from './routes/hot';
import plays from './routes/plays';
import search from './routes/search';
import { thing } from './routes/thing';
import threads from './routes/threads';
import users from './routes/users';

const fs = require('fs');

collection({ username: 'phildinius', version: true }).then(d => {
    fs.writeFileSync('json_example3.json', JSON.stringify(d))
});

export const bggToJson = {
    collection,
    family,
    forumlist,
    forums,
    geeklist,
    guilds,
    hot,
    plays,
    search,
    thing,
    threads,
    users,
};