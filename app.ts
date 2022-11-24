import { collection } from './routes/collection';
import { family } from './routes/family';
import { forum } from './routes/forum';
import { geeklist } from './routes/geeklist';
import { guild } from './routes/guild';
import { hot } from './routes/hot';
import { plays } from './routes/plays';
import { search } from './routes/search';
import { thing } from './routes/thing';
import { thread } from './routes/thread';
import { user } from './routes/user';

const fs = require('fs');

user({ username: 'phildinius', top: true, buddies: true }).then(d => {
    fs.writeFileSync('./examples/json_example3.json', JSON.stringify(d))
}).catch(e => {
    console.log(e);
});

export const bggToJson = {
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