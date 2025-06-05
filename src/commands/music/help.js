const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all available music commands"),

  async execute(interaction, client) {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("🎵 HyBot Music Commands")
        .setDescription("Here are all the available music commands:")
        .addFields(
          {
            name: "🎵 Basic Controls",
            value:
              "`/play` - Play music from YouTube, Spotify, or SoundCloud\n" +
              "`/pause` - Pause the current song\n" +
              "`/resume` - Resume paused music\n" +
              "`/skip` - Skip the current song\n" +
              "`/stop` - Stop music and clear queue",
            inline: false,
          },
          {
            name: "📋 Queue Management",
            value:
              "`/queue` - Show the current music queue\n" +
              "`/nowplaying` - Show current song info\n" +
              "`/loop` - Set loop mode (song/queue/off)",
            inline: false,
          },
          {
            name: "🎵 Supported Platforms",
            value:
              "**YouTube** - Songs, playlists, and search\n" +
              "**Spotify** - Songs and playlist links\n" +
              "**SoundCloud** - Songs and playlists",
            inline: false,
          },
          {
            name: "📝 Usage Examples",
            value:
              "`/play Never Gonna Give You Up` - Search YouTube\n" +
              "`/play https://open.spotify.com/track/...` - Spotify song\n" +
              "`/play https://open.spotify.com/playlist/...` - Spotify playlist\n" +
              "`/loop song 5` - Loop current song 5 times",
            inline: false,
          }
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: "HyBot" });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Help command error:", error);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("An error occurred while showing help.");

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
