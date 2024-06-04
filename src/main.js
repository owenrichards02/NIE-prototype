import { ObjectId } from "bson"
import { docAdd, docAdd_autoTextFrag, docRetrieve, fragmentAdd_data, fragmentAdd_html, fragmentRetrieve, getKnownFragmentsFromDoc } from "./api.js"
import { getBinaryFromFile, gethtmlFromFile, writehtmlBacktoFile } from "./fileTools.js"
import { extractElementsContainingText } from "./htmlTools.js"

async function main(){
  /*   let filepath = "./htmlExample.html"
    const d_id = await docAdd(filepath)

    //console.log("ID:", id)

    const data = await docRetrieve(d_id)
    console.log("DATA:", (data)) */
    
    // htmlexample ID:665ddaa530da81e06e5c5639
    let docid = new ObjectId('665ddaa530da81e06e5c5639')
    //const f_id = await fragmentAdd_html("<p>test paragraph, this could be an example of a fragment</p>", docid, "Example PDF HTML section")
    //const f_id2 = await fragmentAdd_html("<h1>Test Heading</h1>", docid, "Example 2 of a PDF HTML section")

    const f_id3 = await fragmentAdd_data(await getBinaryFromFile("./test_img.jpg"), docid, "Example of an image fragment stored as binary data")

    const fragList = await getKnownFragmentsFromDoc(docid)
    console.log(fragList)
/*     filepath = "./htmlExample.html"
    const send_html = await gethtmlFromFile(filepath)
    const f_id = await fragmentAdd_html(send_html, 'doc1', "Example PDF HTML section")

    const return_html = await fragmentRetrieve(f_id)
    writehtmlBacktoFile(return_html) */
    //console.log("HTML:", return_html)
}

//main()


async function queryingMain(){
    //const html = await gethtmlFromFile("./htmlExample.html")

    let id, fragIds = await docAdd_autoTextFrag("./htmlExample.html")

    console.log(id)
    console.log(fragIds)
}

queryingMain()