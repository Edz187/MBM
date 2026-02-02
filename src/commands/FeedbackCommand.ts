import { Colors, EmbedBuilder, type ChatInputCommandInteraction, type Message } from "discord.js";
import { DatabaseProvider } from "../provider/DatabaseProvider";
import emojis from "../emojis/emojis";
import { Channel } from "node:diagnostics_channel";

export default {
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
    async execute(interaction: ChatInputCommandInteraction): Promise<Message | boolean | void> {
        await interaction.deferReply({ flags: ["Ephemeral"] })
        if (!(interaction.inGuild())) {
            return false;
        }

        const serverDB = DatabaseProvider.servers();
        const messageOption = interaction.options.getString("messagem");
        const integerOption = interaction.options.getInteger("estrelas");
        const guildID = interaction.guildId;
        const stars = (integerOption! > 5 ? 5 : integerOption! < 1 ? 1 : integerOption);
        const hasChannel = await serverDB.has(`servers.${guildID}.channels.channelID`);
        if (!(hasChannel)) {
            return interaction.editReply({ content: `${emojis.settings} O canal não existe ocorreu um erro! Defina o canal primeiro` });
        }

        const channelID = await serverDB.get(`servers.${guildID}.channels.channelID`);
        const channel = interaction.guild?.channels.cache.get(channelID);
        if(!channel || !channel.isTextBased()) {
            return interaction.editReply({ content: `${emojis.settings} Canal é invalido ou não é um canal do tipo texto!` });
        }

        channel.send({embeds: [
            new EmbedBuilder()
            .setTitle("Feedback recebido!")
            .setDescription(`👤 Usuario: ${interaction.user}\n✨ Estrelas: ${stars}\n💬 Messagem: ${messageOption}`)
            .setColor(Colors.White)
        ]});
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Feedback enviado!")
                    .setDescription(`Feedback enviado com sucesso...\nObrigado pela sua opinião!`)
                    .setColor(Colors.White)
            ]
        });
    }
}