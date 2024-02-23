const { SlashCommandBuilder, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const profileModel = require("../../schemas/profileSchema");

const cardsPerPage = 5;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Have a look in your cardInventory'),
    async execute(interaction, client) {
        const userId = interaction.user.id;
        const userProfile = await profileModel.findOne({ userId });

        if (!userProfile || !userProfile.cardInventory || userProfile.cardInventory.length === 0) {
            return interaction.reply('You dont have cards in your inventory at this moment');
        }

        const pages = Math.ceil(userProfile.cardInventory.length / cardsPerPage);
        let page = 1;

        const inventoryEmbed = createInventoryEmbed(userProfile.cardInventory, page, interaction.user.username);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('prevButton')
                    .setLabel('Previous')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('nextButton')
                    .setLabel('Next')
                    .setStyle('PRIMARY'),
            );

        await interaction.reply({ embeds: [inventoryEmbed], components: [row] });
    },
};

function createInventoryEmbed(cardInventory, currentPage, username) {
    const startIdx = (currentPage - 1) * cardsPerPage;
    const endIdx = startIdx + cardsPerPage;
    const currentCards = cardInventory.slice(startIdx, endIdx);

    const inventoryEmbed = new MessageEmbed()
        .setTitle(`${username}'s CardInventory - Page ${currentPage}`)
        .setColor('#3498db');

    currentCards.forEach((card) => {
        const cardInfo = `Name: ${card.name}\n Rarity: ${card.rarity}\n Value: ${card.value} SkyCoins\n Amount: ${card.count}`;
        inventoryEmbed.addFields({ name: '\u200B', value: cardInfo });
    });

    return inventoryEmbed;
}
