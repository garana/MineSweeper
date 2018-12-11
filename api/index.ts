
import * as express from 'express';
import * as process from 'process';
import * as path from 'path';
import * as bodyParser from 'body-parser';

import {createBoard, processClick, processFlag, showBoard} from "./Handlers";

let app = express();
let port = process.env.PORT || 80;
app.listen(port);
console.log(`MineSweeper listening on ${port}`);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname + '/../build', 'public')));

app.route('/game')
	.post(createBoard)
	.get(showBoard);

app.route('/click')
	.post(processClick);

app.route('/flag')
	.post(processFlag);
