import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, Colors, EmbedBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import ExtentedClient from "../classes/ExtendedClient";
import { DatabaseProvider } from "../provider/DatabaseProvider";
import emojis from "../emojis/emojis";

export default (c: ExtentedClient) => {
    c.once(Events.ClientReady, () => {
        console.log("Aplicação ligada com sucesso!");
    });

    c.on(Events.InteractionCreate, async (i) => {
        const serverDB = DatabaseProvider.servers();
        if (i.isCommand()) {
            const cmd = c.commands.get(i.commandName);
            if (!(cmd)) return console.log("Ocorreu um erro no codigo...");
            await cmd.execute(i);
            return;
        }
        if (i.isStringSelectMenu() && i.customId == "config-select-menu") {
            let selected: string = '';
            switch (i.values[0]) {
                case "addressandportvalues":
                    selected = "addressandport";
                    break;
                case "feedbackchannelvalues":
                    selected = "feedback";
                    break;
            }
            if (selected == "addressandport") {
                const modal = new ModalBuilder()
                    .setCustomId("addresssetup")
                    .setTitle("Endereço e porta")

                const nameInput = new TextInputBuilder()
                    .setCustomId("namevalue")
                    .setLabel("Nome")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("ex: Mineplay")
                    .setRequired(true)

                const addressInput = new TextInputBuilder()
                    .setCustomId("addressvalue")
                    .setLabel("Endereço do servidor")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("ex: server.com.br")
                    .setRequired(true)

                const portInput = new TextInputBuilder()
                    .setCustomId("portvalue")
                    .setLabel("Porta")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("ex: 19132")
                    .setRequired(true)

                modal.addComponents(
                    new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(addressInput),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(portInput)
                )
                i.showModal(modal);
            } else if (selected == "feedback") {
                await i.deferReply({ flags: ["Ephemeral"] });
                const sfbcrow = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                    new ChannelSelectMenuBuilder()
                        .setCustomId("feedback-channel-select")
                        .addChannelTypes(ChannelType.GuildText)
                        .setPlaceholder("➤ Selecione o canal aqui...")
                );
                i.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: "Configuração feedback" })
                            .setDescription("Selecione o canal onde deseja que os feedbacks fiquem.")
                            .setColor(Colors.White)
                    ], components: [sfbcrow]
                });
            }
            return;
        }
        if (i.isChannelSelectMenu() && i.customId == "feedback-channel-select") {
            await i.deferReply({ flags: ["Ephemeral"] });
            if (!(i.channel?.isTextBased())) return;
            const guildID = i.guild!.id;
            const channelID = i.values[0];

            await serverDB.set(`servers.${guildID}.channels`, {
                channelID: channelID,
            });
            i.editReply({ content: `${emojis.check} Canal feedback foi selecionado com sucesso!` });
            return;
        }
        if (i.isModalSubmit() && i.customId == "addresssetup") {
            await i.deferReply({ flags: ["Ephemeral"] });
            const nameServer = i.fields.getTextInputValue("namevalue");
            const address = i.fields.getTextInputValue("addressvalue");
            const port = i.fields.getTextInputValue("portvalue");

            const guildID = i.guild!.id;
            await serverDB.set(`servers.${guildID}.status`, {
                servername: nameServer,
                address: address,
                port: port
            });
            i.editReply({ content: `${emojis.check} Endereço e porta definidos com sucesso!` });
            return;

        }
    })
}
