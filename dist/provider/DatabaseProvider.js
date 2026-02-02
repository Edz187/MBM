"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProvider = void 0;
class DatabaseProvider {
    static database;
    static set(data) {
        this.database = data;
    }
    static get() {
        return this.database;
    }
    static servers() {
        return this.database.servers;
    }
}
exports.DatabaseProvider = DatabaseProvider;
//# sourceMappingURL=DatabaseProvider.js.map