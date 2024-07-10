module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const { commands } = client;
    const { commandName } = interaction;
    const command = commands.get(commandName);

    if (!command) return;

    try {
      console.log(`Executing command: ${commandName}`);
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      await interaction.reply({
        content: `Something went wrong while executing this command.`,
        ephemeral: true,
      });
    }
  },
};
