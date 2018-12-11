System.register(["./Board"], function (exports_1, context_1) {
    "use strict";
    var Board_1, Game;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Board_1_1) {
                Board_1 = Board_1_1;
            }
        ],
        execute: function () {
            Game = class Game {
                constructor(width, height, _board, _visiblem, _flagMatrix) {
                    this.width = width;
                    this.height = height;
                    this._board = new Board_1.Board(width, height, _board, _visiblem);
                }
                get board() { return this._board; }
                toJSON() {
                    return {
                        width: this.width,
                        height: this.height,
                        cellStates: this._board.cellStates,
                        visibleMatrix: this._board.visibleMatrix,
                        flagMatrix: this._board.flagMatrix
                    };
                }
                static fromJSON(json) {
                    return new this(json.width, json.height, json.cellStates, json.visibleMatrix, json.flagMatrix);
                }
            };
            exports_1("Game", Game);
        }
    };
});
//# sourceMappingURL=Game.js.map