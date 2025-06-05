const config = require("../../config/config");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`🎉 Bot Ready! ${client.user.tag} is logged in`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);

    client.user.setStatus("online");
    client.user.setActivity(config.activityName, { type: config.activityType });
  },
};
