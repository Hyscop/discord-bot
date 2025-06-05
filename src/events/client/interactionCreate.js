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
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);

      try {
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: `Something went wrong while executing this command.`,
            ephemeral: true,
          });
        } else if (interaction.deferred && !interaction.replied) {
          await interaction.editReply({
            content: `Something went wrong while executing this command.`,
          });
        }
      } catch (replyError) {
        console.error("Failed to send error response:", replyError);
      }
    }
  },
};
