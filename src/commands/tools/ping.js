const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("gives status"),
  async execute(interaction, client) {
    const msg = await interaction.deferReply({
      fetchReply: true,
    });

    const apiLatency = client.ws.ping;
    const clientLatency = msg.createdTimestamp - interaction.createdTimestamp;

    const newMsg = `API Latency: ${apiLatency}ms\nClient Latency: ${clientLatency}ms`;

    await interaction.editReply({
      content: newMsg,
    });
  },
};
