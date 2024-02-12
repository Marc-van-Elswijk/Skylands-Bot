const fs = require('fs');
const { MongoClient } = require('mongodb');

module.exports = (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync(`./src/events`);

        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter(file => file.endsWith('.js'));

            switch (folder) {
                case "client":
                    for (const file of eventFiles) {
                        const event = require(`../../events/${folder}/${file}`);
                        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
                        else client.on(event.name, (...args) => event.execute(...args, client));
                    }
                    break;
                    
                case "mongo":
                    const mongoUri = process.env.databaseToken;
                    const mongoClient = new MongoClient(mongoUri);

                    try {
                        await mongoClient.connect();

                        for (const file of eventFiles) {
                            const event = require(`../../events/${folder}/${file}`);
                            // Pass the mongoClient to the execute function
                            if (event.once) event.execute(mongoClient, client);
                            else event.execute(mongoClient, client);
                        }
                    } finally {
                        // Close the MongoDB connection when done
                        await mongoClient.close();
                    }
                    break;

                default:
                    break;
            }
        }
    };
};