const Discord = require('discord.js');
const Equation = require('equations').default;
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const client = new Discord.Client();

client.on('ready', async () => {
	console.log('Logged in successfully as bot!');
});

client.on('message', (msg) => {
	msg.content = msg.content.trim();
	const flag = '!solve ';
	if (msg.content.startsWith(flag)) {
		const toSolve = msg.content.slice(flag.length, msg.content.length);
		try {
			const solved = Equation.solve(toSolve);
			msg.reply(`${toSolve} = ${solved} DB`);
		}
		catch (err) {
			msg.reply(`Could not solve the equation '${toSolve}'.`);
		}
	}
});

client.login(process.env.BOT_TOKEN);