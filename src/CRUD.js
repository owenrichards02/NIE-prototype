//CRUD stands for Create, Read, Update, Delete
//deals with the raw mongodb JSON

import { config } from 'dotenv';
config()

const mdb_uri = process.env.LOCAL_URI

import { MongoClient, ObjectId } from 'mongodb';

async function connectToDB(uri) {
    let mongoClient;
 
    try {
        mongoClient =  new MongoClient(uri) 
        //console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        //console.log('Successfully connected to MongoDB Atlas!');
 
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }

export async function crud_addNewDocument(newdoc) {
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

export async function crud_addNewFragment(fragment) {
    let mongoClient;
    let insertedId;
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('fragments');

        const result = await collection.insertOne(fragment)
        insertedId = result.insertedId;

    } finally {
        await mongoClient.close();
    }
    console.log("fragment stored:", insertedId)

    return insertedId
}

export async function crud_deleteFragment(fragment_id) {
    let mongoClient;
    let result
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('fragments');

        result = await collection.deleteOne({_id : fragment_id})

    } finally {
        await mongoClient.close();
    }
    console.log("fragment deleted:", fragment_id)

    return result
}

export async function crud_deleteDoc(doc_id) {
    let mongoClient;
    let result
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('documents');

        result = await collection.deleteOne({_id : doc_id})

    } finally {
        await mongoClient.close();
    }
    console.log("document deleted:", doc_id)

    return result
}


export async function crud_getDocument(_id) {
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

export async function crud_getFragment(_id) {
    let mongoClient;
    let doc
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('fragments');

        doc = await collection.findOne({ _id: _id });
        if (doc) {
            //console.log('Found document:', doc);
        } else {
            console.log('No fragment found');
        }

    } catch (error) {
        console.error('Could not retrieve fragment:', error);
   
    }finally { 
        await mongoClient.close();
    }

    return doc

}

export async function crud_getAllFragments(doc_id){
    let mongoClient;
    let fragList
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('fragments');

        fragList = await collection.find({
            docid: doc_id
        }).toArray()

    } catch (error) {
        console.error('Could not retrieve any fragment:', error);
   
    }finally { 
        await mongoClient.close();
    }

    return fragList
}

async function main(){
    let id = new ObjectId("665ddaa530da81e06e5c5639")
    const frags = await crud_getAllFragments(id)
    console.log(frags)
}

//main()







