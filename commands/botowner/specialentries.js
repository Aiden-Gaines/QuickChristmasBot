/* eslint-disable indent */
const { Command } = require('discord.js-commando');
const { collections, updateDB } = require('../../DB Logic/dbaccessor');

module.exports = class SpecialEntriesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'specialentries',
			aliases: ['spece', 'se'],
			group: 'botowner',
			memberName: 'specialentries',
			description: 'Give a user entries for a specific event. (Always 100)',
			guildOnly: true,
			ownerOnly: true,
			args: [
				{
					key: 'targetMemberID',
					prompt: 'What is the ID of the person you would like to give entries to?',
					type: 'string',
				},
				{
					key: 'event',
					prompt: 'What event is this for?',
					type: 'string',
				},
			],
		});
	}

	async run(message, { targetMemberID, event }) {
		let update;

		switch(event) {
			case 'mc':
				update = { $inc: { entries: 100, entriesFromMC: 100 } };
				break;
			case 'music':
				update = { $inc: { entries: 100, entriesFromMusic: 100 } };
				break;
			case 'art':
				update = { $inc: { entries: 100, entriesFromArt: 100 } };
				break;
			default:
				throw new Error(`Invalid event passed for ${this.name} command.`);
		}

		await updateDB(targetMemberID, collections.christmas, update);
		return message.say(`Gave 10 entries to ${targetMemberID}`);
	}
};