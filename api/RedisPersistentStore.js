"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RedisPersistenceStore = /** @class */ (function () {
    function RedisPersistenceStore(_redis) {
        this._redis = _redis;
    }
    RedisPersistenceStore.prototype.get = function (name) {
        return this._redis.getAsync(name);
    };
    RedisPersistenceStore.prototype.set = function (name, value) {
        return this._redis.setAsync(name, value);
    };
    return RedisPersistenceStore;
}());
exports.RedisPersistenceStore = RedisPersistenceStore;
//# sourceMappingURL=RedisPersistentStore.js.map