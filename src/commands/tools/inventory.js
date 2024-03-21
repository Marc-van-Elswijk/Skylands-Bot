const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const profileModel = require("../../schemas/profileSchema");
require('dotenv').config();


module.exports = {
    data: new SlashCommandBuilder()
      .setName('inventory')
      .setDescription('Show the current user\'s card inventory.'),
    async execute(interaction) {
      try {
        // Defer the initial reply
        await interaction.deferReply();
  
        // Connect to MongoDB 
        await mongoose.connect(process.env.databaseToken, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
  
        // Fetch the user data from the database
        const userData = await profileModel.findOne({ userId: interaction.user.id }, { _id: 0, cardInventory: 1 }).exec();
  
        if (!userData) {
          // Send a message if the user data is not found
          await interaction.editReply('Your card inventory is empty.');
          return;
        }
  
        // Create an embed with the card inventory information
        const embed = new EmbedBuilder()
          .setTitle(`${interaction.user.username}'s Card Inventory`)
          .setDescription('Your current card inventory:')
          .setColor('#0099ff')
          .addFields(
            userData.cardInventory.slice(0, 10).map((card, index) => ({
              name: `${index + 1}. ${card.name}`,
              value: `Value: ${String(card.value)} SkyCoins\nRarity: ${String(card.rarity)}\nHealth: ${String(card.health)}\nStrength: ${String(card.strength)}\nDefense: ${String(card.defense)}\nAmount: ${String(card.count)}\nPhoto: ${String(card.photo)}`,
              inline: false,
            }))
          );
  
        // Edit the interaction reply to send the embed
        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Error fetching card inventory from MongoDB:', error);
        // Send an error message if fetching card inventory fails
        await interaction.editReply('Error fetching card inventory.');
      }
    },
  };