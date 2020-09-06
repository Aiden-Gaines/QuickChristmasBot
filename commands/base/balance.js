const { Command } = require('discord.js-commando');

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'balance',
			aliases: ['bal', 'money', 'bank'],
			group: 'base',
			memberName: 'balance',
			description: 'Check your balance.',
		});
	}

	run(message) {
		return message.say('I don\'t fucking know!');
	}
};