const { InteractionType } = require(`discord.js`);
const profileModel = require("../../schemas/profileSchema");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);

            if (!command) return;

            let profileData;
            try {
                profileData = await profileModel.findOne({ userId: interaction.user.id });

                if (!profileData) {
                    // Als het profiel niet bestaat, maak er een aan met standaardwaarden
                    profileData = await profileModel.create({
                        userId: interaction.user.id,
                        name: interaction.user.username,
                        SkyCoins: 10,
                        cardInventory: []
                    });
                }
            } catch (error) {
                console.error(error);
            }

            try {
                command.execute(interaction, client, profileData);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: `Something went wrong PortalMaster...`,
                    ephemeral: true
                });
            }
        }
    },
};