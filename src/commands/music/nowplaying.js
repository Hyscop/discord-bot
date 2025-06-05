const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Show information about the currently playing song"),

  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction.guild);

      if (!queue || !queue.songs || queue.songs.length === 0) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ No Music Playing")
              .setDescription("There is no music currently playing!"),
          ],
          ephemeral: true,
        });
      }
      const song = queue.songs[0];
      const status = queue.paused ? "⏸️ Paused" : "▶️ Playing";

      let loopStatus = "❌ Off";
      if (queue.repeatMode === 1) loopStatus = "🔁 Song";
      else if (queue.repeatMode === 2) loopStatus = "🔁 Queue";

      let loopInfo = loopStatus;
      if (client.loopCounts && client.loopCounts.has(interaction.guild.id)) {
        const loopData = client.loopCounts.get(interaction.guild.id);
        loopInfo += ` (${loopData.current}/${loopData.count})`;
      }

      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("🎵 Now Playing")
        .setDescription(`**[${song.name}](${song.url})**`)
        .addFields(
          {
            name: "👤 Requested by",
            value: song.user.toString(),
            inline: true,
          },
          {
            name: "⏱️ Duration",
            value: song.formattedDuration,
            inline: true,
          },
          {
            name: "🔊 Volume",
            value: `${queue.volume}%`,
            inline: true,
          },
          {
            name: "📊 Status",
            value: status,
            inline: true,
          },
          {
            name: "🔁 Loop Mode",
            value: loopInfo,
            inline: true,
          },
          {
            name: "🎤 Artist/Channel",
            value: song.uploader?.name || "Unknown",
            inline: true,
          },
          {
            name: "📋 Queue Position",
            value: `1 of ${queue.songs.length}`,
            inline: true,
          }
        )
        .setThumbnail(song.thumbnail)
        .setTimestamp()
        .setFooter({ text: "HyBot" });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Now playing command error:", error);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("An error occurred while fetching the current song.");

      if (interaction.replied) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};
