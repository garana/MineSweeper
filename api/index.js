"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var process = require("process");
var path = require("path");
var bodyParser = require("body-parser");
var Redis = require("redis");
var bluebird = require("bluebird");
var cookieParser = require("cookie-parser");
bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);
var RequestHandler_1 = require("./RequestHandler");
var RedisPersistentStore_1 = require("./RedisPersistentStore");
var redis = Redis.createClient();
var store = new RedisPersistentStore_1.RedisPersistenceStore(redis);
var handler = new RequestHandler_1.RequestHandler(store);
var app = express();
var port = process.env.PORT || 3088;
app.listen(port);
console.log("MineSweeper listening on " + port);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/../build', 'public')));
app.route('/game')
    .post(handler.createBoard.bind(handler))
    .get(handler.showBoard.bind(handler));
app.route('/click')
    .post(handler.processClick.bind(handler));
app.route('/flag')
    .post(handler.processFlag.bind(handler));
//# sourceMappingURL=index.js.map