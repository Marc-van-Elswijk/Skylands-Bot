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
        let userProfile = await profileModel.findOne({ userId: interaction.user.id });
        const skylander = await getSkyCardRandom();
        await interaction.deferReply({ fetchReply: true });

        //nog geen user?
        if (!profileModel) {
            profileModel = new profileModel({
                userId: interaction.user.id,
                SkyCoins: 10,
                dailyLastUsed: 0,
                cardLastUsed: 0,
                cardInventory: [], // Initieer de inventaris als lege array
            });
        }

        //card info
        const newMessage = skylander;
        const skylanderName = skylander["name"]
        const skylanderQuote = skylander["quote"]
        const skylanderRarity = skylander["rarity"]
        const skylanderElement = skylander["element"]
        const skylanderGame = skylander["game"]
        const skylanderCardBack = skylander["cardback"]
        const skylanderCardBack2 = "https://cdn.discordapp.com/attachments/1205284717705039962/1205885050827182090/Dark_Card.jpg"
        const skylanderCardFront = skylander["cardfront"]
        const skylanderValue = skylander["value"]

        //color for the embeds
        function colorEmbed(skylanderElement) {
            switch (skylanderElement.toLowerCase()) {
                case 'fire':
                    return '#FF0000'; // Red
                case 'earth':
                    return '#8B4513'; // Brown
                case 'undead':
                    return '#808080'; // Grey
                case 'air':
                    return '#ADD8E6'; // Light Blue
                case 'life':
                    return '#00FF00'; // Green
                case 'magic':
                    return '#800080'; // Purple
                case 'tech':
                    return '#FFA500'; // Orange
                case 'water':
                    return '#00008B'; // Dark Blue

                default:
                    return '#7289DA'; // Blurple as default
            }
        }

        //embed for the cards
        const SkyCard = new EmbedBuilder()
            .setTitle(`${skylanderName}`)
            .setDescription(`${skylanderQuote}`)
            .setImage(`${skylanderCardFront}`)
            .setColor(colorEmbed(skylanderElement))
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Rarity:', value: `${skylanderRarity}`, inline: true },
                { name: 'Game:', value: `${skylanderGame}`, inline: true },
                { name: 'Value:', value: `${skylanderValue} skycoins`, inline: true }
            )
            .setTimestamp()
            .setFooter({
                text: client.user.tag,
                icon: client.user.displayAvatarURL()
            });

        //push card in inventory player
        const drawnCard = {
            name: skylanderName,
            rarity: skylanderRarity,
            value: skylanderValue, // Voeg dit toe als je de waarde ook wilt opslaan
        };

        const existingCard = userProfile.cardInventory.find(card => card.name === drawnCard.name);

        if (existingCard) {
            // Als de kaart al in de inventaris staat, verhoog het aantal
            existingCard.count++;
        } else {
            // Als de kaart nog niet in de inventaris staat, voeg deze toe
            userProfile.cardInventory.push({
                ...drawnCard,
                count: 1,
            });
        }
        await userProfile.save();


        //content
        const content = `Portalmaster ${interaction.user} has drawn a card`;
        const content2 = `Back of the card: ${skylanderCardBack}`;
        const dark = `${skylanderCardBack2}`


        if (cooldowns.has(interaction.user.id)) {
            const remainingCooldown = cooldownTime - (Date.now() - cooldownStartTime.get(interaction.user.id));

            const remainingCooldownSeconds = Math.max(0, Math.ceil(remainingCooldown / 1000));

            interaction.editReply(`Eon: You are too fast portalmaster. I'm gonna fix my beard and then I'm gonna give you another card.\n :musical_score: when your beard is getting weird. beard spray, for men:notes: \n\nYou can ask for a new card in: ${remainingCooldownSeconds} seconde(s)`)
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
                    content: `Eon: Sorry Portalmaster, but somethwing wrnt wran. w..h yoer daw-`
                });

                await wait(4_000)

                await interaction.editReply({
                    content: 'Kaos: Waahaahahaha. Did you really think I was gone for good?! I have more power than you think!'
                });

                await wait(4_000)

                switch (skylanderName) {
                    case "Dark Spyro (S1)" || skylanderName == "Dark Spyro (S3)":
                        await interaction.editReply({
                            content: 'Spyro: Not so far Kaos!'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: 'Kaos: Look at that. The almighty Spyro. You think you really think you can stop me?! **Behoooold!!**'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: '*Koas fires black lightning at Spyro and as soon as spyro got hit he turns into Dark Spyro*'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: dark
                        });

                        await wait(5_00)

                        await interaction.editReply({
                            content: 'Kaos: Your card is:',
                            embeds: [SkyCard]
                        });

                    case "Dark Zone":
                        await interaction.editReply({
                            content: 'BlastZone: Not so far Kaos!'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: 'Kaos: Look at that. A wild BlastZone. You are a SwapForce which means you have 2 parts! **Behoooold!!**'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: '*Koas fires black lightning at BlastZone and as soon as he got hit he turns into Dark BlastZone*'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: 'Glumshanks: uhm master. It looks like he is still himself'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: 'Kaos: I wasnt done Glumshanks! *Rips BlastZone apart and let Blast dissapears*'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: dark
                        });

                        await wait(5_00)

                        await interaction.editReply({
                            content: 'Kaos: Your card is:',
                            embeds: [SkyCard]
                        });

                    case "Dark Blast":
                        await interaction.editReply({
                            content: 'BlastZone: Not so far Kaos!'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: 'Kaos: Look at that. A wild BlastZone. A SwapForce which means you have 2 parts! **Behoooold!!**'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: '*Koas fires black lightning at BlastZone and as soon as he got hit he turns into Dark BlastZone*'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: 'Glumshanks: uhm master. It looks like he is still himself'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: 'Kaos: I wasnt done Glumshanks! *Rips BlastZone apart and let Zone dissapears*'
                        });

                        await wait(4_000)

                        await interaction.editReply({
                            content: dark
                        });

                        await wait(5_00)

                        await interaction.editReply({
                            content: 'Kaos: Your card is:',
                            embeds: [SkyCard]
                        });

                    
                }
            } else {

                cooldowns.add(interaction.user.id);

                setTimeout(() => {
                    cooldowns.delete(interaction.user.id);
                    cooldownStartTime.delete(interaction.user.id);
                }, cooldownTime);

                await wait(1_500);

                await interaction.editReply({
                    content: 'Eon: Your card is:',
                    embeds: [SkyCard]
                })
            }
        }
    }
}