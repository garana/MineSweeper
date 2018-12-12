"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var RequestError_1 = require("./RequestError");
var Cell_1 = require("./Cell");
var Board = /** @class */ (function () {
    function Board(width, height, _cells) {
        this.width = width;
        this.height = height;
        this._cells = _cells;
        if (_cells) {
            this._cells = _cells.map(function (row) {
                return row.map(function (cell) {
                    return new Cell_1.Cell(cell.hasBomb, cell.visible, cell.neighborBombs, cell.flagged);
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
                    cell_row.push(new Cell_1.Cell(Math.random() > .7, false, 0, false));
                }
                this._cells.push(cell_row);
            }
            for (var x = width; x--;)
                for (var y = height; y--;)
                    this._cells[x][y].neighborBombs =
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
            this._cells[x][y].hasBomb :
            false;
    };
    Board.prototype._spread = function (x, y) {
        if (!this._coordsInRange(x, y))
            return;
        var cell = this._cells[x][y];
        if (cell.visible)
            return;
        if (cell.hasBomb)
            return;
        cell.visible = true;
        if (!cell.hasBomb) {
            this._spread(x + 1, y);
            this._spread(x - 1, y);
            this._spread(x, y + 1);
            this._spread(x, y - 1);
            return true;
        }
        return false;
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
        var cell = this._cells[x][y];
        // If it's already visible, no action is required.
        if (cell.visible)
            return;
        cell.visible = true;
        if (cell.hasBomb)
            return false;
        this._spread(x, y);
        return true;
    };
    /**
     * Turns on/off the flag value of a (hidden) cell.
     */
    Board.prototype.flag = function (x, y, newValue) {
        this._checkCoords(x, y);
        var cell = this._cells[x][y];
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
        var retVal = [];
        for (var x = 0; x < this.width; ++x) {
            var row = [];
            for (var y = 0; y < this.height; ++y) {
                row.push(this._cells[x][y].publicView());
            }
            retVal.push(row);
        }
        return retVal;
    };
    return Board;
}());
exports.Board = Board;
//# sourceMappingURL=Board.js.map