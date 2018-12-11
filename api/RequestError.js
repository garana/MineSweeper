System.register([], function (exports_1, context_1) {
    "use strict";
    var RequestError;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            RequestError = class RequestError extends Error {
                constructor() {
                    super(...arguments);
                    this.requestError = true;
                }
            };
            exports_1("RequestError", RequestError);
        }
    };
});
//# sourceMappingURL=RequestError.js.map