const { SlashCommandBuilder } = require('discord.js');

const validColors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("omroep")
        .setDescription("laat Eon iets omroepen")
        .addStringOption(option => 
            option.setName('tekst')
                .setDescription('Voer hier de omroep in')
                .setRequired(true)),

    async execute(interaction, client) {
        const text = interaction.options.getString('tekst');
        if (!text) return interaction.reply("Je kunt niet niets sturen");

        const rawColor = interaction.options.getString('kleur');
        const colour = rawColor ? rawColor.toUpperCase() : null;

        const resolvedColor = colour && validColors.includes(colour) ? colour : null;

        // Mention the @announcements role in the description
        const announceEmbed = {
            embeds: [{
                title: "Nieuwe oproep van Eon!",
                description: `${text}\n\n@announcements`, // Include role mention
                color: resolvedColor,
            }],
        };

        const announceChannel = interaction.guild.channels.cache.find(channel => channel.name === "announcements");
        if (!announceChannel) return interaction.reply(`Kanaal bestaat niet of kan het niet vinden`);

        announceChannel.send(announceEmbed);
    }
};
