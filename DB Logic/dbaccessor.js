if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gyfdt.mongodb.net/ClubhouseBot?retryWrites=true&w=majority`;

// Retrieve the user data, if it isn't in the collection, create it
async function getOrCreateDocument(collection, query, userID = null) {
	// Use the query to look through the database and store the result to res
	let res = await collection.findOne(query);
	// If the query does not yield any results, we run this
	if (res === null) {
		if (userID != null) {
			// Create a new entry in the DB
			const doc = { _id: userID, entries: 50 };
			// Actually add the entry to the DB
			await collection.insertOne(doc);
			res = await collection.findOne(query);
		}
		else {
			throw new Error('Collection query returned no data.');
		}
	}
	return res;
}

function createConnection() {
	return MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => { console.log(err); });
}

function getCollection(client, collectionString) {
	return client.db('ClubhouseBot').collection(collectionString);
}

function createUserQuery(userID) {
	return { _id: userID };
}

module.exports.collections = {
	christmas: 'christmasCollection',
	testColl: 'test_collection',
};

module.exports.queryDB = async (userID, collectionString) => {
	// Establish connection to Mongo
	const client = await createConnection();
	// Try to query the database
	try {
		// Get the collection we want, in this case, a test collection
		const collection = getCollection(client, collectionString);
		// Create the query
		const query = createUserQuery(userID);
		// Get or create the user file
		return getOrCreateDocument(collection, query, userID);
	}
	// We want to make sure the connection is closed, so do this
	finally {
		client.close();
	}
};

module.exports.readAll = async (collectionString) => {
	// Establish connection to Mongo
	const client = await createConnection();
	try {
		// Get the collection we want
		const collection = getCollection(client, collectionString);
		// Get a cursor that points to every document in the collection
		return await collection.find().toArray();
	}
	finally {
		client.close();
	}
};

module.exports.updateDB = async (userID, collectionString, update) => {
	// Establish connection to Mongo
	const client = await createConnection();
	try {
		// Get the collection we want
		const collection = getCollection(client, collectionString);
		// Create the query
		const query = createUserQuery(userID);
		// Need to ensure the user file exists, this works fine to do that
		await getOrCreateDocument(collection, query, userID);
		// Update the database
		await collection.updateOne(query, update);
	}
	finally {
		client.close();
	}
};