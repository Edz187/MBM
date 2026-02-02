import { Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js";
import type { Interaction } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";

type CommandData = {
    name: string;
    description: string;
    options: [];
    execute(i: Interaction): Promise<void>
};

class ExtentedClient extends Client {

    public commands = new Collection<string, CommandData>()

    constructor() {
        const ai: any = Object.values(GatewayIntentBits);
        super({ intents: ai })
    }

    async regsCommands(TOKEN: string): Promise<void> {
        try {
            if (!(TOKEN)) throw new Error("TOKEN definido no arquivo '.env' é invalido!");

            const commandsPath = join(__dirname, "../commands");
            const files = readdirSync(commandsPath);

            for (const file of files) {
                const command = require(join(commandsPath, file)).default;
                this.commands.set(command.name, command);
            }


            const rest = new REST({ version: '10' }).setToken(TOKEN);

            const body = this.commands.map(cmd => ({
                name: cmd.name,
                description: cmd.description,
                options: cmd.options ?? []
            }));

            console.log("Registrando comandos:", body);

            await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID!), {
                body: body
            });

            console.log("Comandos registrados com sucesso!");
        }
        catch (err) {
            console.error(err);
        }
    }

    async run(TOKEN: string): Promise<void> {
        this.login(TOKEN)
    }
}

export default ExtentedClient