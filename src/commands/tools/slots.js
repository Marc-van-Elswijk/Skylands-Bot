const { SlashCommandBuilder } = require('discord.js');
const { Slots } = require(`discord-gamecord`);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('slot')
        .setDescription('Durf jij een gokje te wagen?'),
    async execute(interaction, client) {
        const Game = new Slots({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Slot Machine',
                color: '#00c7fe'
            },

            slots: ['💧', '☁️', '🍃', '✨']
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}