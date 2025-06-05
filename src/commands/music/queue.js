const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the current music queue"),
  async execute(interaction, client) {
    try {
      // Defer reply immediately to prevent timeout
      await interaction.deferReply();

      const queue = client.distube.getQueue(interaction.guild);

      if (!queue || !queue.songs || queue.songs.length === 0) {
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ Empty Queue")
              .setDescription("There are no songs in the queue!"),
          ],
        });
      }

      const currentSong = queue.songs[0];
      const upcomingSongs = queue.songs.slice(1, 11); // Show up to 10 upcoming songs

      let description = `**🎵 Now Playing:**\n[${currentSong.name}](${currentSong.url}) - \`${currentSong.formattedDuration}\`\n`;

      if (upcomingSongs.length > 0) {
        description += `\n**📋 Up Next:**\n`;
        upcomingSongs.forEach((song, index) => {
          description += `\`${index + 1}.\` [${song.name}](${song.url}) - \`${
            song.formattedDuration
          }\`\n`;
        });

        if (queue.songs.length > 11) {
          description += `\n*...and ${queue.songs.length - 11} more songs*`;
        }
      }

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("📋 Music Queue")
        .setDescription(description)
        .addFields(
          {
            name: "🎵 Total Songs",
            value: `${queue.songs.length}`,
            inline: true,
          },
          {
            name: "⏱️ Queue Duration",
            value: queue.formattedDuration,
            inline: true,
          },
          { name: "🔊 Volume", value: `${queue.volume}%`, inline: true }
        )
        .setThumbnail(currentSong.thumbnail)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Queue command error:", error);

      // Check if we can still respond
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ Error")
              .setDescription("An error occurred while fetching the queue."),
          ],
          ephemeral: true,
        });
      } else if (interaction.deferred && !interaction.replied) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ Error")
              .setDescription("An error occurred while fetching the queue."),
          ],
        });
      }
    }
  },
};
