const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync(`./src/commands`);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`Command: ${command.data.name} has been passed to handler`);
      }
    }

    const clientId = process.env.clientId;
    const rest = new REST({ version: "9" }).setToken(process.env.token);

    try {
      console.log("Started refreshing GLOBAL application (/) commands");
      console.log(
        "Note: Global commands may take up to 1 hour to update across all servers"
      );

      // Register commands globally - works on all servers where bot is invited
      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });

      console.log("Successfully registered GLOBAL application (/) commands.");
      console.log(
        "Commands will work on ALL servers where the bot is invited!"
      );
    } catch (error) {
      console.error("Error registering commands:", error);
    }
  };
};
