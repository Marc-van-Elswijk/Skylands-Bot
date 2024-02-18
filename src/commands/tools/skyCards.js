const getSkyCardRandom = require("skylander.js/src/methods/getSkyCardRandom");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const profileModel = require("../../schemas/profileSchema");


//cooldown const
const cooldown = 60000;
//cooldown const
const cooldowns = new Set();
const cooldownTime = 60000;
const cooldownStartTime = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skycard')
        .setDescription('Geeft je een random skylander kaart'),
    async execute(interaction, client) {
        const skylander = await getSkyCardRandom();
        await interaction.deferReply({ fetchReply: true });

        const newMessage = skylander;
        const skylanderName = skylander["name"]
        const skylanderQuote = skylander["quote"]
        const skylanderRarity = skylander["rarity"]
        const skylanderGame = skylander["game"]
        const skylanderCardBack = skylander["cardback"]
        const skylanderCardBack2 = "https://cdn.discordapp.com/attachments/1205284717705039962/1205885050827182090/Dark_Card.jpg"
        const skylanderCardFront = skylander["cardfront"]
        //const skylanderValue = skylander["value"]

        const SkyCard = new EmbedBuilder()
            .setTitle(`${skylanderName}`)
            .setDescription(`${skylanderQuote}`)
            .setImage(`${skylanderCardFront}`)
            .setColor(`Blurple`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Rarity:', value: `${skylanderRarity}`, inline: true },
                { name: 'Game:', value: `${skylanderGame}`, inline: true },
                //{ name: 'Value:', value: `${skylanderValue} skycoins`, inline: true }
            )
            .setTimestamp()
            .setFooter({
                text: client.user.tag,
                icon: client.user.displayAvatarURL()
            });

        const content = `Poortmeester ${interaction.user} heeft een kaart getrokken. Spannend!`;
        const content2 = `Achterkant: ${skylanderCardBack}`;
        const dark = `${skylanderCardBack2}`
        const content3 = `Naam: ${skylanderName}\nKaart: ${skylanderCardFront}`
        const dark1 = `Eon: Sorry Poortmeester, maar er lijkt iets fout twe ziejn jn juew kwea-`


        if (cooldowns.has(interaction.user.id)) {
            const remainingCooldown = cooldownTime - (Date.now() - cooldownStartTime.get(interaction.user.id));

            const remainingCooldownSeconds = Math.max(0, Math.ceil(remainingCooldown / 1000));

            interaction.editReply(`Eon: U gaat veelste snel Poortmeester. Ik ga nog even mijn baard fixen en dan ben ik zo bij u terug!\n\nJe kan weer een kaart aan Eon vragen over: ${remainingCooldownSeconds} seconde`)
        } else {

            cooldownStartTime.set(interaction.user.id, Date.now());

            await interaction.editReply({
                content: content
            });

            await wait(3_500);

            await interaction.editReply({
                content: content2
            });

            if (skylanderRarity == "dark") {

                cooldowns.add(interaction.user.id);

                setTimeout(() => {
                    cooldowns.delete(interaction.user.id);
                    cooldownStartTime.delete(interaction.user.id);
                }, cooldownTime);

                await wait(1_500);

                await interaction.editReply({
                    content: dark1
                });

                await wait(4_000)

                await interaction.editReply({
                    content: 'Kaos: Waahaahahaha. Did you really think I was gone for good?!'
                });

                await wait(4_000)

                await interaction.editReply({
                    content: dark
                });

                await wait(3_00)

                await interaction.editReply({
                    content: 'Your card is:',
                    embeds: [SkyCard]
                });

            } else {

                cooldowns.add(interaction.user.id);

                setTimeout(() => {
                    cooldowns.delete(interaction.user.id);
                    cooldownStartTime.delete(interaction.user.id);
                }, cooldownTime);

                await wait(1_500);

                await interaction.editReply({
                    content: 'Your card is::',
                    embeds: [SkyCard]
                })
            }
        }
    }
}