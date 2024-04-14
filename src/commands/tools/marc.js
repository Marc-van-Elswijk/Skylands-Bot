const { SlashCommandBuilder } = require(`discord.js`);
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('charlatan')
        .setDescription('Volg hier het verhaal van Marc Charlatan')
        .addSubcommand(subcommand =>
        subcommand.setName('trailer')
            .setDescription('beluister de trailer van Marc Charlatan'))
        .addSubcommand(subcommand =>
        subcommand.setName('story')
            .setDescription('beluister/bekijk de Marc Charlatan Show')
            .addIntegerOption(option =>
            option.setName('chapter')
                .setDescription('voer hier een hoofdstuk in')
                .setRequired(true))),

            async execute(interaction) {
                const subcommand = interaction.options.getSubcommand();
                const Message = await interaction.deferReply({ fetchReply: true, ephemeral: true});

                switch(subcommand) {
                    case 'trailer':

                        const introAudio = path.join(__dirname, '..', '..', 'resources', 'audio', 'intro.mp3');
                        const trailerAudio = path.join(__dirname, '..', '..', 'resources', 'audio', 'trailers' ,'trailer1.mp3');

                        await interaction.editReply({
                            files: [trailerAudio],
                            content: 'Trailer van Marc Charlatan. Vanaf 6 Mei H1 en van 2 Juni Trailer2'
                        });

                        return;

                    case 'story':
                        const chapter = interaction.options.getInteger('chapter');
                        const chapter1Audio = path.join(__dirname, '..', '..', 'resources', 'audio', 'chapters', 'chapter1.mp3');

                        switch (chapter) {
                            case 1:
                                await interaction.editReply({
                                    content: '6 mei komt deze chapter beschikbaar. Zit jij er al klaar voor?'
                                })

                                return;

                            default:
                                await interaction.editReply('Marc Charlatan: Kies graag 1 van de chapters (chapters: 1 - 1)')
                                return;
                        }

                        return;

                    default:
                        await interaction.editReply('Marc Charlatan: Kies graag 1 van de opties')
                        return;
                }
            }
}