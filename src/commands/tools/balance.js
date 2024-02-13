const { SlashCommandBuilder } = require('discord.js');
const Profile = require('../../schemas/profileSchema'); // Update the path accordingly

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Shows your SkyCoins balance'),

  async execute(interaction) {
    try {
      const { user } = interaction;
      const userId = user.id;

      // Check if the interaction has already been acknowledged
      if (interaction.deferred || interaction.replied) {
        console.log('Interaction already acknowledged');
        return;
      }

      // Uitstellen van het antwoord
      await interaction.deferReply();

      // Check if the user exists in the database
      let userProfile = await Profile.findOne({ userId });

      if (!userProfile) {
        // If the user doesn't exist, create a new profile
        userProfile = new Profile({ userId });
        await userProfile.save();
      }

      const username = user.username;
      const skyCoins = userProfile.SkyCoins;

      // Beantwoorden van de interactie
      await interaction.followUp(`${username} heeft ${skyCoins} SkyCoins`);
    } catch (error) {
      // Check if the error is due to an unknown interaction
      if (error.code === 10062) {
        console.log('Ignoring error for unknown interaction');
        return;
      }

      console.error('Error in balance command:', error);

      // Ensure that the error is not due to an already handled interaction
      if (!interaction.deferred && !interaction.replied) {
        await interaction.followUp('Er is een fout opgetreden bij het ophalen van de SkyCoins.');
      }
    }
  },
};
