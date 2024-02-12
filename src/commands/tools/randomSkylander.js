const { getSkylanderRandom } = require("skylander.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skylander')
        .setDescription('Geeft je een random skylander'),
    async execute(interaction, client) {
        const skylander = await getSkylanderRandom();
        const message = await interaction.deferReply({
            fetchReply: true
        });
        
            const newMessage = skylander;
            const skylanderName = skylander["name"]
            const skylanderImg = skylander["image"]
            const skylanderRole = skylander["role"]
            const skylanderRelease = skylander["release"]
            const skylanderElement = skylander["element"]
            const skylanderQuote = skylander["quote"]

            const content = `Name: ${skylanderName}\nImage: ${skylanderImg}\nRole: ${skylanderRole}\nRelease: ${skylanderRelease}\nElement: ${skylanderElement}\nQuote: ${skylanderQuote}`;


                await interaction.editReply({
                    content: content
                });
    }

}