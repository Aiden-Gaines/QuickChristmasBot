const { Command } = require('discord.js-commando');
const { collections, updateDB } = require('../../DB Logic/dbaccessor');

module.exports = class GiveTreatsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'givetreats',
			aliases: ['givemoney'],
			group: 'botowner',
			memberName: 'givetreats',
			description: 'Give a user treats.',
			args: [
				{
					key: 'member',
					prompt: 'Who would you like to give the treats to?',
					type: 'member',
				},
				{
					key: 'amount',
					prompt: 'How many treats would you like to give?',
					type: 'integer',
				},
			],
		});
	}

	async run(message, { member, amount }) {
		const userID = member.id;
		const update = { $inc: { treats: amount } };
		await updateDB(userID, collections.users, update);
		return message.say(`${member.displayName}, you have been given ${amount} treats.`);
	}
};