const { Command } = require('discord.js-commando');
const { collections, queryDB } = require('../../DB Logic/dbaccessor');

module.exports = class EntriesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'entries',
			aliases: ['e', 'ent'],
			group: 'base',
			memberName: 'entries',
			description: 'Check how many entries into the Role Giveaway you have.',
		});
	}

	async run(message) {
		const user = await queryDB(message.author.id, collections.christmas);
		return message.say(`${message.authorDisplayName()}, you have ${Math.round(user.entries / 10)} entries!`);
	}
};