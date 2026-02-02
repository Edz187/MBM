"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const DatabaseProvider_1 = require("../provider/DatabaseProvider");
const emojis_1 = __importDefault(require("../emojis/emojis"));
const axios_1 = __importDefault(require("axios"));
exports.default = {
    name: "status",
    description: "Veja os status do servidor",
    async execute(interaction) {
        await interaction.deferReply({ flags: ["Ephemeral"] });
        const serverDB = DatabaseProvider_1.DatabaseProvider.servers();
        const guildID = interaction.guildId;
        const hasStatus = await serverDB.has(`servers.${guildID}.status`);
        if (!(hasStatus)) {
            return interaction.editReply({ content: `${emojis_1.default.settings} Está funcionalidade ainda não está definida!` });
        }
        const channelOptions = await serverDB.get(`servers.${guildID}.status`);
        const APISERVER = axios_1.default.get(`https://api.mcstatus.io/v2/status/bedrock/${channelOptions.address}:${channelOptions.port}`);
        if (!((await APISERVER).data.online)) {
            return interaction.editReply({ content: `${emojis_1.default.settings} O servidor está offline!` });
        }
        return interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle(`🚀 ${channelOptions.servername}`)
                    .setDescription("**Informações do servidor**\nConfira os dados atualizados abaixo 👇")
                    .addFields({
                    name: "🗒️ Endereço",
                    value: `\`${(await APISERVER).data.host}\``,
                    inline: true
                }, {
                    name: "📒 Porta",
                    value: `\`${(await APISERVER).data.port}\``,
                    inline: true
                }, {
                    name: "👤 Jogadores",
                    value: `\`${(await APISERVER).data.players.online}/${(await APISERVER).data.players.max}\``,
                    inline: true
                })
                    .setColor(discord_js_1.Colors.White)
                    .setFooter({
                    text: "Status do servidor em tempo real"
                })
                    .setTimestamp()
            ]
        });
    }
};
//# sourceMappingURL=StatusCommand.js.map