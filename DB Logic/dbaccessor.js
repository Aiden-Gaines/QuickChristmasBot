if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const ObjectID = Mongo.ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gyfdt.mongodb.net/ClubhouseBot?retryWrites=true&w=majority`;

function createConnection() {
	return MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => { console.log(err); });
}

function getCollection(client) {
	return client.db('ClubhouseBot').collection('test_collection_2');
}

function createUserQuery(user_id) {
	return { _id: ObjectID('000000' + user_id) };
}

module.exports.queryDB = async (user_id) => {
	// Establish connection to Mongo
	const client = await createConnection();
	// Try to query the database
	try {
		// Get the collection we want, in this case, a test collection
		const collection = getCollection(client);
		// Create the query
		const query = createUserQuery(user_id);
		// Use the query to look through the database and store the result to res
		let res = await collection.findOne(query);
		// If the query does not yield any results, we run this
		if (res === null) {
			// Create a new entry in the DB
			const doc = { _id: ObjectID('000000' + user_id), treats: 0 };
			// Actually add the entry to the DB
			await collection.insertOne(doc);
			res = await collection.findOne(query);
		}
		return res;
	}
	// Log any errors that might happen
	catch (err) {
		console.log(err);
	}
	// We want to make sure the connection is closed, so do this
	finally {
		client.close();
	}
};

module.exports.updateDB = async (user_id, update) => {
	// Establish connection to Mongo
	const client = await createConnection();
	try {
		// Get the collection we want, in this case, a test collection
		const collection = getCollection(client);
		// Create the query
		const query = createUserQuery(user_id);
		// Update the database
		await collection.updateOne(query, { $set: update });
	}
	catch (err) {
		console.log(err);
	}
	finally {
		client.close();
	}
};