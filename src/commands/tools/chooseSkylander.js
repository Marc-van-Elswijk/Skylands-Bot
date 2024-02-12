const { getSkylanderByName } = require("skylander.js");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chooseskylander')
        .setDescription('Geeft je een skylander naar eigen keuze')
        .addStringOption(option => 
            option.setName('skylandername')
                .setDescription('Voer hier de Skylander naam in')
                .setRequired(true)),
    async execute(interaction, client) {
        const skylandername = interaction.options.getString('skylandername'); // Use 'skylandername' here
        const skylander = await getSkylanderByName(skylandername);
        const message = await interaction.deferReply({
            fetchReply: true
        });

        if (!skylander) {
            return interaction.editReply(`Eon: De opgegeven Skylander met de naam "${skylandername}" ken ik niet. Misschien ben je iets vergeten toe te voegen?`);
        }

        const newMessage = skylander;
        const skylanderName = skylander["name"]
        const skylanderImg = skylander["image"]
        const skylanderRole = skylander["role"]
        const skylanderRelease = skylander["release"]
        const skylanderElement = skylander["element"]
        const skylanderQuote = skylander["quote"]
        const skylanderWiki = skylander["wiki"]

        const Skylander = new EmbedBuilder()
            .setTitle(`${skylanderName}`)
            .setDescription(`${skylanderQuote}`)
            .setImage(`${skylanderImg}`)
            .addFields(
                {name: 'Element:', value: `${skylanderElement}`},
                { name: '\u200B', value: '\u200B' },
                {name: 'Role:', value: `${skylanderRole}`, inline: true},
                {name: 'Release:', value: `${skylanderRelease}`, inline: true},
                {name: 'Wiki:', value: `${skylanderWiki}`, inline: true}
            )
            .setTimestamp()
            .setFooter({
                text: client.user.tag,
                icon: client.user.displayAvatarURL()
            });


        await interaction.editReply({
            embeds: [Skylander]
        });
    }
}