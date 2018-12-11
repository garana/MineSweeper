System.register([], function (exports_1, context_1) {
    "use strict";
    var CellState;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (CellState) {
                CellState["None"] = "None";
                CellState["Bomb"] = "Bomb";
                CellState["Empty"] = "Empty";
            })(CellState || (CellState = {}));
            exports_1("CellState", CellState);
        }
    };
});
//# sourceMappingURL=CellState.js.map