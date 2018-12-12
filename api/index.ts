
import * as express from 'express';
import * as process from 'process';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as Redis from 'redis';
import * as bluebird from 'bluebird';
import * as cookieParser from 'cookie-parser';

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

import {RequestHandler} from "./RequestHandler";
import {PersistenceStore} from "./PersistenceStore";
import {RedisPersistenceStore} from "./RedisPersistentStore";

let redis = Redis.createClient();
let store = new RedisPersistenceStore(redis);
let handler = new RequestHandler(store);

let app = express();
let port = process.env.PORT || 3088;
app.listen(port);
console.log(`MineSweeper listening on ${port}`);

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
