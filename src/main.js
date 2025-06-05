require("dotenv").config();
const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { DisTube } = require("distube");
const { YouTubePlugin } = require("@distube/youtube");
const { SoundCloudPlugin } = require("@distube/soundcloud");
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

// Initialize DisTube with minimal FFmpeg configuration
client.distube = new DisTube(client, {
  ffmpeg: {
    path: ffmpeg,
  },
  plugins: [new YouTubePlugin(), new SoundCloudPlugin()],
});

// DisTube event listeners - MINIMAL VERSION
client.distube
  .on("playSong", (queue, song) => {
    queue.textChannel.send(
      `🎵 Playing **${song.name}** - Requested by ${song.user}`
    );
  })
  .on("addSong", (queue, song) => {
    if (queue.songs.length > 1) {
      queue.textChannel.send(
        `➕ Added **${song.name}** to the queue`
      );
    }
  })
  .on("error", (queue, error) => {
    console.error("DisTube Error:", error);
    if (queue && queue.textChannel) {
      queue.textChannel.send("❌ An error occurred while playing music!");
    }
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
