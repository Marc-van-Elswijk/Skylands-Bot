module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        setInterval(client.pickPresence, 900 * 1000);
        console.log(`${client.user.tag} has logged into Discord!`);
    }
}