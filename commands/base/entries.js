const { Command } = require('discord.js-commando');
const { collections, queryDB } = require('../../DB Logic/dbaccessor');

const entryReception = {
	'Msg': ['Sending messages', 20],
	'Drops': ['Santa drop(ings)', 15],
	'MC': ['Minecraft event', 10],
	'Music': ['Music quiz', 10],
	'Art': ['Art contest entry', 10],
};

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
		const now = Date.now();
		const user = await queryDB(message.author.id, collections.christmas);
		const embed = {
			'title': `You have ${Math.round(user.entries / 10)} entries!`,
			'description': 'Below is a breakdown of where all of your entries have come from.',
			'color': 10724259,
			'timestamp': new Date(),
			'author': {
				'name': message.authorDisplayName(),
				'icon_url': message.author.displayAvatarURL(),
			},
			'fields': [{
				'name': 'Beginning amount:',
				'value': '**5** (maxed)',
			}],
		};

		// eslint-disable-next-line prefer-const
		for (let [sourceName, sourceValue] of Object.entries(user).filter(entry => entry[0].startsWith('entriesFrom'))) {
			const newEntryRec = entryReception[sourceName.slice(11)];
			sourceValue = Math.round(sourceValue / 10);

			embed.fields.push({
				'name': newEntryRec[0] + ':',
				'value': (sourceValue == newEntryRec[1]) ? `**${sourceValue}** (maxed)` : sourceValue,
			});
		}

		embed.footer = { 'text': `Generated in ${Date.now() - now} ms` };

		// This is a dumb way to do this
		return message.embed(embed);
	}
};