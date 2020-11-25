const { Command } = require('discord.js-commando');

module.exports = class FmfitbCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fmfitb',
			group: 'base',
			memberName: 'fmfitb',
			description: 'Just stating a simple fact about Fantastic Mr. Fox.',
			hidden: true,
		});
	}

	async run(message) {
		message.say('You are correct!');
	}
};