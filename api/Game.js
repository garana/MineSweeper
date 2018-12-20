"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Board_1 = require("./Board");
var Game = /** @class */ (function () {
    function Game(width, height, mines, _lost, _board) {
        this.width = width;
        this.height = height;
        this.mines = mines;
        this._lost = _lost;
        this._board = new Board_1.Board(width, height, mines, _board);
    }
    Object.defineProperty(Game.prototype, "board", {
        get: function () { return this._board; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "lost", {
        get: function () { return this._lost; },
        enumerable: true,
        configurable: true
    });
    Game.prototype.won = function () {
        return this._board.won();
    };
    Game.prototype.toJSON = function () {
        return {
            width: this.width,
            height: this.height,
            mines: this.mines,
            lost: this.lost,
            won: this.won(),
            cells: this._board.cells
        };
    };
    Game.fromJSON = function (json) {
        var js = JSON.parse(json);
        return new this(js.width, js.height, js.mines, js.lost, js.cells);
    };
    Game.prototype.click = function (x, y) {
        if (!this.board.click(x, y)) {
            /* He clicked on a mine */
            this._lost = true;
        }
    };
    Game.prototype.flag = function (x, y, flagged) {
        this.board.flag(x, y, !!flagged);
    };
    Game.prototype.publicView = function () {
        return {
            width: this.width,
            height: this.height,
            mines: this.mines,
            lost: this.lost,
            won: this.won(),
            board: this.board.publicView()
        };
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=Game.js.map