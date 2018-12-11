System.register(["uuid/v4", "./Config", "./Game"], function (exports_1, context_1) {
    "use strict";
    var v4_1, Config_1, Game_1;
    var __moduleName = context_1 && context_1.id;
    function uniqueId() {
        return v4_1.v4();
    }
    function sendError(res, error) {
        // @ts-ignore
        if (error.serverSideError)
            return sendServerSideError(res, error.message);
        // @ts-ignore
        if (error.requestError)
            return sendRequestError(res, error.message);
        return sendServerSideError(res, "Internal error");
    }
    function sendRequestError(res, message) {
        res.status(409).json({ error: message });
    }
    function sendServerSideError(res, message) {
        res.status(503).json({ error: message });
    }
    function sendGame(res, game) {
        res.status(200).json(game);
    }
    function createBoard(req, res) {
        let width = parseInt(req.body.width);
        let height = parseInt(req.body.height);
        let sessionCreated = false;
        let boardId = req.cookies.boardId;
        if (!boardId) {
            sessionCreated = true;
            boardId = uniqueId();
            res.cookie(Config_1.SESSION_NAME, boardId);
        }
        let game;
        try {
            game = new Game_1.Game(width, height);
        }
        catch (e /*: Error | ServerSideError | RequestError*/) {
            sendError(res, e);
            return;
        }
        store.set(boardId, JSON.stringify(game)).then(() => {
            sendGame(res, game);
        }, (err) => {
            sendServerSideError(res, err.message);
        });
    }
    exports_1("createBoard", createBoard);
    function getGame(req, res) {
        let boardId = req.cookies[Config_1.SESSION_NAME];
        return store.get(boardId).then((serialized) => {
            return Game_1.Game.fromJSON(serialized);
        }, (err) => {
            sendServerSideError(res, "Could not retrieve your game at this time.");
        });
    }
    function showBoard(req, res) {
        getGame(req, res).then((game) => {
            sendGame(res, game);
        });
    }
    exports_1("showBoard", showBoard);
    function processClick(req, res) {
        return getGame(req, res).then((game) => {
            let x = parseInt(req.param.x);
            let y = parseInt(req.param.y);
            try {
                game.board.click(x, y);
            }
            catch (e) {
                sendError(res, e);
                return;
            }
            sendGame(res, game);
        });
    }
    exports_1("processClick", processClick);
    function processFlag(req, res) {
        return getGame(req, res).then((game) => {
            let x = parseInt(req.param.x);
            let y = parseInt(req.param.y);
            let flagged = parseInt(req.param.flagged);
            try {
                game.board.flag(x, y, !!flagged);
            }
            catch (e) {
                sendError(res, e);
                return;
            }
            sendGame(res, game);
        });
    }
    exports_1("processFlag", processFlag);
    return {
        setters: [
            function (v4_1_1) {
                v4_1 = v4_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (Game_1_1) {
                Game_1 = Game_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=Handlers.js.map