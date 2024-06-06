//CRUD stands for Create, Read, Update, Delete
//deals with the raw mongodb JSON

import { config } from 'dotenv';
config()

const mdb_uri = process.env.DB_CONNECTION

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

export async function crud_addNewItem(collectionName, newdoc) {
    let mongoClient;
    let insertedId;
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(newdoc)
        insertedId = result.insertedId;

    } finally {
        await mongoClient.close();
    }
    console.log("document stored:", insertedId)

    return insertedId
}


export async function crud_deleteFragment(fragment_id) {
    /* 
    * Do we want to delete all relevant annotations aswell?
    * -> Need to decide at a later date
    */
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

        //delete all relevant fragments first
        const f_collection = db.collection('fragments');

        const fragList = await f_collection.find({
            docid: doc_id
        }).toArray()

        //console.log("FRAGLIST:" + fragList)
        //console.log("DOCID: " + doc_id)

        for (const frag of fragList){
            const f_id = frag._id
            result = await f_collection.deleteOne({_id : f_id})
            console.log("fragment auto-deleted through inheritance:", f_id)
        }

        const d_collection = db.collection('documents');

        result = await d_collection.deleteOne({_id : doc_id})

    } finally {
        await mongoClient.close();
    }
    console.log("document deleted:", doc_id)

    return result
}


export async function crud_deleteAnnotation(annotation_id) {
    let mongoClient;
    let result
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('annotations');

        result = await collection.deleteOne({_id : annotation_id})

    } finally {
        await mongoClient.close();
    }
    console.log("annotation deleted:", annotation_id)

    return result
}

export async function crud_getItem(collectionName, _id) {
    let mongoClient;
    let doc
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection(collectionName);

        doc = await collection.findOne({ _id: _id });
        if (doc) {
            //console.log('Found document:', doc);
        } else {
            console.log('No item found');
        }

    } catch (error) {
        console.error('Could not retrieve item:', error);
   
    }finally { 
        await mongoClient.close();
    }

    return doc

}


export async function crud_getAllFragments_fromSpecificDoc(doc_id){
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

export async function crud_getAllAnnotations_fromSpecificFragment(fragment_id){
    /* 
    * Need to implement this. Would be useful for constructing the annotation board.
    */

    let mongoClient;
    let annotations
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection_a = db.collection('annotations');

        annotations = await collection_a.find({linkedFragments: { $in : fragment_id}}).toArray()

    } catch (error) {
        console.error('Could not find the relevant frags:', error);
        return []
   
    }finally { 
        await mongoClient.close();
    }

    return annotations
}


export async function crud_TagItem(collectionName, itemid, tag){
    let mongoClient;
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection(collectionName);

        const item = await collection.findOne({_id: itemid})
        let tagsList = await item.tags
        tagsList.push(tag)

        await collection.updateOne({_id: itemid},
            {
                $set: {
                    tags: tagsList
                }
            }
        )

    } catch (error) {
        console.error('Could not retrieve/update the item:', error);
        return -1
   
    }finally { 
        await mongoClient.close();
    }

    return 0
}


export async function crud_searchByTagListAND(collectionName, tagList){
    let mongoClient;
    let items
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection(collectionName);


        items = await collection.find({ tags: { $all: tagList } }).toArray()

    } catch (error) {
        console.error('Could not find the item:', error);
        return []
   
    }finally { 
        await mongoClient.close();
    }

    return items
}

export async function crud_searchByTagListOR(collectionName, tagList){
    let mongoClient;
    let items
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection(collectionName);


        items = await collection.find({tags: { $in : tagList}}).toArray()

    } catch (error) {
        console.error('Could not find the item:', error);
        return []
   
    }finally { 
        await mongoClient.close();
    }

    return items
}





async function main(){
    let id = new ObjectId("665ddaa530da81e06e5c5639")
    const frags = await crud_getAllFragments_fromSpecificDoc(id)
    console.log(frags)
}

//main()







