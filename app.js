"use strict";
exports.__esModule = true;
var collection_1 = require("./routes/collection");
var family_1 = require("./routes/family");
var forum_1 = require("./routes/forum");
var geeklist_1 = require("./routes/geeklist");
var guild_1 = require("./routes/guild");
var hot_1 = require("./routes/hot");
var plays_1 = require("./routes/plays");
var search_1 = require("./routes/search");
var thing_1 = require("./routes/thing");
var thread_1 = require("./routes/thread");
var user_1 = require("./routes/user");
exports["default"] = {
    collection: collection_1.collection,
    family: family_1.family,
    forum: forum_1.forum,
    geeklist: geeklist_1.geeklist,
    guild: guild_1.guild,
    hot: hot_1.hot,
    plays: plays_1.plays,
    search: search_1.search,
    thing: thing_1.thing,
    thread: thread_1.thread,
    user: user_1.user
};
