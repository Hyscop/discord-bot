require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: "9" }).setToken(process.env.token);
const clientId = process.env.clientId;

async function clearCommands() {
  try {
    await rest.put(Routes.applicationCommands(clientId), { body: [] });
    console.log("✅ Successfully cleared all global commands!");
  } catch (error) {
    console.error("❌ Error clearing commands:", error);
  }
}

clearCommands();
