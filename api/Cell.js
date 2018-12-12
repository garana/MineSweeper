"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cell = /** @class */ (function () {
    function Cell(hasBomb, visible, neighborBombs, flagged) {
        this.hasBomb = hasBomb;
        this.visible = visible;
        this.neighborBombs = neighborBombs;
        this.flagged = flagged;
    }
    Cell.prototype.publicView = function () {
        return [
            (this.visible ? 'v' : '') +
                (this.flagged ? 'f' : ''),
            this.neighborBombs
        ];
    };
    return Cell;
}());
exports.Cell = Cell;
//# sourceMappingURL=Cell.js.map