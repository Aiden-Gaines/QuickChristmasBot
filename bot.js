// Imports
const { Message } = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
// Load environment variables. Done differently for production (heroku) and local builds
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
	// process.env.BOT_TOKEN = process.env.TEST_BOT_TOKEN;
}

// Doing this just makes life easier in the commands, for getting display names.
Message.prototype.authorDisplayName = function() {
	return (this.member === null) ? this.author.username : this.member.displayName;
};

// Create the client object and set bot settings
const client = new CommandoClient({
	commandPrefix: 'WS',
	owner: '227997724618915842',
	messageCacheLifetime: 300,
	messageSweepInterval: 300,
});

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with reindeer.');
});

client.on('error', console.error);

// Register all commands and types
client.registry
	.registerDefaultTypes()
	.registerGroups([
		['botowner', 'Commands for the bot owner'],
		['admin', 'Commands for Admins'],
		['base', 'Commands for everyone'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.BOT_TOKEN);