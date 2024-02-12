const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Geeft je ping terug'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        
        const newMessage = `API Latency: ${client.ws.ping}\nPortalMaster Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        await interaction.editReply({
            content: newMessage
        });
    }
}