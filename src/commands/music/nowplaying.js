const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Show information about the currently playing song"),
    
  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction.guild);

      if (!queue || !queue.songs || queue.songs.length === 0) {
        return await interaction.reply({
          content: "❌ There is no music currently playing!",
          ephemeral: true,
        });
      }

      const song = queue.songs[0];
      const status = queue.paused ? "⏸️ Paused" : "▶️ Playing";

      await interaction.reply({
        content: `🎵 **Now Playing**\n**${song.name}**\n👤 Requested by: ${song.user}\n⏱️ Duration: ${song.formattedDuration}\n📊 Status: ${status}`,
      });

    } catch (error) {
      console.error("Now playing command error:", error);
      
      const errorMessage = "❌ An error occurred while fetching the current song.";
      
      if (interaction.replied) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  },
};
