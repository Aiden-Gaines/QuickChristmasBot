// Imports
const path = require('path');
const { CommandoClient, CommandoMessage } = require('discord.js-commando');
const { collections, queryDB, updateDB } = require('./DB Logic/dbaccessor');

// Load environment variables. Done differently for production (heroku) and local builds
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// Doing this just makes life easier in the commands, for getting display names.
CommandoMessage.prototype.authorDisplayName = function() {
	return (this.member === null) ? this.author.username : this.member.displayName;
};

// Create the client object and set bot settings
const client = new CommandoClient({
	commandPrefix: 'WS',
	owner: '227997724618915842',
	messageCacheLifetime: 300,
	messageSweepInterval: 300,
});
const guildID = '506989850117799946';
const sfwGenID = '506989850117799948';
const nsfwGenID = '607894526383620107';
const spamChanID = '688191579676213344';
// Don't forget about the ones in entries.js
const talkingEntryCap = 200;
const santaDropEntryCap = 150;

// Test channels
// const guildID = '488896298657775618	';
// const sfwGenID = '496444873558327308';
// const nsfwGenID = '496445485251428384';
// const spamChanID = '708618292486471761';

client.setInterval(async () => {
	// Only do this 60% of the time
	if (Math.random() > 0.3) {
		// Get the guild object fresh from discord (or the cache)
		const guildObj = await client.guilds.fetch(guildID);

		// Make sure the guild is actually availible to us right now
		if (guildObj.available) {
			// Create an empty set of winners to populate later
			const winners = new Set();
			// Get both the channels
			const sfwGenObj = await guildObj.channels.cache.get(sfwGenID);
			const nsfwGenObj = await guildObj.channels.cache.get(nsfwGenID);
			// Complicated math to choose how many people get the reward, equal to Min(Floor(10 * (x - 0.35) ^ 2) + 4, 8)
			const amount = Math.min(Math.floor(10 * Math.pow((Math.random() - 0.35), 2)) + 4, 8);
			// Fetch the amount of messages we need
			const sfwGenMessages = await sfwGenObj.messages.fetch({ limit: amount });
			const nsfwGenMessages = await nsfwGenObj.messages.fetch({ limit: amount });
			// Create the function to check if the message should get a prize
			const winnerCheck = (msg) => {
				// Ignore bots and messages that are older than 2 minutes
				if (msg.author.bot || msg.createdAt.getTime() <= Date.now() - 120000) { return; }

				winners.add(msg.author.id);
			};

			// Use the winner check function to populate the winners set
			sfwGenMessages.forEach(winnerCheck);
			nsfwGenMessages.forEach(winnerCheck);

			if (winners.size > 0) {
				// Give each winner their reward
				winners.forEach(async (userID) => {
					// Query DB for user data
					const userData = await queryDB(userID, collections.christmas);

					// Make sure they are not at the cap, or at 0
					if (userData.entriesFromDrops < santaDropEntryCap || userData.entriesFromDrops == undefined) {
						const update = { $inc: { entries: 10, entriesFromDrops: 10 } };
						await updateDB(userID, collections.christmas, update);
					}
				});

				sfwGenObj.send(`*BORK BORK BORK* I have dropped presents (entries) to the \`${Math.min(winners.size, amount)}\` most recent chatters in sfw and nsfw general!`);
			}
		}
	}
}, 600000);
// 500000

client.once('ready', () => {
	// Log that we have logged in
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	// Give us a status.
	client.user.setActivity('with reindeer.');
});

client.on('error', console.error);

client.on('message', async (message) => {
	// Just ignore bots and messages sent in the spam channel
	if (message.author.bot || message.channel.id == spamChanID) { return; }

	// Query DB for user data
	const userData = await queryDB(message.author.id, collections.christmas);

	// Make sure they are not at the cap, or at 0
	if (userData.entriesFromMsg < talkingEntryCap || userData.entriesFromMsg == undefined) {
		const update = { $inc: { entries: 1, entriesFromMsg: 1 } };
		await updateDB(message.author.id, collections.christmas, update);
	}

	if (Math.random() <= 0.005) {
		message.say(`${message.authorDisplayName()}, you have said the magic word! A new one has been chosen, and you have been given ||0|| entries.`);
	}
});

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
