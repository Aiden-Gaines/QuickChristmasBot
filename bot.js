const Discord = require('discord.js');
const Equation = require('equations').default;
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const ObjectID = Mongo.ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gyfdt.mongodb.net/ClubhouseBot?retryWrites=true&w=majority`;

async function increase_counter(user_id) {
	const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => { console.log(err); });
	let counter = 1;
	try {
		const collection = client.db('ClubhouseBot').collection('test_collection');
		const query = { user_id: user_id };
		const res = await collection.findOne(query);
		if (res === null) {
			const doc = { _id: ObjectID(), user_id: user_id, counter: 1 };
			await collection.insertOne(doc);
		}
		else {
			counter = res.counter + 1;
			const doc = { $set: { counter: counter } };
			await collection.updateOne(query, doc);
		}

	}
	catch (err) {
		console.log(err);
	}
	finally {
		client.close();
	}
	return counter;
}

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);
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

			msg.reply(`${toSolve} = ${solved}`);
		}
		catch (err) {
			msg.reply(`Could not solve the equation '${toSolve}'.`);
		}
	}
	const flag_add = '!add';
	if (msg.content.startsWith(flag_add)) {

		const user_id = msg.author.id;
		increase_counter(user_id).then(
			(new_number) => msg.reply(`Daddy you have poked me ${new_number} time(s)`),
			(err) => msg.reply(err));
	}
});