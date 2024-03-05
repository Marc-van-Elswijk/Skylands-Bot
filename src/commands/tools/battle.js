const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const profileModel = require('../../schemas/profileSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('battle')
        .setDescription('Daag een andere speler uit')
        .addUserOption(option =>
            option.setName('gebruiker')
                .setDescription('De gebruiker die je wilt uitdagen')
                .setRequired(true)
        ),
    async execute(interaction) {
        const challenger = interaction.user;
        const opponent = interaction.options.getUser('gebruiker');

        // Controleer of de tegenstander is getagd
        if (!opponent) {
            await interaction.reply('Je moet een tegenstander taggen om uit te dagen!');
            return;
        }

        try {
            // Haal de inventaris van de spelers op uit de database
            const challengerProfile = await profileModel.findOne({ userId: challenger.id });
            const opponentProfile = await profileModel.findOne({ userId: opponent.id });

            // Maak een lijst van kaarten voor het kaartselectie menu
            const challengerCardOptions = challengerProfile ? getCardOptions(challengerProfile.cardInventory) : [];
            const opponentCardOptions = opponentProfile ? getCardOptions(opponentProfile.cardInventory) : [];

            // Kies 5 willekeurige kaarten
            const shuffledOptions = challengerCardOptions.slice(); // Kopieer de array
            shuffledOptions.sort(() => Math.random() - 0.5); // Shuffle de kaarten
            const randomOptions = shuffledOptions.slice(0, 25); // Kies de eerste 25

            // Valideer het aantal opties (moet 25 of minder zijn)
            if (randomOptions.length > 25) {
                console.error('Fout bij het randomiseren van kaarten, er zijn ' + randomOptions.length + ' kaarten geselecteerd.');
                return;
            }

            // Action Row 1 (met selectiemenu)
            const actionRow1 = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('cardSelect')
                        .setPlaceholder('Kies een kaart')
                        .setOptions(randomOptions)
                );

            // Action Row 2 (met knop)
            const actionRow2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('acceptChallenge')
                        .setLabel('✅') // Gebruik een emoji voor de knop
                        .setStyle('Success', 2) // Pas de breedte aan
                );

            // Stuur een bericht met de ping en action row
            const message = await interaction.channel.send({
                content: `**${opponent}**, **${challenger.username}** daagt je uit tot een duel! Klik op de knop "Accepteren" om de uitdaging te accepteren.`,
                components: [actionRow1, actionRow2]
            });

            // Wacht op de interactie
            const filter = i => i.customId === 'acceptChallenge' && i.user.id === opponent.id;
            const selectedButtonInteraction = await message.awaitMessageComponent({ filter, time: 15000 });

            // Verwerk de knopkeuze
            if (selectedButtonInteraction) {
                // De andere speler heeft de uitdaging geaccepteerd
                console.log('De uitdaging is geaccepteerd!');
                // ... (start het spel)
            } else {
                // De andere speler heeft de uitdaging niet geaccepteerd binnen de tijdlimiet
                console.log('De uitdaging is niet geaccepteerd.');
                // ... (behandel de time-out)
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Er is een fout opgetreden bij het ophalen van de profielen.');
        }
    }
};

// Hulpmethode om kaartopties voor het kaartselectie menu te genereren
function getCardOptions(cardInventory) {
    return cardInventory.map(card => ({
        label: `${card.name} (Rarity: ${card.rarity}, Value: ${card.value}, Count: ${card.count})`,
        value: card.name,
    }));
}
