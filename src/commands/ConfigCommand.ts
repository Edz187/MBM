import { ActionRowBuilder, Colors, PermissionsBitField, type ChatInputCommandInteraction } from "discord.js";
import emojis from "../emojis/emojis";
import { Message, StringSelectMenuBuilder } from "discord.js";

export default {
    name: "config",
    description: "Configure o bot por aqui",
    async execute(i: ChatInputCommandInteraction): Promise<boolean | Message> {
        await i.deferReply({ flags: ["Ephemeral"] })
        if (!(i.memberPermissions?.has(PermissionsBitField.Flags.Administrator))) {
            return i.editReply({
                content: `${emojis.settings} Apenas usuarios administrativos podem executar esse comando!`
            });
        }

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("config-select-menu")
                .setPlaceholder(`➤ Clique aqui...`)
                .addOptions([
                    {
                        label: `Endereço`,
                        description: "Edite o endereço e porta do servidor",
                        value: "addressandportvalues",
                        emoji: `${emojis.edit}`
                    },
                    {
                        label: `Feedback`,
                        description: "Edite o canal onde irá ficar os feedbacks",
                        value: "feedbackchannelvalues",
                        emoji: `${emojis.edit}`
                    },
                ])
        );
        i.editReply({
            embeds: [
                {
                    author: {
                        name: "Configuração",
                        icon_url: "https://cdn3.emoji.gg/emojis/15063-tools.png"
                    },
                    description: "Configure o bot para o sua comunidade\nAbaixo há opções selecione a que deseja editar.",
                    color: Colors.White
                },
            ],
            components: [row]
        });
        return false;
    }
}