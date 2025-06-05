const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the currently playing music"),

  async execute(interaction, client) {
    try {
      const member = interaction.member;
      const voiceChannel = member?.voice?.channel;

      if (!voiceChannel) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ Error")
              .setDescription(
                "You must be in a voice channel to use this command!"
              ),
          ],
          ephemeral: true,
        });
      }

      const queue = client.distube.getQueue(interaction.guild);
      if (!queue || !queue.songs || queue.songs.length === 0) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ Error")
              .setDescription("There is no music playing!"),
          ],
          ephemeral: true,
        });
      }

      if (queue.paused) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ Error")
              .setDescription("Music is already paused!"),
          ],
          ephemeral: true,
        });
      }

      client.distube.pause(interaction.guild);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("⏸️ Music Paused")
            .setDescription("Music has been paused!")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.error("Pause command error:", error);

      // Check if we can still respond
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ Error")
              .setDescription("An error occurred while pausing the music."),
          ],
          ephemeral: true,
        });
      } else if (interaction.deferred && !interaction.replied) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("❌ Error")
              .setDescription("An error occurred while pausing the music."),
          ],
        });
      }
    }
  },
};
