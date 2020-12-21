// Imports
const path = require('path');
const { Message } = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const { collections, queryDB, updateDB } = require('./DB Logic/dbaccessor');

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

client.on('message', async (message) => {
	// Just ignore bots
	if (message.author.bot) { return; }

	// Query DB for user data
	const userData = await queryDB(message.author.id, collections.christmas);

	// Make sure they are not at the cap, or at 0
	if (userData.entriesFromMsg < 200 || userData.entriesFromMsg == undefined) {
		const update = { $inc: { entries: 1, entriesFromMsg: 1 } };
		await updateDB(message.author.id, collections.christmas, update);
	}

	if (Math.random() <= 0.005) {
		message.say(`${message.authorDisplayName()}, you have said the magic word! A new one has been chosen, and you have been given 1 entry.`);
	}
});

client.login(process.env.BOT_TOKEN);
