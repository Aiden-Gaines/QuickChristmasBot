const { Command } = require('discord.js-commando');
const { collections, updateDB } = require('../../DB Logic/dbaccessor');

module.exports = class GiveEntriesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'giveentries',
			aliases: ['givee', 'ge'],
			group: 'botowner',
			memberName: 'giveentries',
			description: 'Give a user more entries.',
			guildOnly: true,
			ownerOnly: true,
			args: [
				{
					key: 'targetMember',
					prompt: 'Who would you like to give the entries to?',
					type: 'member',
				},
				{
					key: 'amount',
					prompt: 'How many entries would you like to give?',
					type: 'integer',
				},
			],
		});
	}

	async run(message, { targetMember, amount }) {
		const update = { $inc: { entries: amount * 10 } };
		await updateDB(targetMember.id, collections.christmas, update);
		return message.say(`${targetMember.displayName}, you have been given ${amount} more entries!`);
	}
};