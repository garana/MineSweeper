"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var RequestError_1 = require("./RequestError");
var Cell_1 = require("./Cell");
/**
 * The board is represented as an array of rows, from top to bottom, left to
 * right.
 */
var Board = /** @class */ (function () {
    function Board(width, height, mines, _cells) {
        this.width = width;
        this.height = height;
        this.mines = mines;
        this._cells = _cells;
        if (_cells) {
            this._cells = _cells.map(function (row) {
                return row.map(function (cell) {
                    return new Cell_1.Cell(cell.hasMine, cell.visible, cell.neighborMines, cell.flagged);
                });
            });
        }
        else {
            /**
             * These checks are performed only when we are creating a new
             * board, to allow backwards compatibility in case the limits
             * are modified.
             */
            if (!isFinite(width))
                throw new RequestError_1.RequestError("Missing mandatory \"width\" parameter.");
            if (!isFinite(height))
                throw new RequestError_1.RequestError("Missing mandatory \"height\" parameter.");
            if (this.width < Config_1.MIN_BOARD_WIDTH)
                throw new RequestError_1.RequestError("Board can't be narrower than " + Config_1.MIN_BOARD_WIDTH);
            if (this.width > Config_1.MAX_BOARD_WIDTH)
                throw new RequestError_1.RequestError("Board can't be wider than " + Config_1.MAX_BOARD_WIDTH);
            if (this.height < Config_1.MIN_BOARD_HEIGHT)
                throw new RequestError_1.RequestError("Board can't be shorter than " + Config_1.MIN_BOARD_HEIGHT);
            if (this.height > Config_1.MAX_BOARD_HEIGHT)
                throw new RequestError_1.RequestError("Board can't be taller than " + Config_1.MAX_BOARD_HEIGHT);
            this._cells = [];
            for (var y = 0; y < height; ++y) {
                var cell_row = [];
                for (var x = 0; x < width; ++x) {
                    cell_row.push(new Cell_1.Cell(false, false, 0, false));
                }
                this._cells.push(cell_row);
            }
            for (var imine = this.mines; imine--;) {
                while (true) {
                    var x = Math.floor(Math.random() * this.width);
                    var y = Math.floor(Math.random() * this.height);
                    // Although not possible as stated by Math.random specs,
                    // we'd rather catch edge cases bugs.
                    if (x === this.width)
                        continue;
                    if (y === this.height)
                        continue;
                    if (this._cells[y][x].hasMine)
                        continue;
                    this._cells[y][x].hasMine = true;
                    break;
                }
            }
            for (var x = width; x--;)
                for (var y = height; y--;)
                    this._cells[y][x].neighborMines =
                        (this._hasBombSafe(x + 1, y) ? 1 : 0) +
                            (this._hasBombSafe(x - 1, y) ? 1 : 0) +
                            (this._hasBombSafe(x, y + 1) ? 1 : 0) +
                            (this._hasBombSafe(x, y - 1) ? 1 : 0);
        }
    }
    Board.prototype._coordsInRange = function (x, y) {
        return (x >= 0) &&
            (y >= 0) &&
            (x < this.width) &&
            (y < this.height);
    };
    Board.prototype._hasBombSafe = function (x, y) {
        return this._coordsInRange(x, y) ?
            this._cells[y][x].hasMine :
            false;
    };
    Board.prototype._spread_neighbors = function (x, y) {
        this._spread(x + 1, y);
        this._spread(x - 1, y);
        this._spread(x, y + 1);
        this._spread(x, y - 1);
    };
    Board.prototype._spread = function (x, y) {
        if (!this._coordsInRange(x, y))
            return;
        var cell = this._cells[y][x];
        if (cell.visible)
            return;
        if (cell.hasMine)
            return;
        cell.visible = true;
        this._spread_neighbors(x, y);
    };
    /**
     * If x or y values are invalid, a RequestError exception is thrown.
     * @param x
     * @param y
     * @private
     */
    Board.prototype._checkCoords = function (x, y) {
        if (Math.floor(x) !== x)
            throw new RequestError_1.RequestError("Cell coordinates must be non-negative integers");
        if (Math.floor(y) !== y)
            throw new RequestError_1.RequestError("Cell coordinates must be non-negative integers");
        if (x >= this.width)
            throw new RequestError_1.RequestError("'x' coordinate is out of range");
        if (y >= this.height)
            throw new RequestError_1.RequestError("'y' coordinate is out of range");
    };
    /**
     * Process a click on a cell, returning false iff clicked on a bomb,
     * true otherwise.
     * @param x
     * @param y
     */
    Board.prototype.click = function (x, y) {
        this._checkCoords(x, y);
        var cell = this._cells[y][x];
        // If it's already visible, no action is required.
        if (cell.visible)
            return;
        cell.visible = true;
        if (cell.hasMine)
            return false;
        this._spread_neighbors(x, y);
        return true;
    };
    /**
     * Turns on/off the flag value of a (hidden) cell.
     */
    Board.prototype.flag = function (x, y, newValue) {
        this._checkCoords(x, y);
        var cell = this._cells[y][x];
        if (cell.visible)
            throw new RequestError_1.RequestError("Cell is already visible");
        cell.flagged = newValue;
    };
    Object.defineProperty(Board.prototype, "cells", {
        get: function () { return this._cells; },
        enumerable: true,
        configurable: true
    });
    Board.prototype.publicView = function () {
        return this._cells.map(function (row) {
            return row.map(function (cell) {
                return cell.publicView();
            });
        });
    };
    return Board;
}());
exports.Board = Board;
//# sourceMappingURL=Board.js.map