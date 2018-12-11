System.register(["./CellState"], function (exports_1, context_1) {
    "use strict";
    var CellState_1, Board;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (CellState_1_1) {
                CellState_1 = CellState_1_1;
            }
        ],
        execute: function () {
            Board = class Board {
                constructor(width, height, _cellStates, _visibleMatrix) {
                    this.width = width;
                    this.height = height;
                    this._cellStates = _cellStates;
                    this._visibleMatrix = _visibleMatrix;
                    if (!_cellStates) {
                        if (_visibleMatrix)
                            throw new Error(`A Board can't be created without state but visibility matrix`);
                        this._cellStates = [];
                        this._visibleMatrix = [];
                        for (let y = 0; y < height; ++y) {
                            let board_row = [];
                            let visible_row = [];
                            for (let x = 0; x < width; ++x) {
                                board_row.push(Math.random() > .7 ? CellState_1.CellState.Bomb : CellState_1.CellState.Empty);
                                visible_row.push(false);
                            }
                            this._cellStates.push(board_row);
                            this._visibleMatrix.push(visible_row);
                        }
                    }
                }
                _spread(x, y) {
                    if ((x < 0) ||
                        (y < 0) ||
                        (x >= this.width) ||
                        (y >= this.height))
                        return;
                    if (this._visibleMatrix[x][y])
                        return;
                    this._visibleMatrix[x][y] = true;
                    switch (this._cellStates[x][y]) {
                        case CellState_1.CellState.Empty:
                            this._spread(x + 1, y);
                            this._spread(x - 1, y);
                            this._spread(x, y + 1);
                            this._spread(x, y - 1);
                            return true;
                        case CellState_1.CellState.Bomb:
                            return false;
                        default:
                            throw new Error(`Internal state corruption`);
                    }
                }
                /**
                 * Process a click on a cell, returning false iff clicked on a bomb,
                 * true otherwise.
                 * @param x
                 * @param y
                 */
                click(x, y) {
                    if (Math.floor(x) !== x)
                        throw new Error(`Cell coordinates must be non-negative integers`);
                    if (Math.floor(y) !== y)
                        throw new Error(`Cell coordinates must be non-negative integers`);
                    if (x >= this.width)
                        throw new Error(`'x' coordinate is out of range`);
                    if (y >= this.height)
                        throw new Error(`'y' coordinate is out of range`);
                    // If it's already visible, no action is required.
                    if (this._visibleMatrix[x][y])
                        return;
                    this._visibleMatrix[x][y] = true;
                    switch (this._cellStates[x][y]) {
                        case CellState_1.CellState.Empty:
                            this._spread(x, y);
                            return true;
                        case CellState_1.CellState.Bomb:
                            return false;
                        default:
                            throw new Error(`Internal state corruption, please start a new game`);
                    }
                }
                get cellStates() { return this._cellStates; }
                get visibleMatrix() { return this._visibleMatrix; }
            };
            exports_1("Board", Board);
        }
    };
});
//# sourceMappingURL=Board.js.map