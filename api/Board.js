System.register(["./CellState", "./Config", "./RequestError", "./ServerSideError"], function (exports_1, context_1) {
    "use strict";
    var CellState_1, Config_1, RequestError_1, ServerSideError_1, Board;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (CellState_1_1) {
                CellState_1 = CellState_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (RequestError_1_1) {
                RequestError_1 = RequestError_1_1;
            },
            function (ServerSideError_1_1) {
                ServerSideError_1 = ServerSideError_1_1;
            }
        ],
        execute: function () {
            Board = class Board {
                constructor(width, height, _cellStates, _visibleMatrix, _flagMatrix) {
                    this.width = width;
                    this.height = height;
                    this._cellStates = _cellStates;
                    this._visibleMatrix = _visibleMatrix;
                    this._flagMatrix = _flagMatrix;
                    if (!_cellStates) {
                        if (_visibleMatrix)
                            throw new ServerSideError_1.ServerSideError(`A Board can't be created without state but visibility matrix`);
                        /**
                         * These checks are performed only when we are creating a new
                         * board, to allow backwards compatibility in case the limits
                         * are modified.
                         */
                        if (this.width < Config_1.MIN_BOARD_WIDTH)
                            throw new RequestError_1.RequestError(`Board can't be narrower than ${Config_1.MIN_BOARD_WIDTH}`);
                        if (this.width > Config_1.MAX_BOARD_WIDTH)
                            throw new RequestError_1.RequestError(`Board can't be wider than ${Config_1.MAX_BOARD_WIDTH}`);
                        if (this.height < Config_1.MIN_BOARD_HEIGHT)
                            throw new RequestError_1.RequestError(`Board can't be shorter than ${Config_1.MIN_BOARD_HEIGHT}`);
                        if (this.height > Config_1.MAX_BOARD_HEIGHT)
                            throw new RequestError_1.RequestError(`Board can't be taller than ${Config_1.MAX_BOARD_HEIGHT}`);
                        this._cellStates = [];
                        this._visibleMatrix = [];
                        this._flagMatrix = [];
                        for (let y = 0; y < height; ++y) {
                            let board_row = [];
                            let visible_row = [];
                            let flag_row = [];
                            for (let x = 0; x < width; ++x) {
                                board_row.push(Math.random() > .7 ? CellState_1.CellState.Bomb : CellState_1.CellState.Empty);
                                visible_row.push(false);
                                flag_row.push(false);
                            }
                            this._cellStates.push(board_row);
                            this._visibleMatrix.push(visible_row);
                            this._flagMatrix.push(flag_row);
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
                 * If x or y values are invalid, a RequestError exception is thrown.
                 * @param x
                 * @param y
                 * @private
                 */
                _checkCoords(x, y) {
                    if (Math.floor(x) !== x)
                        throw new RequestError_1.RequestError(`Cell coordinates must be non-negative integers`);
                    if (Math.floor(y) !== y)
                        throw new RequestError_1.RequestError(`Cell coordinates must be non-negative integers`);
                    if (x >= this.width)
                        throw new RequestError_1.RequestError(`'x' coordinate is out of range`);
                    if (y >= this.height)
                        throw new RequestError_1.RequestError(`'y' coordinate is out of range`);
                }
                /**
                 * Process a click on a cell, returning false iff clicked on a bomb,
                 * true otherwise.
                 * @param x
                 * @param y
                 */
                click(x, y) {
                    this._checkCoords(x, y);
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
                            throw new ServerSideError_1.ServerSideError(`Internal state corruption, please start a new game`);
                    }
                }
                /**
                 * Turns on/off the flag value of a (hidden) cell.
                 */
                flag(x, y, newValue) {
                    this._checkCoords(x, y);
                    if (this._visibleMatrix[x][y])
                        throw new RequestError_1.RequestError(`Cell is already visible`);
                    this._flagMatrix[x][y] = newValue;
                }
                get cellStates() { return this._cellStates; }
                get visibleMatrix() { return this._visibleMatrix; }
                get flagMatrix() { return this._flagMatrix; }
            };
            exports_1("Board", Board);
        }
    };
});
//# sourceMappingURL=Board.js.map