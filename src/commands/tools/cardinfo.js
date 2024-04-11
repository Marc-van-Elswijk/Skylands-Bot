const getSkyCardbyId = require("skylander.js/src/methods/getSkyCardbyId");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const profileModel = require("../../schemas/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cardinfo')
        .setDescription('gives you information about a card')
        .addStringOption(option =>
            option.setName('skylanderid')
                .setDescription('Put in the skylanderId of the card you want more info about')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        let userProfile = await profileModel.findOne({ userId: interaction.user.id });
        const skylanderIdInput = interaction.options.getString('skylanderid')
        const cardMessage = await interaction.deferReply({ fetchReply: true, ephemeral: true});

        if (!cardMessage || !cardMessage.id) {
            return console.error('Failed to retrieve the deferred message ID.');
        }

        try{

            const skylander = await getSkyCardbyId(skylanderIdInput);

        //card info
        const skylanderId = skylander["id"]
        const skylanderName = skylander["name"]
        const skylanderQuote = skylander["quote"]
        const skylanderRarity = skylander["rarity"]
        const skylanderElement = skylander["element"]
        const skylanderCardBack = skylander["cardback"]
        const skylanderCardFront = skylander["cardfront"]
        const skylanderValue = skylander["value"]
        const skylanderHealth = skylander["health"]
        const skylanderStrength = skylander["strength stat"]
        const skylanderDefense = skylander["defense stat"]

        //color for the embeds
        function colorEmbed(skylanderElement) {
            switch (skylanderElement.toLowerCase()) {
                case 'fire':
                    return '#FF0000'; // Red
                case 'earth':
                    return '#8B4513'; // Brown
                case 'undead':
                    return '#808080'; // Grey
                case 'air':
                    return '#ADD8E6'; // Light Blue
                case 'life':
                    return '#00FF00'; // Green
                case 'magic':
                    return '#800080'; // Purple
                case 'tech':
                    return '#FFA500'; // Orange
                case 'water':
                    return '#00008B'; // Dark Blue

                default:
                    return '#7289DA'; // Blurple as default
            }
        }

        //embed for the cards
        const SkyCard = new EmbedBuilder()
            .setTitle(`${skylanderName}`)
            .setDescription(`${skylanderQuote}`)
            .setImage(`${skylanderCardFront}`)
            .setColor(colorEmbed(skylanderElement))
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: `SkylanderId:`, value: `${skylanderId}`, inline: true },
                { name: 'Rarity:', value: `${skylanderRarity}`, inline: true },
                { name: 'Value:', value: `${skylanderValue} skycoins`, inline: true },
                { name: 'Health:', value: `${skylanderHealth} HP`, inline: true },
                { name: 'Strength:', value: `${skylanderStrength}`, inline: true },
                { name: 'Defense:', value: `${skylanderDefense}`, inline: true }
            )
            .setTimestamp()
            .setFooter({
                text: client.user.tag,
                icon: client.user.displayAvatarURL()
            });

            await interaction.editReply({ embeds: [SkyCard] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('Er is een fout opgetreden bij het ophalen van de informatie over de kaart.');
        }
    }
}