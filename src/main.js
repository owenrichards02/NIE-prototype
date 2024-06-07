import { ObjectId } from "bson"
import { document_add, fragment_add_data, documents_searchByTagsList_AND, fragments_search_by_linked_document, document_addTag, document_delete, document_add_autoFrag, fragment_delete, annotation_create, annotation_search_by_linked_fragmentID, getAllAnswersToASpecificQuestion } from "./api.js"
import { getBinaryFromFile, gethtmlFromFile, writehtmlBacktoFile } from "./fileTools.js"

async function main(){
  /*   let filepath = "./resources/htmlExample.html"
    const d_id = await docAdd(filepath)

    //console.log("ID:", id)

    const data = await docRetrieve(d_id)
    console.log("DATA:", (data)) */
    
    // htmlexample ID:665ddaa530da81e06e5c5639
    let docid = new ObjectId('665ddaa530da81e06e5c5639')
    //const f_id = await fragmentAdd_html("<p>test paragraph, this could be an example of a fragment</p>", docid, "Example PDF HTML section", "html")
    //const f_id2 = await fragmentAdd_html("<h1>Test Heading</h1>", docid, "Example 2 of a PDF HTML section", "html")

    const f_id3 = await fragment_add_data(await getBinaryFromFile("./test_img.jpg"), docid, "Example of an image fragment stored as binary data", "image")

    const fragList = await fragments_search_by_linked_document(docid)
    console.log(fragList)
/*     filepath = "./resources/htmlExample.html"
    const send_html = await gethtmlFromFile(filepath)
    const f_id = await fragmentAdd_html(send_html, 'doc1', "Example PDF HTML section", "html")

    const return_frag = await fragmentRetrieve(f_id)
    const return_html = return_frag.html
    writehtmlBacktoFile(return_html, "./resources/return.html") */
    //console.log("HTML:", return_html)
}

//main()


async function queryingMain(){
    //const html = await gethtmlFromFile("./htmlExample.html")

    //let [id, fragIds] = await docAdd_autoFrag("./resources/htmlExample.html")
    //console.log(fragIds)



    /* let [id, fragids] = await document_add_autoFrag("./resources/htmlExample.html")

    const annotationid = await annotation_create("<h1>Breaking News</h1><p>This is an annotation</p>", fragids, "NHS", "Test Annotation")

    const annotations = await annotation_search_by_linked_fragmentID([fragids[0]])

    console.log(annotations) */

   /*  let res = await document_delete(id)

    console.log(res)

    

    console.log(id)
    console.log(fragids)

    const r1 = await document_delete(id)
    console.log(r1)

    for (const fragid of fragids){
        const r2 = await fragment_delete(fragid)
        console.log(r2)
    } */

    /* const id = await document_add("./resources/survey_example.xlsx")

    await document_addTag(id, "Volunteering")
    await document_addTag(id, "NHS")

    const docs = await documents_searchByTagsList_AND(["Volunteering", "NHS", "TEst"])
    console.log(docs)

    await document_addTag(id, "Healthcare")
    await document_addTag(id, "TEst")


    const docs2 = await documents_searchByTagsList_AND(["Volunteering", "NHS", "TEst"])
    console.log(docs2)

    await document_delete(id) */

    //console.log(matches)

    const id = await document_add("./resources/survey_example.xlsx")

    const answers = await getAllAnswersToASpecificQuestion(id, "Q8")

    console.log(answers)
}

queryingMain()