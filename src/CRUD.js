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


export async function crud_addNewAnnotation(annotation){
    let mongoClient;
    let insertedId;
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('annotations');

        const result = await collection.insertOne(annotation)
        insertedId = result.insertedId;

    } finally {
        await mongoClient.close();
    }
    console.log("annotation stored:", insertedId)

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

export async function crud_getAnnotation(_id) {
    let mongoClient;
    let doc
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('annotations');

        doc = await collection.findOne({ _id: _id });
        if (doc) {
            //console.log('Found document:', doc);
        } else {
            console.log('No annotation found');
        }

    } catch (error) {
        console.error('Could not retrieve annotation:', error);
   
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

export async function crud_getAllAnnotations_fromSpecificFragment(doc_id){
    /* 
    * Need to implement this. Would be useful for constructing the annotation board.
    */
}





export async function crud_TagDocument(docid, tag){
    let mongoClient;
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('documents');

        const doc = await collection.findOne({_id: docid})
        let tagsList = await doc.tags
        tagsList.push(tag)

        await collection.updateOne({_id: docid},
            {
                $set: {
                    tags: tagsList
                }
            }
        )

    } catch (error) {
        console.error('Could not retrieve/update the document:', error);
        return -1
   
    }finally { 
        await mongoClient.close();
    }

    return 0
}

export async function crud_TagFragment(fragid, tag){
    let mongoClient;
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('fragments');

        const frag = await collection.findOne({_id: fragid})
        let tagsList = await frag.tags
        tagsList.push(tag)

        await collection.updateOne({_id: fragid},
            {
                $set: {
                    tags: tagsList
                }
            }
        )

    } catch (error) {
        console.error('Could not retrieve/update the document:', error);
        return -1
   
    }finally { 
        await mongoClient.close();
    }

    return 0
}


export async function crud_searchForFragsByTagListOR(tagList){
    let mongoClient;
    let frags
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('fragments');

        frags = await collection.find({tags: { $in : tagList}})

    } catch (error) {
        console.error('Could not find the relevant frags:', error);
        return []
   
    }finally { 
        await mongoClient.close();
    }

    return frags
}

export async function crud_searchForDocsByTagListOR(tagList){
    let mongoClient;
    let docs
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('documents');


        docs = await collection.find({tags: { $in : tagList}}).toArray()

    } catch (error) {
        console.error('Could not find the relevant docs:', error);
        return []
   
    }finally { 
        await mongoClient.close();
    }

    return docs
}

export async function crud_searchForDocsByTagListAND(tagList){
    let mongoClient;
    let docs
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('documents');


        docs = await collection.find({ tags: { $all: tagList } }).toArray()

    } catch (error) {
        console.error('Could not find the relevant docs:', error);
        return []
   
    }finally { 
        await mongoClient.close();
    }

    return docs
}

export async function crud_searchForFragsByTagListAND(tagList){
    let mongoClient;
    let frags
 
    try {
        mongoClient = await connectToDB(mdb_uri)
        const db = mongoClient.db('nie');
        const collection = db.collection('fragments');


        frags = await collection.find({ tags: { $all: tagList } }).toArray()

    } catch (error) {
        console.error('Could not find the relevant frags:', error);
        return []
   
    }finally { 
        await mongoClient.close();
    }

    return frags
}





async function main(){
    let id = new ObjectId("665ddaa530da81e06e5c5639")
    const frags = await crud_getAllFragments_fromSpecificDoc(id)
    console.log(frags)
}

//main()







