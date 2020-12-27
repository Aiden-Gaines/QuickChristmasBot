const { Command } = require('discord.js-commando');
const { collections, readAll } = require('../../DB Logic/dbaccessor');

module.exports = class PickWinnerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pickwinner',
			aliases: ['pw'],
			group: 'botowner',
			memberName: 'pickwinner',
			description: 'Pick a winner for the competition!',
			guildOnly: true,
			ownerOnly: true,
		});
	}

	async run(message) {
		console.log(message);
		const documents = await readAll(collections.christmas);
		const pool = [];

		documents.forEach(document => {
			for (let i = 0; i < (Math.round(document.entries / 10)); i++) {
				pool.splice(Math.round(pool.length * Math.random()), 0, document._id);
			}
		});

		console.log(pool.length);
		console.log(pool[Math.round((pool.length - 1) * Math.random())]);
	}
};