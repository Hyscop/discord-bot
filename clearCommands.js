require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: "9" }).setToken(process.env.token);
const clientId = process.env.clientId;

async function clearCommands() {
  try {
    console.log("🗑️ Clearing all existing global commands...");

    // Clear all global commands
    await rest.put(Routes.applicationCommands(clientId), { body: [] });

    console.log("✅ Successfully cleared all global commands!");
    console.log("🔄 Now restart the bot to register fresh commands.");
  } catch (error) {
    console.error("❌ Error clearing commands:", error);
  }
}

clearCommands();
