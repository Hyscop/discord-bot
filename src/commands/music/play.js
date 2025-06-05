const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music from YouTube or SoundCloud")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Song name, URL, or search query")
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
        });
      }
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xffd700)
            .setTitle("🔍 Searching...")
            .setDescription(`Looking for: **${query}**`),
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
