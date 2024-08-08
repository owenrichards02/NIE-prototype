import * as Realm from 'realm-web'

const app_id = import.meta.env.VITE_REALM_APP_KEY
const dbName = import.meta.env.VITE_REALM_DB

const email = import.meta.env.VITE_REALM_EMAIL
const passWd = import.meta.env.VITE_REALM_PASS

async function setUp(){
    const app = new Realm.App({id: app_id})

    const user = await loginEmailPassword(app, email, passWd)

    const mongoCli = app.currentUser.mongoClient("mongodb-atlas");
    return [app, user, mongoCli]
}

async function loginEmailPassword(app, email, password) {
    const credentials = Realm.Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);
    return user;
}


//exports

export async function realm_addNewItem(collectionName, item){
    const [app, user, mongoCli] = await setUp()
    const this_collection = mongoCli.db(dbName).collection(collectionName)

    const result = await this_collection.insertOne(item)
    return result.insertedId
}

export async function realm_updateItem(collectionName, id, newItem){
    const [app, user, mongoCli] = await setUp()
    const this_collection = mongoCli.db(dbName).collection(collectionName)

    const result = await this_collection.updateOne({_id: id}, newItem)
    return result.insertedId
}

export async function realm_deleteFragment(fragId){
    const [app, user, mongoCli] = await setUp()
    const fragCollection = mongoCli.db(dbName).collection('fragments')
    const res = await fragCollection.deleteOne({_id: fragId})
    return res
}

export async function realm_deleteDocument(docId){
    const [app, user, mongoCli] = await setUp()
    const fragCollection = mongoCli.db(dbName).collection('fragments')
    const docCollection = mongoCli.db(dbName).collection('documents')

    const fragRes = await fragCollection.deleteMany({docid: docId})
    console.log(fragRes)
    const docRes = await docCollection.deleteOne({_id: docId})
    return docRes
}

export async function realm_deleteAnnotation(annotationId){
    const [app, user, mongoCli] = await setUp()
    const annotationCollection = mongoCli.db(dbName).collection('annotations')
    const res = await annotationCollection.deleteOne({_id: annotationId})
    return res
}

export async function realm_getItem(collectionName, itemId){
    const [app, user, mongoCli] = await setUp()
    const thisCollection = mongoCli.db(dbName).collection(collectionName)
    const item = await thisCollection.findOne({_id: itemId})
    return item
}

export async function realm_getAllFragments_fromSpecificDoc(docId){
    const [app, user, mongoCli] = await setUp()
    const fragCollection = mongoCli.db(dbName).collection('fragments')
    const frags = await fragCollection.find({docid: docId}).toArray()
    return frags
}

export async function realm_getAllAnnotations_fromSpecificFragment(fragId){
    const [app, user, mongoCli] = await setUp()
    const annotationCollection = mongoCli.db(dbName).collection('annotations')
    const annots = await annotationCollection.find({linkedFragments: { $in : fragId}}).toArray()
    return annots
}

export async function realm_tagItem(collectionName, itemId){
    const [app, user, mongoCli] = await setUp()
    const thisCollection = mongoCli.db(dbName).collection(collectionName)

    const item = await thisCollection.findOne({_id: itemId})
    let tagsList = await item.tags
    tagsList.push(tag)

    const res = await thisCollection.updateOne({_id: itemId},
        {
            $set: {
                tags: tagsList
            }
        }
    )

    return res
}

export async function realm_searchByTagList_OR(collectionName, tagList){
    const [app, user, mongoCli] = await setUp()
    const thisCollection = mongoCli.db(dbName).collection(collectionName)

    const matches = await thisCollection.find({tags: { $in : tagList}}).toArray()
    return matches
}

export async function realm_searchByTagList_AND(collectionName, tagList){
    const [app, user, mongoCli] = await setUp()
    const thisCollection = mongoCli.db(dbName).collection(collectionName)

    const matches = await thisCollection.find({tags: { $all : tagList}}).toArray()
    return matches
}


export async function realm_getAllDocuments(){
    const [app, user, mongoCli] = await setUp()
    const docCollection = mongoCli.db(dbName).collection("documents")

    const matches = await docCollection.find({})
    return matches
}

export async function realm_getAllFragments(){
    const [app, user, mongoCli] = await setUp()
    const fragCollection = mongoCli.db(dbName).collection("fragments")

    const matches = await fragCollection.find({})
    return matches
}

export async function realm_getAllAnnotations(){
    const [app, user, mongoCli] = await setUp()
    const fragCollection = mongoCli.db(dbName).collection("annotations")

    const matches = await fragCollection.find({})
    return matches
}

export async function realm_getAllFloors(){
    const [app, user, mongoCli] = await setUp()
    const fragCollection = mongoCli.db(dbName).collection("virtualFloors")

    const matches = await fragCollection.find({})
    return matches
}


//export {realm_addNewItem}

