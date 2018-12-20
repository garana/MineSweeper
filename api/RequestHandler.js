"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidv4 = require("uuid/v4");
var Config_1 = require("./Config");
var Game_1 = require("./Game");
var RequestHandler = /** @class */ (function () {
    function RequestHandler(store) {
        this.store = store;
    }
    RequestHandler.prototype.uniqueId = function () {
        return uuidv4();
    };
    RequestHandler.prototype.sendError = function (res, error) {
        // @ts-ignore
        if (error.serverSideError)
            return this.sendServerSideError(res, error.message);
        // @ts-ignore
        if (error.requestError)
            return this.sendRequestError(res, error.message);
        return this.sendServerSideError(res, "Internal error");
    };
    RequestHandler.prototype.sendRequestError = function (res, message) {
        if (!res._response_sent)
            res.status(409).json({ error: message });
        res._response_sent = true;
    };
    RequestHandler.prototype.sendServerSideError = function (res, message) {
        if (!res._response_sent)
            res.status(503).json({ error: message });
        res._response_sent = true;
    };
    RequestHandler.prototype.sendGame = function (res, game) {
        if (!res._response_sent)
            res.status(200).json(game.publicView());
        res._response_sent = true;
    };
    RequestHandler.prototype.createBoard = function (req, res) {
        var _this = this;
        var width = parseInt(req.body.width);
        var height = parseInt(req.body.height);
        var mines = Math.max(0, Math.min(Math.sqrt(width * height), parseInt(req.body.mines) || 5));
        var sessionCreated = false;
        var boardId = req.cookies ? req.cookies.boardId : null;
        if (!boardId) {
            sessionCreated = true;
            boardId = this.uniqueId();
            res.cookie(Config_1.SESSION_NAME, boardId);
        }
        var game;
        try {
            game = new Game_1.Game(width, height, mines, false);
        }
        catch (e /*: Error | ServerSideError | RequestError*/) {
            this.sendError(res, e);
            return;
        }
        this.store.set(boardId, JSON.stringify(game)).then(function () {
            _this.sendGame(res, game);
        }, function (err) {
            _this.sendServerSideError(res, err.message);
        });
    };
    RequestHandler.prototype.getGame = function (req, res) {
        var _this = this;
        var boardId = req.cookies ? req.cookies[Config_1.SESSION_NAME] : null;
        if (!boardId) {
            this.sendRequestError(res, "Missing cookie " + Config_1.SESSION_NAME);
            return new Promise(function (res, rej) { return rej(false); });
        }
        return this.store.get(boardId).then(function (serialized) {
            return Game_1.Game.fromJSON(serialized);
        }, function (err) {
            _this.sendServerSideError(res, "Could not retrieve your game at this time.");
            throw err;
            // return new Promise( (res, rej) => rej(null));
        });
    };
    RequestHandler.prototype.saveGame = function (req, res, game) {
        var _this = this;
        var boardId = req.cookies ? req.cookies[Config_1.SESSION_NAME] : null;
        if (!boardId) {
            this.sendRequestError(res, "Missing cookie " + Config_1.SESSION_NAME);
            return new Promise(function (res, rej) { return rej(false); });
        }
        return this.store.set(boardId, JSON.stringify(game)).then(function () {
            return game;
        }, function (err) {
            _this.sendServerSideError(res, err.message);
            throw err;
        });
    };
    RequestHandler.prototype.showBoard = function (req, res) {
        var _this = this;
        this.getGame(req, res).then(function (game) {
            _this.sendGame(res, game);
        });
    };
    RequestHandler.prototype.processClick = function (req, res) {
        var _this = this;
        return this.getGame(req, res).then(function (game) {
            var x = parseInt(req.body.x);
            var y = parseInt(req.body.y);
            try {
                game.click(x, y);
                _this.saveGame(req, res, game).then(function () {
                    _this.sendGame(res, game);
                });
            }
            catch (e) {
                if (res)
                    _this.sendError(res, e);
                return;
            }
        });
    };
    RequestHandler.prototype.processFlag = function (req, res) {
        var _this = this;
        return this.getGame(req, res).then(function (game) {
            var x = parseInt(req.body.x);
            var y = parseInt(req.body.y);
            var flagged = parseInt(req.body.flagged);
            try {
                game.board.flag(x, y, !!flagged);
                _this.saveGame(req, res, game).then(function () {
                    _this.sendGame(res, game);
                });
            }
            catch (e) {
                _this.sendError(res, e);
                return;
            }
        });
    };
    return RequestHandler;
}());
exports.RequestHandler = RequestHandler;
//# sourceMappingURL=RequestHandler.js.map