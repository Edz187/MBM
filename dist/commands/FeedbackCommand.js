"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const DatabaseProvider_1 = require("../provider/DatabaseProvider");
const emojis_1 = __importDefault(require("../emojis/emojis"));
exports.default = {
    name: "feedback",
    description: "Envie feedbacks para a equipe administrativa!",
    options: [
        {
            name: "messagem",
            description: "Digite seu feedback",
            type: 3,
            required: true
        },
        {
            name: "estrelas",
            description: "1 ate 5",
            type: 4,
            required: true
        }
    ],
    async execute(interaction) {
        await interaction.deferReply({ flags: ["Ephemeral"] });
        if (!(interaction.inGuild())) {
            return false;
        }
        const serverDB = DatabaseProvider_1.DatabaseProvider.servers();
        const messageOption = interaction.options.getString("messagem");
        const integerOption = interaction.options.getInteger("estrelas");
        const guildID = interaction.guildId;
        const stars = (integerOption > 5 ? 5 : integerOption < 1 ? 1 : integerOption);
        const hasChannel = await serverDB.has(`servers.${guildID}.channels.channelID`);
        if (!(hasChannel)) {
            return interaction.editReply({ content: `${emojis_1.default.settings} O canal não existe ocorreu um erro! Defina o canal primeiro` });
        }
        const channelID = await serverDB.get(`servers.${guildID}.channels.channelID`);
        const channel = interaction.guild?.channels.cache.get(channelID);
        if (!channel || !channel.isTextBased()) {
            return interaction.editReply({ content: `${emojis_1.default.settings} Canal é invalido ou não é um canal do tipo texto!` });
        }
        channel.send({ embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle("Feedback recebido!")
                    .setDescription(`👤 Usuario: ${interaction.user}\n✨ Estrelas: ${stars}\n💬 Messagem: ${messageOption}`)
                    .setColor(discord_js_1.Colors.White)
            ] });
        await interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle("Feedback enviado!")
                    .setDescription(`Feedback enviado com sucesso...\nObrigado pela sua opinião!`)
                    .setColor(discord_js_1.Colors.White)
            ]
        });
    }
};
//# sourceMappingURL=FeedbackCommand.js.map