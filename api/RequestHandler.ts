
import {Board} from "./Board";
import * as uuidv4 from 'uuid/v4';
import {ServerSideError} from "./ServerSideError";
import {RequestError} from "./RequestError";
import {SESSION_NAME} from "./Config";
import {Game} from "./Game";
import {PersistenceStore} from "./PersistenceStore";
import assert = require("assert");


export class RequestHandler {

	constructor(readonly store: PersistenceStore) {
	}
	
	uniqueId() {
		return uuidv4();
	}
	
	sendError(res, error: Error | ServerSideError | RequestError) {
		// @ts-ignore
		if (error.serverSideError)
			return this.sendServerSideError(res, error.message);

		// @ts-ignore
		if (error.requestError)
			return this.sendRequestError(res, error.message);

		return this.sendServerSideError(res, "Internal error");
	}

	sendRequestError(res, message: string) {
		if (!res._response_sent)
			res.status(409).json({ error: message });
		res._response_sent = true;
	}

	sendServerSideError(res, message: string) {
		if (!res._response_sent)
			res.status(503).json({ error: message });
		res._response_sent = true;
	}

	sendGame(res, game: Game) {
		if (!res._response_sent)
			res.status(200).json(game.publicView());
		res._response_sent = true;
	}

	createBoard(req, res) {
		let width = parseInt(req.body.width);
		let height = parseInt(req.body.height);
		let sessionCreated = false;
		let boardId = req.cookies ? req.cookies.boardId : null;

		if (!boardId) {
			sessionCreated = true;
			boardId = this.uniqueId();
			res.cookie(SESSION_NAME, boardId);
		}

		let game: Game;

		try {
			game = new Game(width, height);
		} catch (e /*: Error | ServerSideError | RequestError*/) {
			this.sendError(res, e);
			return;
		}

		this.store.set(boardId, JSON.stringify(game)).then( () => {
			this.sendGame(res, game);
		}, (err) => {
			this.sendServerSideError(res, err.message);
		})
	}

	getGame(req, res): Promise<Game> {

		let boardId = req.cookies ? req.cookies[SESSION_NAME] : null;

		if (!boardId) {
			this.sendRequestError(res, `Missing cookie ${SESSION_NAME}`);
			return new Promise<Game>((res, rej) => rej(false));
		}

		return this.store.get(boardId).then( (serialized: string) => {
			return Game.fromJSON(serialized);
		}, (err) => {
			this.sendServerSideError(res, "Could not retrieve your game at this time.");
			throw err;
			// return new Promise( (res, rej) => rej(null));
		})
	}

	saveGame(req, res, game: Game): Promise<Game> {

		let boardId = req.cookies ? req.cookies[SESSION_NAME] : null;

		if (!boardId) {
			this.sendRequestError(res, `Missing cookie ${SESSION_NAME}`);
			return new Promise<Game>((res, rej) => rej(false));
		}

		return this.store.set(boardId, JSON.stringify(game)).then( () => {
			return game;
		}, (err) => {
			this.sendServerSideError(res, err.message);
			throw err;
		});
	}

	showBoard(req, res) {

		this.getGame(req, res).then( (game: Game) => {
			this.sendGame(res, game);
		});

	}

	processClick(req, res) {

		return this.getGame(req, res).then((game: Game) => {
			let x = parseInt(req.body.x);
			let y = parseInt(req.body.y);

			try {
				game.board.click(x, y)
				this.saveGame(req, res, game).then( () => {
					this.sendGame(res, game);
				})
			} catch (e) {
				if (res)
				this.sendError(res, e);
				return
			}

		})

	}

	processFlag(req, res) {

		return this.getGame(req, res).then((game: Game) => {
			let x = parseInt(req.body.x);
			let y = parseInt(req.body.y);
			let flagged = parseInt(req.body.flagged);

			try {
				game.board.flag(x, y, !!flagged);
				this.saveGame(req, res, game).then( () => {
					this.sendGame(res, game);
				})
			} catch (e) {
				this.sendError(res, e);
				return
			}
		})

	}

}
