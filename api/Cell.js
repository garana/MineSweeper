"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cell = /** @class */ (function () {
    function Cell(hasMine, visible, neighborMines, flagged) {
        this.hasMine = hasMine;
        this.visible = visible;
        this.neighborMines = neighborMines;
        this.flagged = flagged;
    }
    Cell.prototype.publicView = function () {
        return [
            (this.visible ? 'v' : '') +
                (this.flagged ? 'f' : '') +
                (this.visible && this.hasMine ? 'm' : ''),
            this.neighborMines
        ];
    };
    return Cell;
}());
exports.Cell = Cell;
//# sourceMappingURL=Cell.js.map