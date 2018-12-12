"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Board_1 = require("./Board");
var Game = /** @class */ (function () {
    function Game(width, height, _board) {
        this.width = width;
        this.height = height;
        this._board = new Board_1.Board(width, height, _board);
    }
    Object.defineProperty(Game.prototype, "board", {
        get: function () { return this._board; },
        enumerable: true,
        configurable: true
    });
    Game.prototype.toJSON = function () {
        return {
            width: this.width,
            height: this.height,
            cells: this._board.cells
        };
    };
    Game.fromJSON = function (json) {
        var js = JSON.parse(json);
        return new this(js.width, js.height, js.cells);
    };
    Game.prototype.publicView = function () {
        return {
            width: this.width,
            height: this.height,
            board: this.board.publicView()
        };
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=Game.js.map