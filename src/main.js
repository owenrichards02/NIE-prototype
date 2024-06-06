import { ObjectId } from "bson"
import { deleteDoc, deleteFrag, docAdd, docAdd_autoFrag, docRetrieve, fragmentAdd_data, fragmentAdd_html, fragmentRetrieve, getKnownFragmentsFromDoc, searchByAttributeValue } from "./api.js"
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

    const f_id3 = await fragmentAdd_data(await getBinaryFromFile("./test_img.jpg"), docid, "Example of an image fragment stored as binary data", "image")

    const fragList = await getKnownFragmentsFromDoc(docid)
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



    /* let [id, fragids] = await docAdd_autoFrag("./resources/htmlExample.html")

    let res = await deleteDoc(id)

    console.log(res) */

    

    /* console.log(id)
    console.log(fragIds)

    const r1 = await deleteDoc(id)
    console.log(r1)

    for (const fragid of fragIds){
        const r2 = await deleteFrag(fragid)
        console.log(r2)
    } */

    const id = await docAdd("./resources/survey_example.xlsx")

    const matches = await searchByAttributeValue(id, "data-responseID", "R_3nT6Y0Sm27iTPaF")

    console.log(matches)
}

queryingMain()