const {SlashCommandBuilder} = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gefeliciteert')
        .setDescription('feliciteer iemand met zijn/haar/hun verjaardag')
        .addStringOption(option =>
        option.setName('discorduser')
            .setDescription('Voer een discord user in')
            .setRequired(true)),

    async execute(interaction, client) {
        const message = await interaction.deferReply({fetchReply: true})
        const user = interaction.user;
        const user2 = interaction.options.getString('discorduser')
        const video = 'http://www.youtube.com/watch?v=FbDdV6etYJQ'

        await interaction.editReply(`${user} wenst ${user2} een fijne verjaardag!\n${video}`)
    }
}