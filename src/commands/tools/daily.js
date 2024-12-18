const { SlashCommandBuilder } = require('discord.js');
const parseMilliseconds = require('parse-ms-2');
const profileModel = require("../../schemas/profileSchema");
const { dailyMin, dailyMax } = require("../../globalValues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Gratis SkyCoins elke dag!'),
    async execute(interaction, client, profileData) {
        const { id } = interaction.user;
        const { dailyLastUsed } = profileData;

        try {
            // Controleer of de interactie al is uitgesteld of beantwoord
            if (interaction.deferred || interaction.replied) {
                return;
            }

            // Probeer de interactie uit te stellen
            await interaction.deferReply({ ephemeral: true, fetchReply: true });
            
            const cooldown = 86400000; // 24 uur cooldown in milliseconden
            const timeLeft = cooldown - (Date.now() - dailyLastUsed);

            if (timeLeft > 0) {
                // Als er nog tijd over is, bewerk het uitgestelde bericht met de resterende tijd
                const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
                return await interaction.editReply(`Claim your next daily in ${hours} uur, ${minutes} minuten en ${seconds} secondes`);
            }

            // Voer de logica uit om dagelijkse beloningen te geven
            const randomAmt = Math.floor(Math.random() * (dailyMax - dailyMin + 10) + dailyMin);

            await profileModel.findOneAndUpdate(
                { userId: id },
                {
                    $set: {
                        dailyLastUsed: Date.now(),
                        name: interaction.user.username
                    },
                    $inc: {
                        SkyCoins: randomAmt,
                    }
                }
            );

            // Bewerk het uitgestelde bericht met de dagelijkse beloning
            await interaction.editReply(`Eon: Here are your daily coins of: ${randomAmt} SkyCoins. Come back in 24 hours to claim some more`);
        } catch (error) {
            console.error('Error processing daily command:', error);
            await interaction.followUp('An error occurred while processing your daily reward.');
        }
    },
};
