const { SlashCommandBuilder } = require("discord.js");

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
          content: "❌ You must be in a voice channel to play music!",
          ephemeral: true,
        });
      }

      await interaction.reply(`🔍 Searching for: **${query}**`);

      // Simple DisTube play
      await client.distube.play(voiceChannel, query, {
        textChannel: interaction.channel,
        member: member,
      });

    } catch (error) {
      console.error("Play command error:", error);
      
      const errorMessage = "❌ Failed to play the song. Please try again.";
      
      if (interaction.replied) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  },
};
