if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gyfdt.mongodb.net/ClubhouseBot?retryWrites=true&w=majority`;

// Retrieve the user data, if it isn't in the collection, create it
async function getOrCreateUser(user_id, collection, query) {
	// Use the query to look through the database and store the result to res
	let res = await collection.findOne(query);
	// If the query does not yield any results, we run this
	if (res === null) {
		// Create a new entry in the DB
		const doc = { _id: user_id, treats: 0 };
		// Actually add the entry to the DB
		await collection.insertOne(doc);
		res = await collection.findOne(query);
	}
	return res;
}

function createConnection() {
	return MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => { console.log(err); });
}

function getCollection(client, collectionString) {
	return client.db('ClubhouseBot').collection(collectionString);
}

function createUserQuery(user_id) {
	return { _id: user_id };
}


module.exports.collections = {
	users: 'users',
	test_collection_2: 'test_collection_2',
};

module.exports.queryDB = async (user_id, collectionString) => {
	// Establish connection to Mongo
	const client = await createConnection();
	// Try to query the database
	try {
		// Get the collection we want, in this case, a test collection
		const collection = getCollection(client, collectionString);
		// Create the query
		const query = createUserQuery(user_id);
		// Get or create the user file
		return await getOrCreateUser(user_id, collection, query);
	}
	// We want to make sure the connection is closed, so do this
	finally {
		client.close();
	}
};

module.exports.updateDB = async (user_id, collectionString, update) => {
	// Establish connection to Mongo
	const client = await createConnection();
	try {
		// Get the collection we want, in this case, a test collection
		const collection = getCollection(client, collectionString);
		// Create the query
		const query = createUserQuery(user_id);
		// Need to ensure the user file exists, this works fine to do that
		await getOrCreateUser(user_id, collection, query);
		// Update the database
		await collection.updateOne(query, update);
	}
	finally {
		client.close();
	}
};