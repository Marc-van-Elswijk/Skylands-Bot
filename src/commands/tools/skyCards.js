const getSkyCardRandom = require("skylander.js/src/methods/getSkyCardRandom");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

//cooldown const
const cooldown = new Set();
const cooldownTime = 60000;
const cooldownStartTime = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skycard')
        .setDescription('Geeft je een random skylander kaart'),
    async execute(interaction, client) {
        const skylander = await getSkyCardRandom() ;
        const message = await interaction.deferReply({
            fetchReply: true
        });

        const newMessage = skylander;
        const skylanderName = skylander["name"]
        const skylanderRarity = skylander["rarities"]
        const skylanderCardBack = skylander["cardback"]
        const skylanderCardBack2 = "https://cdn.discordapp.com/attachments/1205284717705039962/1205885050827182090/Dark_Card.jpg"
        const skylanderCardFront = skylander["cardfront"]
        const skylanderElement = skylander["element"]

        const SkyCard = new EmbedBuilder()
            .setTitle(`${skylanderName}`)
            .setDescription(`Element: ${skylanderElement}`)
            .setImage(`${skylanderCardFront}`)
            .addFields(
                {name: 'Rarity:', value: `${skylanderRarity}`}
            )

        const content = `Poortmeester ${interaction.user} heeft een kaart getrokken. Spannend!`;
        const content2 = `Achterkant: ${skylanderCardBack}`;
        const dark = `Achterkant: ${skylanderCardBack2}`
        const content3 = `Naam: ${skylanderName}\nKaart: ${skylanderCardFront}`
        const dark1 = `Eon: Sorry Poortmeester, maar er lijkt iets fout twe ziejn jn juew kwea-`
        

        if (cooldown.has(interaction.user.id)) {
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

                cooldown.add(interaction.user.id);

                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                    cooldownStartTime.delete(interaction.user.id);
                }, cooldownTime);

                await wait(1_500);

                await interaction.editReply({
                    content: dark1
                });

                await wait(4_000)

                await interaction.editReply({
                    content: dark
                });

                await wait(3_00)

                await interaction.editReply({
                    content: content3
                });

            } else {

                cooldown.add(interaction.user.id);

                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                    cooldownStartTime.delete(interaction.user.id);
                }, cooldownTime);

                await wait(1_500);

                await interaction.editReply({
                    content: content3,
                })
            }
        }
    }
}