"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
class ExtentedClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    constructor() {
        const ai = Object.values(discord_js_1.GatewayIntentBits);
        super({ intents: ai });
    }
    async regsCommands(TOKEN) {
        try {
            if (!(TOKEN))
                throw new Error("TOKEN definido no arquivo '.env' é invalido!");
            const commandsPath = (0, node_path_1.join)(__dirname, "../commands");
            const files = (0, node_fs_1.readdirSync)(commandsPath);
            for (const file of files) {
                const command = require((0, node_path_1.join)(commandsPath, file)).default;
                this.commands.set(command.name, command);
            }
            const rest = new discord_js_1.REST({ version: '10' }).setToken(TOKEN);
            const body = this.commands.map(cmd => ({
                name: cmd.name,
                description: cmd.description,
                options: cmd.options ?? []
            }));
            console.log("Registrando comandos:", body);
            await rest.put(discord_js_1.Routes.applicationCommands(process.env.APPLICATION_ID), {
                body: body
            });
            console.log("Comandos registrados com sucesso!");
        }
        catch (err) {
            console.error(err);
        }
    }
    async run(TOKEN) {
        this.login(TOKEN);
    }
}
exports.default = ExtentedClient;
//# sourceMappingURL=ExtendedClient.js.map