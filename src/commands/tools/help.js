const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'help',
        description: 'Toont beschikbare opties voor hulp.'
    },
    async execute(interaction, client) {

        let message;

        const options = [
            {
                label: 'Commands',
                value: 'optie_1'
            },
            {
                label: 'Asking questions, Report Crashes and/or Bugs',
                value: 'optie_2'
            }
        ];

        const selectMenu = {
            type: 3, // SELECT_MENU
            custom_id: 'help_menu',
            placeholder: 'Kies een optie',
            options: options
        };

        // Defer het antwoord op de interactie
        await interaction.deferReply({ ephemeral: true });

        message = await interaction.followUp({
            content: 'Kies een optie:',
            components: [
                {
                    type: 1, // ACTION_ROW
                    components: [selectMenu]
                }
            ]
        });

        const filter = i => i.customId === 'help_menu';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async collectedInteraction => {
            let responseMessage;
            if (collectedInteraction.values[0] === 'optie_1') {

                const commandEmbed = new EmbedBuilder()
                    .setTitle(`Command List`)
                    .setDescription(`This is a list of all the commands in this bot`)
                    .addFields(
                        { name: `/help`, value: `With this command you got this list, but besides that you can also get help with reporting Bugs and/or Crashes`, inline: true },
                        { name: `/sky pull`, value: `It will give you a skycard every single minute. Down from common all the way to Elite`, inline: true },
                        { name: `/sky trade`, value: `With this command you can trade your cards with another user for other cards or coins **COMMING SOON**`, inline: true},
                        { name: `/sky sell`, value: `This is a way to sell your (double) cards or your whole inventory. That's what you choose **COMMING SOON**`, inline: true},
                        { name: `/balance`, value: `It will show you how many Skycoins you have`, inline: true },
                        { name: `/daily`, value: `It will give you a daily reward of Skycoins`, inline: true },
                        { name: `/inventory`, value: `It will show you your inventory of Skycards`, inline: true },
                        { name: `/update`, value: `It will show you a text message with the newest bot updates`, inline: true }
                    )

                responseMessage = { embeds: [commandEmbed] };
            } else if (collectedInteraction.values[0] === 'optie_2') {
                responseMessage = 'you can send an Email for Questions, Crashes and Bugs to: SkycardsHelpdesk@outlook.com.\nYou can also ask questions in my discord dm: marcerso (Im not gonna answer crashes and/or bugs in my dm)';
            }

            // Stuur het antwoord naar de DM van de gebruiker
            try {
                // Controleer of de interactie plaatsvindt in een server of in de DM van de bot
                if (interaction.guild) {
                    await collectedInteraction.user.send(responseMessage);
                } else {
                    await collectedInteraction.reply(responseMessage);
                }
            } catch (error) {
                console.error('Kan geen DM sturen naar de gebruiker:', error);
                // Als er een fout optreedt bij het verzenden van het bericht, kun je hier een alternatieve afhandeling toevoegen.
            }
        });

        collector.on('end', async collected => {

            if (collected.size === 0) {
                if (!interaction.deferred && !interaction.replied) {
                    interaction.followUp('Geen keuze gemaakt binnen de tijdslimiet.');
                }
            }
        });
    }
};
