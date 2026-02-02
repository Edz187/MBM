"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const DatabaseProvider_1 = require("../provider/DatabaseProvider");
const emojis_1 = __importDefault(require("../emojis/emojis"));
exports.default = (c) => {
    c.once(discord_js_1.Events.ClientReady, () => {
        console.log("Aplicação ligada com sucesso!");
    });
    c.on(discord_js_1.Events.InteractionCreate, async (i) => {
        const serverDB = DatabaseProvider_1.DatabaseProvider.servers();
        if (i.isCommand()) {
            const cmd = c.commands.get(i.commandName);
            if (!(cmd))
                return console.log("Ocorreu um erro no codigo...");
            await cmd.execute(i);
            return;
        }
        if (i.isStringSelectMenu() && i.customId == "config-select-menu") {
            let selected = '';
            switch (i.values[0]) {
                case "addressandportvalues":
                    selected = "addressandport";
                    break;
                case "feedbackchannelvalues":
                    selected = "feedback";
                    break;
            }
            if (selected == "addressandport") {
                const modal = new discord_js_1.ModalBuilder()
                    .setCustomId("addresssetup")
                    .setTitle("Endereço e porta");
                const nameInput = new discord_js_1.TextInputBuilder()
                    .setCustomId("namevalue")
                    .setLabel("Nome")
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setPlaceholder("ex: Mineplay")
                    .setRequired(true);
                const addressInput = new discord_js_1.TextInputBuilder()
                    .setCustomId("addressvalue")
                    .setLabel("Endereço do servidor")
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setPlaceholder("ex: server.com.br")
                    .setRequired(true);
                const portInput = new discord_js_1.TextInputBuilder()
                    .setCustomId("portvalue")
                    .setLabel("Porta")
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setPlaceholder("ex: 19132")
                    .setRequired(true);
                modal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(nameInput), new discord_js_1.ActionRowBuilder().addComponents(addressInput), new discord_js_1.ActionRowBuilder().addComponents(portInput));
                i.showModal(modal);
            }
            else if (selected == "feedback") {
                await i.deferReply({ flags: ["Ephemeral"] });
                const sfbcrow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ChannelSelectMenuBuilder()
                    .setCustomId("feedback-channel-select")
                    .addChannelTypes(discord_js_1.ChannelType.GuildText)
                    .setPlaceholder("➤ Selecione o canal aqui..."));
                i.editReply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: "Configuração feedback" })
                            .setDescription("Selecione o canal onde deseja que os feedbacks fiquem.")
                            .setColor(discord_js_1.Colors.White)
                    ], components: [sfbcrow]
                });
            }
            return;
        }
        if (i.isChannelSelectMenu() && i.customId == "feedback-channel-select") {
            await i.deferReply({ flags: ["Ephemeral"] });
            if (!(i.channel?.isTextBased()))
                return;
            const guildID = i.guild.id;
            const channelID = i.values[0];
            await serverDB.set(`servers.${guildID}.channels`, {
                channelID: channelID,
            });
            i.editReply({ content: `${emojis_1.default.check} Canal feedback foi selecionado com sucesso!` });
            return;
        }
        if (i.isModalSubmit() && i.customId == "addresssetup") {
            await i.deferReply({ flags: ["Ephemeral"] });
            const nameServer = i.fields.getTextInputValue("namevalue");
            const address = i.fields.getTextInputValue("addressvalue");
            const port = i.fields.getTextInputValue("portvalue");
            const guildID = i.guild.id;
            await serverDB.set(`servers.${guildID}.status`, {
                servername: nameServer,
                address: address,
                port: port
            });
            i.editReply({ content: `${emojis_1.default.check} Endereço e porta definidos com sucesso!` });
            return;
        }
    });
};
//# sourceMappingURL=EventsManager.js.map