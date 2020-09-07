const { Command } = require('discord.js-commando');
const { queryDB, updateDB } = require('../../DB Logic/dbaccessor');

module.exports = class GiveTreatsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'givetreats',
			aliases: ['givemoney'],
			group: 'botowner',
			memberName: 'givetreats',
			description: 'Give a user treats.',
		});
	}

	async run(message) {
		const userID = message.author.id;
		const user = await queryDB(userID);
		const update = { treats: user.treats + 1 };
		await updateDB(userID, update);
		return message.say('You have been given 1 treat.');
	}
};