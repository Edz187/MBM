import ExtentedClient from "./classes/ExtendedClient";
import { config } from "dotenv";
import EventsManager from "./managers/EventsManager";
import { DatabaseProvider } from "./provider/DatabaseProvider";
import { QuickDB } from "quick.db";
import { join } from "node:path";

config();

const client = new ExtentedClient();

DatabaseProvider.set({
  servers: new QuickDB({
    table: "servers",
    filePath: join(__dirname, "cache/servers.sqlite")
  })
});

EventsManager(client);
client.regsCommands(process.env.BOT_TOKEN!);
client.run(process.env.BOT_TOKEN!);