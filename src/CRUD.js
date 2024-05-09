//CRUD stands for Create, Read, Update, Delete

import { config } from 'dotenv';
config()

const mdb_uri = process.env.LOCAL_URI

import { MongoClient } from 'mongodb';

export async function connectToDB(uri) {
    let mongoClient;
 
    try {
        mongoClient =  new MongoClient(uri) 
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
 
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }

export async function addNewDocument(newdoc) {
    let mongoClient;
    let insertedId;
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('documents');

        const result = await collection.insertOne(newdoc)
        insertedId = result.insertedId;

    } finally {
        await mongoClient.close();
    }
    console.log("document stored:", insertedId)

    return insertedId
}

export async function getDocument(_id) {
    let mongoClient;
    let doc
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('documents');

        doc = await collection.findOne({ _id: _id });
        if (doc) {
            //console.log('Found document:', doc);
        } else {
            console.log('No document found');
        }

    } catch (error) {
        console.error('Could not retrieve document:', error);
   
    }finally { 
        await mongoClient.close();
    }

    return doc

}

