const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Marc update...'),
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

        const newMessage = `Het zal je niet ontgaan zijn dat ik sinds 06/03 10:18 niet meer op discord/appjes reageer. Antwoord is simpelweg dat dat klopt. Ik heb helaas al mijn tijd en energie nodig voor niet alleen mijzelf, maar ook voor mijn familie. Mijn oma is helaas op 06/03 in de ochtend in slaap gebracht doormiddel van een prik en we wachten nu af tot ze overlijd in haar slaap. Ze was al ernstig ziek door gevolgen van Longkanker stage 3 dus beter worden kon ze al niet meer. 05/03 hebben we in de avond/nacht afscheid genomen voor de allerlaatste keer. Mocht er nieuwe updates zijn kan je met /update het horen/lezen. Mochten er vragen zijn graag privé bericht stellen. Ik zal reageren wanneer mijn energie weer een beetje terug is. Bedankt voor het begrip ~Marc`;

        // Edit the interaction reply using the stored message ID
        await interaction.editReply({
            content: newMessage
        });
    }
};
