const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music from YouTube, Spotify, or SoundCloud")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Song name, YouTube/Spotify/SoundCloud URL, or Spotify playlist link")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      const query = interaction.options.getString("query");
      const member = interaction.member;
      const voiceChannel = member?.voice?.channel;

      if (!voiceChannel) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ Error")
              .setDescription("You must be in a voice channel to play music!"),
          ],
          ephemeral: true,
        });      }
      
      // Determine the type of input for better search messages
      let searchMessage = `Looking for: **${query}**`;
      if (query.includes('spotify.com')) {
        if (query.includes('/playlist/')) {
          searchMessage = `🎵 Loading Spotify playlist...`;
        } else {
          searchMessage = `🎵 Loading Spotify track...`;
        }
      } else if (query.includes('youtube.com') || query.includes('youtu.be')) {
        if (query.includes('/playlist')) {
          searchMessage = `📺 Loading YouTube playlist...`;
        } else {
          searchMessage = `📺 Loading YouTube video...`;
        }
      } else if (query.includes('soundcloud.com')) {
        searchMessage = `🔊 Loading SoundCloud track...`;
      } else {
        searchMessage = `🔍 Searching YouTube for: **${query}**`;
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xffd700)
            .setTitle("🔍 Loading...")
            .setDescription(searchMessage),
        ],
      });

      await client.distube.play(voiceChannel, query, {
        textChannel: interaction.channel,
        member: member,
      });
    } catch (error) {
      console.error("Play command error:", error);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Playback Error")
        .setDescription("Failed to play the song. Please try again.");

      if (interaction.replied) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};
