const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rekenmachine')
        .setDescription('Arnout Challange')
        .addIntegerOption(option =>
        option.setName('nummer1')
            .setDescription('voer hiet het eerste getal in')
            .setRequired(true))
        .addStringOption(option =>
        option.setName('operator')
            .setDescription('voer hier: *, /, + of - in')
            .setRequired(true))
        .addIntegerOption(option =>
        option.setName('nummer2')
            .setDescription('voer het tweede getal in')
            .setRequired(true)),

    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const number1 = interaction.options.getInteger('nummer1');
        const variable = interaction.options.getString('operator')
        const number2 = interaction.options.getInteger('nummer2')
        let result;

        switch(variable) {
            case '+':
                result = number1 + number2;
                await interaction.editReply(`${number1} + ${number2} = ${result}`);
                return;

            case '-':
                result = number1 - number2;
                await interaction.editReply(`${number1} - ${number2} = ${result}`);
                return;

            case '*':
                result = number1 * number2;
                await interaction.editReply(`${number1} * ${number2} = ${result}`);
                return;

            case '/':
                result = number1 / number2;
                await interaction.editReply(`${number1} / ${number2} = ${result}`);
                return;

            default:
                await interaction.editReply('U hebt geen juiste Operator ingevoerd. Kies uit: *, /, + of -')
                return;
        }

    }
}