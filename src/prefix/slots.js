const { Slots } = require(`discord-gamecord`);


module.exports = {
    name: 'slots',
    description: 'lekker gokken.',

    run: async (client, message, args) => {
        const Game = new Slots({
            message: message,
            isSlashGame: false,
            embed: {
                title: 'Slot Machine',
                color: '#00c7fe'
            },

            slots: ['💧', '☁️', '🍃', '✨']
        });

        Game.startGame();
        Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
        })
    }
};