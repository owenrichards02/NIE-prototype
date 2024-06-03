import { docAdd, docRetrieve, fragmentAdd_html, fragmentRetrieve } from "./api.js"
import { gethtmlFromFile, writehtmlBacktoFile } from "./fileTools.js"

async function main(){
    let filepath = "./test_img.jpg"
    const d_id = await docAdd(filepath)

    //console.log("ID:", id)

    const bin_data = await docRetrieve(d_id)
    console.log("DATA:", (bin_data))
    

    filepath = "./htmlExample.html"
    const send_html = await gethtmlFromFile(filepath)
    const f_id = await fragmentAdd_html(send_html, 'doc1', "Example PDF HTML section")

    const return_html = await fragmentRetrieve(f_id)
    writehtmlBacktoFile(return_html)
    //console.log("HTML:", return_html)
}

main()