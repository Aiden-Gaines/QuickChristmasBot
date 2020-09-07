const { Command } = require('discord.js-commando');
const { queryDB } = require('../../DB Logic/dbaccessor');

module.exports = class BalanceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'balance',
			aliases: ['bal', 'money', 'bank'],
			group: 'base',
			memberName: 'balance',
			description: 'Check your balance.',
		});
	}

	async run(message) {
		const user = await queryDB(message.author.id);
		return message.say(`You have ${user.treats} treats!`);
	}
};