const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Set loop mode for music playback")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Loop mode to set")
        .setRequired(true)
        .addChoices(
          { name: "🔁 Song - Loop current song", value: "song" },
          { name: "🔁 Queue - Loop entire queue", value: "queue" },
          { name: "❌ Off - Disable loop", value: "off" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription(
          "Number of times to loop (1-100, leave empty for infinite)"
        )
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(false)
    ),

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

      const mode = interaction.options.getString("mode");
      const count = interaction.options.getInteger("count");

      let repeatMode;
      let description;
      let emoji;

      switch (mode) {
        case "song":
          repeatMode = 1; // DisTube: 1 = repeat song
          emoji = "🔁";
          if (count) {
            description = `Current song will loop **${count} times**`;
            // We implement count-based looping with event tracking
          } else {
            description = "Current song will loop **infinitely**";
          }
          break;

        case "queue":
          repeatMode = 2; // DisTube: 2 = repeat queue
          emoji = "🔁";
          if (count) {
            description = `Queue will loop **${count} times**`;
          } else {
            description = "Queue will loop **infinitely**";
          }
          break;

        case "off":
          repeatMode = 0; // DisTube: 0 = no repeat
          emoji = "❌";
          description = "Loop mode **disabled**";
          break;
      }
      await client.distube.setRepeatMode(queue, repeatMode);

      if (count && mode !== "off") {
        if (!client.loopCounts) client.loopCounts = new Map();
        client.loopCounts.set(interaction.guild.id, {
          mode: mode,
          count: count,
          current: 0,
        });
      } else {
        if (client.loopCounts) {
          client.loopCounts.delete(interaction.guild.id);
        }
      }

      const currentSong = queue.songs[0];

      const embed = new EmbedBuilder()
        .setColor(mode === "off" ? 0xff6b6b : 0x00ff00)
        .setTitle(`${emoji} Loop Mode Updated`)
        .setDescription(description)
        .addFields(
          {
            name: "🎵 Current Song",
            value: `[${currentSong.name}](${currentSong.url})`,
            inline: true,
          },
          {
            name: "📋 Queue Length",
            value: `${queue.songs.length} songs`,
            inline: true,
          },
          {
            name: "🔊 Volume",
            value: `${queue.volume}%`,
            inline: true,
          }
        )
        .setThumbnail(currentSong.thumbnail)
        .setTimestamp()
        .setFooter({ text: "HyBot" });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Loop command error:", error);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Loop Error")
        .setDescription("Failed to set loop mode. Please try again.");

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
