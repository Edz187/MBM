"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExtendedClient_1 = __importDefault(require("./classes/ExtendedClient"));
const dotenv_1 = require("dotenv");
const EventsManager_1 = __importDefault(require("./managers/EventsManager"));
const DatabaseProvider_1 = require("./provider/DatabaseProvider");
const quick_db_1 = require("quick.db");
const node_path_1 = require("node:path");
(0, dotenv_1.config)();
const client = new ExtendedClient_1.default();
DatabaseProvider_1.DatabaseProvider.set({
    servers: new quick_db_1.QuickDB({
        table: "servers",
        filePath: (0, node_path_1.join)(__dirname, "cache/servers.sqlite")
    })
});
(0, EventsManager_1.default)(client);
client.regsCommands(process.env.BOT_TOKEN);
client.run(process.env.BOT_TOKEN);
//# sourceMappingURL=main.js.map