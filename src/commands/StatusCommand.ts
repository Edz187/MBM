import { Colors, EmbedBuilder, type ChatInputCommandInteraction, type Message } from "discord.js";
import { DatabaseProvider } from "../provider/DatabaseProvider";
import emojis from "../emojis/emojis";
import axios from "axios";

export default {
    name: "status",
    description: "Veja os status do servidor",
    async execute(interaction: ChatInputCommandInteraction): Promise<void | boolean | Message> {
        await interaction.deferReply({ flags: ["Ephemeral"] });
        const serverDB = DatabaseProvider.servers();
        const guildID = interaction.guildId;
        const hasStatus = await serverDB.has(`servers.${guildID}.status`);
        if (!(hasStatus)) {
            return interaction.editReply({ content: `${emojis.settings} Está funcionalidade ainda não está definida!` });
        }
        const channelOptions = await serverDB.get(`servers.${guildID}.status`);
        const APISERVER = axios.get(`https://api.mcstatus.io/v2/status/bedrock/${channelOptions.address}:${channelOptions.port}`);
        if (!((await APISERVER).data.online)) {
            return interaction.editReply({ content: `${emojis.settings} O servidor está offline!` });
        }
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`🚀 ${channelOptions.servername}`)
                    .setDescription(
                        "**Informações do servidor**\nConfira os dados atualizados abaixo 👇"
                    )
                    .addFields(
                        {
                            name: "🗒️ Endereço",
                            value: `\`${(await APISERVER).data.host}\``,
                            inline: true
                        },
                        {
                            name: "📒 Porta",
                            value: `\`${(await APISERVER).data.port}\``,
                            inline: true
                        },
                        {
                            name: "👤 Jogadores",
                            value: `\`${(await APISERVER).data.players.online}/${(await APISERVER).data.players.max}\``,
                            inline: true
                        }
                    )
                    .setColor(Colors.White)
                    .setFooter({
                        text: "Status do servidor em tempo real"
                    })
                    .setTimestamp()
            ]
        });
    }
}