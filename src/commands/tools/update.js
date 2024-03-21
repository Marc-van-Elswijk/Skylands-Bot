const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Bot update'),
    async execute(interaction) {
        // Defer the initial reply
        const message = await interaction.deferReply({
            ephemeral: true,
            fetchReply: true
        });

        // Check if the reply is a valid Message object
        if (!message || !message.id) {
            return console.error('Failed to retrieve the deferred message ID.');
        }

        const newMessage = `- /help\n- new SwapForce cards added to the bot`
        
        // Edit the interaction reply using the stored message ID
        await interaction.editReply({
            content: newMessage
        });
    }
};
