require("dotenv").config();
const { token, databaseToken: db } = process.env;
const mongoose = require('mongoose');
const mongoUri = process.env.databaseToken;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const cooldown = new Map();

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("SkyBase is succesvol geconnect aan je bot");
}).catch((err) => {
  console.log(err);
})

client.login(token);
