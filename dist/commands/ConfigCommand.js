"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const emojis_1 = __importDefault(require("../emojis/emojis"));
const discord_js_2 = require("discord.js");
exports.default = {
    name: "config",
    description: "Configure o bot por aqui",
    async execute(i) {
        await i.deferReply({ flags: ["Ephemeral"] });
        if (!(i.memberPermissions?.has(discord_js_1.PermissionsBitField.Flags.Administrator))) {
            return i.editReply({
                content: `${emojis_1.default.settings} Apenas usuarios administrativos podem executar esse comando!`
            });
        }
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_2.StringSelectMenuBuilder()
            .setCustomId("config-select-menu")
            .setPlaceholder(`➤ Clique aqui...`)
            .addOptions([
            {
                label: `Endereço`,
                description: "Edite o endereço e porta do servidor",
                value: "addressandportvalues",
                emoji: `${emojis_1.default.edit}`
            },
            {
                label: `Feedback`,
                description: "Edite o canal onde irá ficar os feedbacks",
                value: "feedbackchannelvalues",
                emoji: `${emojis_1.default.edit}`
            },
        ]));
        i.editReply({
            embeds: [
                {
                    author: {
                        name: "Configuração",
                        icon_url: "https://cdn3.emoji.gg/emojis/15063-tools.png"
                    },
                    description: "Configure o bot para o sua comunidade\nAbaixo há opções selecione a que deseja editar.",
                    color: discord_js_1.Colors.White
                },
            ],
            components: [row]
        });
        return false;
    }
};
//# sourceMappingURL=ConfigCommand.js.map