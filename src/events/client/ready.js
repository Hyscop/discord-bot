const config = require("../../config/config");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`🎉 Bot Ready! ${client.user.tag} is logged in`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    console.log(`👥 Serving ${client.users.cache.size} users`);

    // DisTube is automatically initialized
    console.log("🎵 DisTube music system ready!");

    // Set bot activity
    client.user.setStatus("online");
    client.user.setActivity(config.activityName, { type: config.activityType });

    console.log(
      "✅ Global commands registered - bot will work on ALL invited servers!"
    );
  },
};
