const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("gives status"),

  async execute(interaction, client) {
    // Log the interaction and client details for debugging
    console.log("Ping command executed");
    console.log(`Interaction created at: ${interaction.createdTimestamp}`);
    console.log(`Client WS ping: ${client.ws.ping}`);

    const msg = await interaction.deferReply({
      fetchReply: true,
    });

    const apiLatency = client.ws.ping;
    const clientLatency = msg.createdTimestamp - interaction.createdTimestamp;

    // Log the calculated latencies for debugging
    console.log(`API Latency: ${apiLatency}`);
    console.log(`Client Latency: ${clientLatency}`);

    const newMsg = `API Latency: ${apiLatency}ms\nClient Latency: ${clientLatency}ms`;

    await interaction.editReply({
      content: newMsg,
    });
  },
};
