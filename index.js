// Imports
const { Message } = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
// Load environment variables. Done differently for production (heroku) and local builds
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
	process.env.BOT_TOKEN = process.env.TEST_BOT_TOKEN;
}

// For some reason () => doesnt seem to work here?
// Doing this just makes life easier in the commands, for getting display names.
Message.prototype.authorDisplayName = function() {
	return (this.member === null) ? this.author.username : this.member.displayName;
};

// Create the client object and set bot settings
const client = new CommandoClient({
	commandPrefix: 'b$',
	owner: '227997724618915842',
	messageCacheLifetime: 300,
	messageSweepInterval: 300,
});

// Register all commands and types
client.registry
	.registerDefaultTypes()
	.registerGroups([
		['botowner', 'Commands for the bot owner'],
		['admin', 'Commands for Admins'],
		['mod', 'Commands for Mods'],
		['minimod', 'Commands for Minimods'],
		['mvp', 'Commands for Mvps'],
		['vip', 'Commands for Vips'],
		// ['nitro', 'Commands for Nitro Boosters'], Removed for now because its not in the C# bot and i'm not actually sure if I want to implement this
		['base', 'Commands for everyone'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with rainbows.');
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);