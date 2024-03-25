const getSkyCardRandom = require("skylander.js/src/methods/getSkyCardRandom");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const profileModel = require("../../schemas/profileSchema");


//cooldown const
const cooldown = 30000;
//cooldown const
const cooldowns = new Set();
const cooldownTime = 30000;
const cooldownStartTime = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sky')
        .setDescription('Skycard commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('pull')
                .setDescription('Get a random card from Eon'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('trade')
                .setDescription('Trade your card with another user'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('sell')
                .setDescription('Verkoop de kaarten die je hebt')
                .addStringOption(option =>
                    option.setName('skylanderid')
                        .setDescription('De skylanderId van de kaart die je wilt verkopen')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Het aantal kaarten dat je wilt verkopen')
                        .setRequired(true)
                )
        ),



    async execute(interaction, client) {
        let userProfile = await profileModel.findOne({ userId: interaction.user.id });
        const skylander = await getSkyCardRandom();
        const skymessage = await interaction.deferReply({ fetchReply: true });
        const subcommand = interaction.options.getSubcommand();

        if (!skymessage || !skymessage.id) {
            return console.error('Failed to retrieve the deferred message ID.');
        }

        //nog geen user?
        if (!profileModel) {
            profileModel = new profileModel({
                userId: interaction.user.id,
                name: interaction.user.username,
                SkyCoins: 10,
                dailyLastUsed: 0,
                cardLastUsed: 0,
                cardInventory: [], // Initieer de inventaris als lege array
            });
        }

        //card info
        const newMessage = skylander;
        const skylanderId = skylander["id"]
        const skylanderName = skylander["name"]
        const skylanderQuote = skylander["quote"]
        const skylanderRarity = skylander["rarity"]
        const skylanderElement = skylander["element"]
        const skylanderGame = skylander["game"]
        const skylanderCardBack = skylander["cardback"]
        const skylanderCardBack2 = "https://cdn.discordapp.com/attachments/1205284717705039962/1205885050827182090/Dark_Card.jpg"
        const skylanderCardFront = skylander["cardfront"]
        const skylanderValue = skylander["value"]
        const skylanderHealth = skylander["health"]
        const skylanderStrength = skylander["strength stat"]
        const skylanderDefense = skylander["defense stat"]
        const skylanderdbphoto = skylander["database"]

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
                { name: `SkylanderId:`, value: `${skylanderId}`, inline: true },
                { name: 'Rarity:', value: `${skylanderRarity}`, inline: true },
                { name: 'Value:', value: `${skylanderValue} skycoins`, inline: true },
                { name: 'Health:', value: `${skylanderHealth} HP`, inline: true },
                { name: 'Strength:', value: `${skylanderStrength}`, inline: true },
                { name: 'Defense:', value: `${skylanderDefense}`, inline: true }
            )
            .setTimestamp()
            .setFooter({
                text: client.user.tag,
                icon: client.user.displayAvatarURL()
            });

        if (subcommand === 'pull') {

            //push card in inventory player
            const drawnCard = {
                skylanderid: skylanderId,
                name: skylanderName,
                photo: skylanderCardFront,
                element: skylanderElement,
                rarity: skylanderRarity,
                value: skylanderValue,
                health: skylanderHealth,
                strength: skylanderStrength,
                defense: skylanderDefense
            };

            const existingCard = userProfile.cardInventory.find(card => card.name === drawnCard.name);

            if (existingCard) {
                existingCard.count++;
                const existingSkylanderId = existingCard.skylanderid;
                if (existingSkylanderId !== skylanderId) {
                    existingCard.skylanderid = skylanderId;
                }
            } else {
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

                cooldowns.add(interaction.user.id);

                setTimeout(() => {
                    cooldowns.delete(interaction.user.id);
                    cooldownStartTime.delete(interaction.user.id);
                }, cooldownTime);

                await interaction.editReply({
                    content: content
                });

                await wait(4000);

                if (!existingCard) {
                    await interaction.editReply({
                        content: `*Eon: Look at that Portalmaster. A new card for your Skylander Collection!*`
                    });

                    await wait(4000);
                }

                await interaction.editReply({
                    content: content2
                });

                if (skylanderRarity == "tcr") {
                    await wait(2500);

                    switch (skylanderName) {

                        case "Lokale Programmeur":
                            await interaction.editReply({
                                content: `Baron Erso: Hey Eon ouwe gozer van me. Hoe staat het met mijn goud machine?!`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Eon: Goededag Baron. Ik was net bezig met een kaart uit te delen`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Baron Erso: Een kaart?! Aan wie dan precies?!!`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Eon: Nou aan portaalmeester ${interaction.user}`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Baron Erso: Ooh maar das 1 van mijn beste kompels! Ik heb wel een goed kaartje voor ${interaction.user}`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Eon: weet je dat zeker?`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Baron Erso: Jahoor. Ik kom zelf uit Codeville thanks tot een programmeur. Ik heb een kaartje van hem`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Eon: Jij wilt de speler een kaart van een programmeur geven?`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Baron Erso: Jahoor let jij maar eens op!`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: 'Baron Erso: Kijk eens mijn trouwe kompel. Uw kaart is:',
                                embeds: [SkyCard]
                            });

                            return;

                        case "Lokale Kapsalon":

                            await interaction.editReply({
                                content: `*De deurbel gaat*`
                            });

                            await wait(3500);

                            await interaction.editReply({
                                content: `Eon: Aah kijk. Eten is er *loopt naar de deur*`
                            });

                            await wait(3000);

                            await interaction.editReply({
                                content: `Eruptor: Eindelijk. Ik begon trek te krijgen`
                            });

                            await wait(3000);

                            await interaction.editReply({
                                content: `*Eon doet de deur open en de lokale turk staat ervoor*`
                            });

                            await wait(2500);

                            await interaction.editReply({
                                content: `Lokale Turk: goededag meneer. uw bestelling met extra Baklava. *duwt het tasje in Eon's handen en verdwijnt*`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Eon: *kijkt in de tas* GODVERDOMME KUT TURK! DIT ZIJN GEEN TURKSE PIZZA'S!`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: 'Lokale Turk: Kijk is uw bestelling:',
                                embeds: [SkyCard]
                            });

                            return;

                        case "Lokale Macgreg":
                            await interaction.editReply({
                                content: `Eon: Dit is wel een bijzondere kaart...`
                            });

                            await wait(2500);

                            await interaction.editReply({
                                content: `Baron Erso: Hoezo dat dan? Het is gewoon een goed uitziende burger`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `${interaction.user.username}: Is dat niet de MacGreg van Makelele`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Baron Erso: Makelele? Nee die kan dit niet betalen`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Eon: Uhm... Hier is je kaart? *Geeft de kaart aan ${interaction.user.username}*`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `${interaction.user.username}: uhm... dit is mijn kaart ig?:`,
                                embeds: [SkyCard]
                            });

                            return;

                        case "Lokale Jood":
                            await interaction.editReply({
                                content: `Marc: Laat deze maar over aan mij Eon`
                            });

                            await wait(2500);

                            await interaction.editReply({
                                content: `Eon: oh dat zou ik zeer fijn vinden ja. Ik word moe van die kaartjes maken`
                            });

                            await wait(5000);

                            await interaction.editReply({
                                content: `Marc: Dat dacht ik al. Laat mij maar even`
                            });

                            await wait(2500);

                            await interaction.editReply({
                                content: `Eon: Dankjewel *loopt weg*`
                            });

                            await wait(2500);

                            await interaction.editReply({
                                content: `Marc: Had dit nou maar niet gedaan >:)`
                            });

                            await wait(2500)

                            await interaction.editReply({
                                content: 'Marc: Jouw kaart is nu:',
                                embeds: [SkyCard]
                            });

                            return;



                        case "Lokale Turk":

                            await interaction.editReply({
                                content: `Eon: een secondje hoor jongens. Van al dat kaarten uitdelen krijg ik trek zeg`
                            });

                            await wait(4000)

                            await interaction.editReply({
                                content: `Eruptor: ja maar ik heb net heel die koelkast opgegeten Eon. Kwam er effe wat eerder mee jij jood`
                            });

                            await wait(4000);

                            await interaction.editReply({
                                content: `Eon: ach hou je kop vuile nazi. we bestellen wat bij de plaatselijke turk`
                            });

                            await wait(5000)

                            await interaction.editReply({
                                content: 'Eon: Your card is:',
                                embeds: [SkyCard]
                            });

                            return;

                        case "Lokale Kut Chinees":

                            await interaction.editReply({
                                content: `Eon: een secondje hoor jongens. Van al dat kaarten uitdelen krijg ik trek zeg`
                            });

                            await wait(4000)

                            await interaction.editReply({
                                content: `Stealth Elf: Eon kom op zeg! Dit meent u toch niet?!`
                            });

                            await wait(3500);

                            await interaction.editReply({
                                content: `Eon: Jij snapt gewoon niet hoe hard mijn baan is Stealth Elf. Ik moet regeren over Skylanders, Zorgen dat Kaos niet aanvalt, zorgen dat mijn baard goed zit en kaartjes uitdelen. Ik verdien eten`
                            });

                            await wait(5500);

                            await interaction.editReply({
                                content: `Stealth Elf: Bestel dan iets bij de chinees ofzo. Heb ik wel trek in eigenlijk`
                            });

                            await wait(3500);

                            await interaction.editReply({
                                content: `Eon: Bij die kut chinees? De laatste keer 3 uur van op de wc gezeten ja!.. maar sinds ik honger heb en je het zo aandringt is het geen slecht idee`
                            });

                            await wait(5500);


                            await interaction.editReply({
                                content: 'Eon: Your card is:',
                                embeds: [SkyCard]
                            });

                            return;

                        case "Lokale Panda":

                            await interaction.editReply({
                                content: `Eon: een secondje hoor jongens. Van al dat kaarten uitdelen krijg ik trek zeg`
                            });

                            await wait(4000)

                            await interaction.editReply({
                                content: `Stealth Elf: Eon kom op zeg! Dit meent u toch niet?!`
                            });

                            await wait(3500);

                            await interaction.editReply({
                                content: `Eon: Jij snapt gewoon niet hoe hard mijn baan is Stealth Elf. Ik moet regeren over Skylanders, Zorgen dat Kaos niet aanvalt, zorgen dat mijn baard goed zit en kaartjes uitdelen. Ik verdien eten`
                            });

                            await wait(5500);

                            await interaction.editReply({
                                content: `Stealth Elf: Bestel dan iets bij de chinees ofzo. Heb ik wel trek in eigenlijk`
                            });

                            await wait(3500);

                            await interaction.editReply({
                                content: `Eon: Bij die kut chinees? De laatste keer 3 uur van op de wc gezeten ja!.. maar sinds ik honger heb en je het zo aandringt is het geen slecht idee`
                            });

                            await wait(5500);

                            await interaction.editReply({
                                content: `*Op dat zelfde moment verschijnt voor de Acedemy een portaal en daar zien we een dier.. Nee een panda uitstappen en hij loopt de Acedemy in*`
                            });

                            await wait(5500);

                            await interaction.editReply({
                                content: `Eon: Wie ben jij nou weer?`
                            });

                            await wait(5500);

                            await interaction.editReply({
                                content: `Panda: Ik? Ik ben de drakenkrijger. Beter bekend als Po`
                            });

                            await wait(5500);

                            await interaction.editReply({
                                content: `Eon: Aangenaam Po. Ik wil niet heel vervelend doen maar deze Acedemy is enkel voor Skylanders`
                            });

                            await wait(5500);

                            await interaction.editReply({
                                content: `Po: Dat snap ik, maar ik hoorde dat je bij de kut chinees wou bestellen. Ik ben hier om dat te redden`
                            });

                            await wait(5500);

                            await interaction.editReply({
                                content: `Eon: allemaal leuk en aardig maar wat gaan we dan eten?`
                            });

                            await wait(5500);

                            await interaction.editReply({
                                content: `Po: We gaan allemaal aan de noedels en al zie ik iemand met vork en lepel eten....`
                            });

                            await wait(5500);


                            await interaction.editReply({
                                content: 'Po: Jouw kaart is:',
                                embeds: [SkyCard]
                            });

                            return;
                    }
                }

                if (skylanderRarity == "Dark") {

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

                        //dark Spyro (S1)

                        case "Dark Spyro (S1)":
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

                            break;

                        //dark BlastZone

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

                            break;

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

                            await wait(5_00)

                            await interaction.editReply({
                                content: 'Kaos: Your card is:',
                                embeds: [SkyCard]
                            });

                            break;

                        //dark Wash Buckler

                        case "Dark Wash":
                            await interaction.editReply({
                                content: 'Wash Buckler: Not so far Kaos!'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Kaos: Look at that. A fishy Wash Buckler. A SwapForce which means you have 2 parts! **Behoooold!!**'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: '*Koas fires black lightning at Wash Buckler and as soon as he got hit he turns into Dark Wash Buckler*'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Glumshanks: uhm master. It looks like he is still himself'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Kaos: I wasnt done Glumshanks! behoooooooooooold! *Rips Wash Buckler apart and let Buckler dissapears*'
                            });

                            await wait(5_00)

                            await interaction.editReply({
                                content: 'Kaos: Your card is:',
                                embeds: [SkyCard]
                            });

                            break;

                        case "Dark Buckler":
                            await interaction.editReply({
                                content: 'Wash Buckler: Not so far Kaos!'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Kaos: Look at that. A fishy Wash Buckler. A SwapForce which means you have 2 parts! **Behoooold!!**'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: '*Koas fires black lightning at Wash Buckler and as soon as he got hit he turns into Dark Wash Buckler*'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Glumshanks: uhm master. It looks like he is still himself'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Kaos: I wasnt done Glumshanks! behoooooooooooold! *Rips Wash Buckler apart and let Wash dissapears*'
                            });

                            await wait(5_00)

                            await interaction.editReply({
                                content: 'Kaos: Your card is:',
                                embeds: [SkyCard]
                            });

                            break;

                        // dark slobber tooth
                        case "Dark Slobber Tooth":
                            await interaction.editReply({
                                content: 'Slobber Tooth: Nah uh'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Kaos: Look at that. Slobber Tooth. I think you look better in black! **Behoooold!!**'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: '*Koas fires black lightning at Slobber Tooth and as soon as Slobber Tooth got hit he turns into Dark Slobber Tooth*'
                            });

                            await wait(5_000)

                            await interaction.editReply({
                                content: 'Kaos: Your card is:',
                                embeds: [SkyCard]
                            });

                            break;

                        // dark Vulcanic Eruptor
                        case "Vulcanic Eruptor":
                            await interaction.editReply({
                                content: 'Eruptor: It will get hot down here!'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Kaos: Eruptor?  Well I think you can be something way better **Behoooold!!**'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: '*Koas fires black lightning at Eruptor and as soon as Eruptor got hit he turns into Dark Eruptor*'
                            });

                            await wait(4000)

                            await interaction.editReply({
                                content: 'Glumshanks: I dont know if this is a good idea master. Look at him. Not special at all'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Kaos: Your right Glumy.. Throw him in the vulcano!'
                            });

                            await wait(5000)

                            await interaction.editReply({
                                content: 'Kaos: Your card is:',
                                embeds: [SkyCard]
                            });

                            break;

                        //dark ...
                        case "Dark Mega Ram Spyro":
                            await interaction.editReply({
                                content: 'Spyro: Not so far Kaos!'
                            });

                            await wait(4_000)

                            await interaction.editReply({
                                content: 'Kaos: Look at that. The almighty Spyro.. but with more horn... weirdo **Behoooold!!**'
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

                            break;
                    }
                } else {

                    await wait(1_500);

                    await interaction.editReply({
                        content: 'Eon: Your card is:',
                        embeds: [SkyCard]
                    })
                }
            }
        }

        if (subcommand === 'sell') {
            const targetSkylanderId = interaction.options.getString('skylanderid');
            const amount = interaction.options.getInteger('amount');
        
            if (!targetSkylanderId) {
                await interaction.editReply({
                    content: `Baron Erso: Please provide a valid skylanderId for the card you want to sell.`
                });
                return;
            }
        
            console.log('Target Skylander ID:', targetSkylanderId);
        
            // Zoek de kaart in de inventaris op basis van de skylanderId
            const existingCardIndex = userProfile.cardInventory.findIndex(card => {
                if (card.skylanderid !== undefined && card.skylanderid !== null) {
                    // Controleer of de skylanderId van de kaart overeenkomt met het doel-skylanderId
                    return card.skylanderid.toString() === targetSkylanderId.toString();
                }
                return false;
            });
        
            // Controleer of de kaart is gevonden
            if (existingCardIndex === -1) {
                await interaction.editReply({
                    content: `Baron Erso: You don't have a card with that Id in your Inventory. Please use another Id`
                });
                return;
            }
        
            // Haal de gevonden kaart op
            const existingCard = userProfile.cardInventory[existingCardIndex];
            const cardValue = existingCard.value;
            const cardName = existingCard.name;
        
            // Controleer of de speler voldoende kaarten heeft om te verkopen
            if (existingCard.count < amount) {
                await interaction.editReply({
                    content: `Baron Erso: You don't have enough cards to sell. Please specify a valid amount.`
                });
                return;
            }
        
            // Bereken de totale waarde van de verkochte kaarten
            const totalValue = cardValue * amount;
        
            // Voeg de totale waarde van de kaarten toe aan de SkyCoins van de gebruiker
            userProfile.SkyCoins += totalValue;
        
            // Verwijder de kaarten uit de inventaris op basis van het opgegeven aantal
            if (existingCard.count === amount) {
                userProfile.cardInventory.splice(existingCardIndex, 1);
            } else {
                existingCard.count -= amount;
            }
        
            // Opslaan van userProfile in de database
            await userProfile.save();
        
            // Bevestig dat de kaart is verkocht en het geld is toegevoegd aan de SkyCoins
            await interaction.editReply({
                content: `Marc: Thank you for selling ${amount} ${cardName} card(s). You receive ${totalValue} SkyCoins from me.`
            });
        }
        

        if (subcommand === 'trade') {
            await interaction.editReply({
                content: `Eon: Comming Soom`
            })
        }
    }
}