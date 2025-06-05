require("dotenv").config();
const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { DisTube } = require("distube");
const { YouTubePlugin } = require("@distube/youtube");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");
const ffmpeg = require("ffmpeg-static");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});
client.commands = new Collection();
client.commandArray = [];

client.loopCounts = new Map();

client.distube = new DisTube(client, {
  ffmpeg: {
    path: ffmpeg,
  },
  plugins: [
    new YouTubePlugin(), 
    new SoundCloudPlugin(),
    new SpotifyPlugin()
  ],
});

const { EmbedBuilder } = require("discord.js");

client.distube
  .on("playSong", (queue, song) => {
    let loopStatus = "❌ Off";
    if (queue.repeatMode === 1) loopStatus = "🔁 Song";
    else if (queue.repeatMode === 2) loopStatus = "🔁 Queue";

    let loopInfo = loopStatus;
    if (
      client.loopCounts &&
      client.loopCounts.has(queue.voiceChannel.guild.id)
    ) {
      const loopData = client.loopCounts.get(queue.voiceChannel.guild.id);
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
          name: "🎤 Artist/Channel",
          value: song.uploader?.name || "Unknown",
          inline: true,
        },
        {
          name: "🔁 Loop Mode",
          value: loopInfo,
          inline: true,
        },
        {
          name: "📋 Queue",
          value: `${queue.songs.length} songs`,
          inline: true,
        }
      )
      .setThumbnail(song.thumbnail)
      .setTimestamp()
      .setFooter({ text: "HyBot" });

    queue.textChannel.send({ embeds: [embed] });

    if (
      client.loopCounts &&
      client.loopCounts.has(queue.voiceChannel.guild.id)
    ) {
      const loopData = client.loopCounts.get(queue.voiceChannel.guild.id);
      loopData.current++;

      if (loopData.current >= loopData.count) {
        client.distube.setRepeatMode(queue, 0);
        client.loopCounts.delete(queue.voiceChannel.guild.id);

        setTimeout(() => {
          const endEmbed = new EmbedBuilder()
            .setColor(0xffd700)
            .setTitle("🔁 Loop Completed")
            .setDescription(
              `Loop limit of **${loopData.count}** reached. Loop mode disabled.`
            );
          queue.textChannel.send({ embeds: [endEmbed] });
        }, 1000);
      }
    }
  })
  .on("addSong", (queue, song) => {
    if (queue.songs.length > 1) {
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("➕ Added to Queue")
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
            name: "📋 Position",
            value: `${queue.songs.length} in queue`,
            inline: true,
          }
        )
        .setThumbnail(song.thumbnail)
        .setTimestamp();

      queue.textChannel.send({ embeds: [embed] });
    }
  })  .on("error", (queue, error) => {
    console.error("DisTube Error:", error);
    if (queue && queue.textChannel) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Music Error")
        .setDescription("An error occurred while playing music!");

      queue.textChannel.send({ embeds: [errorEmbed] });
    }
  })
  .on("addList", (queue, playlist) => {
    const embed = new EmbedBuilder()
      .setColor(0x1db954) // Spotify green color
      .setTitle("📋 Playlist Added")
      .setDescription(`**${playlist.name}**`)
      .addFields(
        {
          name: "👤 Requested by",
          value: playlist.user.toString(),
          inline: true,
        },
        {
          name: "🎵 Songs",
          value: `${playlist.songs.length} songs`,
          inline: true,
        },
        {
          name: "⏱️ Duration",
          value: playlist.formattedDuration,
          inline: true,
        }
      )
      .setThumbnail(playlist.thumbnail)
      .setTimestamp()
      .setFooter({ text: "HyBot" });

    queue.textChannel.send({ embeds: [embed] });
  });

const functionFolders = fs.readdirSync(`./src/functions`);

for (const folder of functionFolders) {
  const functionFile = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFile)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);
