//const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');  // Corrected typo here
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('database')
        .setDescription('Geeft je ping terug'),
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildProfile) {
            guildProfile = await new Guild({
                _id: mongoose.Types.ObjectId(),  // Corrected typo here
                guildId: interaction.guild.id,
                guildIcon: interaction.guild.iconURL() ? interaction.guild.iconURL() : "None"
            });

            await guildProfile.save().catch(console.error);
            await interaction.reply({
                content: `ServerName: ${guildProfile.guildName}`
            });
            console.log(guildProfile);
        } else {
            await interaction.reply({
                content: `Server Id: ${guildProfile.guildId}`
            });
            console.log(guildProfile);
        }
    }
};