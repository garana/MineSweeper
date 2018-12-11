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
                constructor(id, width, height, _board, _visiblem) {
                    this.id = id;
                    this.width = width;
                    this.height = height;
                    this._board = new Board_1.Board(width, height, _board, _visiblem);
                }
                static marshall(serialized) {
                    let decoded = JSON.parse(serialized);
                    return new this(decoded.id, decoded.width, decoded.height, decoded.cellStates, decoded.visibleMatrix);
                }
                serialize() {
                    return JSON.stringify({
                        id: this.id,
                        width: this.width,
                        height: this.height,
                        cellStates: this._board.cellStates,
                        visibleMatrix: this._board.visibleMatrix
                    });
                }
            };
            exports_1("Game", Game);
        }
    };
});
//# sourceMappingURL=Game.js.map