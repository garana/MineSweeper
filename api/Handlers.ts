
import {Board} from "./Board";
import {v4 as uuidv4} from 'uuid/v4';
import {ServerSideError} from "./ServerSideError";
import {RequestError} from "./RequestError";
import {SESSION_NAME} from "./Config";
import {Game} from "./Game";

function uniqueId() {
	return uuidv4();
}

function sendError(res, error: Error | ServerSideError | RequestError) {
	// @ts-ignore
	if (error.serverSideError)
		return sendServerSideError(res, error.message);

	// @ts-ignore
	if (error.requestError)
		return sendRequestError(res, error.message);

	return sendServerSideError(res, "Internal error");
}

function sendRequestError(res, message: string) {
	res.status(409).json({ error: message });
}

function sendServerSideError(res, message: string) {
	res.status(503).json({ error: message });
}

function sendGame(res, game: Game) {
	res.status(200).json(game);
}

export function createBoard(req, res) {
	let width = parseInt(req.body.width);
	let height = parseInt(req.body.height);
	let sessionCreated = false;
	let boardId = req.cookies.boardId;

	if (!boardId) {
		sessionCreated = true;
		boardId = uniqueId();
		res.cookie(SESSION_NAME, boardId);
	}

	let game: Game;

	try {
		game = new Game(width, height);
	} catch (e /*: Error | ServerSideError | RequestError*/) {
		sendError(res, e);
		return;
	}

	store.set(boardId, JSON.stringify(game)).then( () => {
		sendGame(res, game);
	}, (err) => {
		sendServerSideError(res, err.message);
	})
}

function getGame(req, res): Promise<Game> {

	let boardId = req.cookies[SESSION_NAME];

	return store.get(boardId).then( (serialized: string) => {
		return Game.fromJSON(serialized);
	}, (err) => {
		sendServerSideError(res, "Could not retrieve your game at this time.");
	})
}

export function showBoard(req, res) {

	getGame(req, res).then( (game: Game) => {
		sendGame(res, game);
	});

}

export function processClick(req, res) {

	return getGame(req, res).then((game: Game) => {
		let x = parseInt(req.param.x);
		let y = parseInt(req.param.y);

		try {
			game.board.click(x, y)
		} catch (e) {
			sendError(res, e);
			return
		}

		sendGame(res, game);
	})

}

export function processFlag(req, res) {

	return getGame(req, res).then((game: Game) => {
		let x = parseInt(req.param.x);
		let y = parseInt(req.param.y);
		let flagged = parseInt(req.param.flagged);

		try {
			game.board.flag(x, y, !!flagged);
		} catch (e) {
			sendError(res, e);
			return
		}

		sendGame(res, game);
	})

}
