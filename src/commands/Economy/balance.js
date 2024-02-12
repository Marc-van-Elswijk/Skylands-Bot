const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Laat de balans zien van een user')
        .addUserOption(option => option.setName('target').setDescription('Vul een naam in van de Poortmeester wiens balans jij graag wilt zien')),
    async execute(interaction, client) {
        const selectedUser = interaction.options.getUser('target') || interaction.user;
        const storedBalance = await client.getBalance(selectedUser.id);

        if(!storedBalance) return await interaction.reply({
            content: `${selectedUser.tag} heeft geen SkyCoins`,
            ephemeral: true
        });
        else {
            const embed = new EmbedBuilder()
                .setTitle(`${selectedUser.username}'s portomonee:`)
                .setTimestamp()
                .addFields([
                    {
                        name: `$${storedBalance.balance}`,
                        value: `\u200b`
                    }
                ])
                .setFooter({
                    text: client.user.tag,
                    icon: client.user.displayAvatarURL()
                });

            await interaction.reply({
                embeds: [embed]
            });
        }
    }
}