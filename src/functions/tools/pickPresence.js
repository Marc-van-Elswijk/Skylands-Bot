const { ActivityType } = require('discord.js');

module.exports = (client) => {
    client.pickPresence = async () => {

        const options = [
            {
                type: ActivityType.Watching,
                text: "over the Skylanders",
                status: "online"
            },
            {
                type: ActivityType.Watching,
                text: "over Skylands and the universe",
                status: "idle"
            },
            {
                type: ActivityType.Playing,
                text: "SkyCards",
                status: "dnd"
            }
        ];

        const option = Math.floor(Math.random() * options.length);

        client.user.setPresence({
            activities: [{
                name: options[option].text,
                type: options[option].type
            }],
            status: options[option].status
        });
    }
}