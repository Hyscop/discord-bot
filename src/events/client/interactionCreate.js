module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    // Debug information
    console.log("=== INTERACTION DEBUG ===");
    console.log("Command:", interaction.commandName);
    console.log("Guild ID:", interaction.guild?.id);
    console.log("Guild Name:", interaction.guild?.name);
    console.log("User:", interaction.user.tag);
    console.log("Channel:", interaction.channel?.name);
    console.log("==========================");

    const { commands } = client;
    const { commandName } = interaction;
    const command = commands.get(commandName);

    if (!command) return;
    try {
      console.log(`Executing command: ${commandName}`);
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);

      // Only try to respond if the interaction hasn't been handled yet
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
        // If interaction is already replied to, don't do anything
      } catch (replyError) {
        console.error("Failed to send error response:", replyError);
      }
    }
  },
};
