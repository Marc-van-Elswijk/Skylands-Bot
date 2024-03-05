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
        await interaction.deferReply({fetchReply: true});

        const cooldown = 86400000;
        const timeLeft = cooldown - (Date.now() - dailyLastUsed);

        if (timeLeft > 0) {
            await interaction.deferReply({ ephemeral: true });
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
            await interaction.editReply(`Claim your next daily in ${hours} uur, ${minutes} minuten en ${seconds} secondes`
            );
        }

        const randomAmt = Math.floor(Math.random() * (dailyMax - dailyMin + 1) + dailyMin);

        try {
            await profileModel.findOneAndUpdate(
                { userId: id },
                {
                    $set: {
                        dailyLastUsed: Date.now(),
                    },
                    $inc: {
                        SkyCoins: randomAmt,
                    }
                }
            )
        } catch (error) {
            console.log(error);
        }

        await interaction.editReply(`Eon: Je dagelijkse beloning is/zijn: ${randomAmt} SkycoinS. Over 24 uur kan je nog meer komen ophalen`);
    },
};