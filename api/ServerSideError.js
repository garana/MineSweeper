System.register([], function (exports_1, context_1) {
    "use strict";
    var ServerSideError;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ServerSideError = class ServerSideError extends Error {
                constructor() {
                    super(...arguments);
                    this.serverSideError = true;
                }
            };
            exports_1("ServerSideError", ServerSideError);
        }
    };
});
//# sourceMappingURL=ServerSideError.js.map