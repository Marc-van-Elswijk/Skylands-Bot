const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('story')
        .setDescription('story mode comming soon'),
    async execute(interaction, client) {

       const storyMessage = await interaction.deferReply({ fetchReply: true });

       await interaction.editReply(`Esmeralda Muziek meisje!\n🎼 Kom blijf maar staan. Ik beveel mij van hartelijk aan. Uw lot ligt nu in mijn handen profiteer ervan. Jajaja kom laat je gaan. Referenties van hier tot de maan en fameus in vele landen. Marc Char-la-taaaaan🎶\nGoed waarde gasten mijn naam is Marc Charlatan en samen met mijn draaiorgel Esmeralda heb ik heel de wereld over gerezen. Ik heb vele landen mogen mee maken en veel dansjes gedaan. Mijn orgel speelt de meeste mooie muziek. De sintakie, het zwanenmeer maar elke keer lijkt er wel iets mis te gaan... alsof ze bezeten is. Op een duistere avond heeft zij mij hier naar Skylands toegeleid, maar dat ging niet zonder gevaren.... Ben jij nou benieuwd naar hoe mijn verhaal verder gaat? Hou dan 13 mei vrij in je agenda, want dan vertel ik mijn verhaal hier in de server!\n~Marc Charlatan\n \nhttps://discord.gg/QK2Nt2U3?event=1227917025586839636`);

       await wait(15000);

       await storyMessage.delete();

        
    }
}