import { readFileSync, writeFile } from 'fs';
import { promises as fs } from "fs"
import { Binary } from "bson";

//**helper functions**

export async function gethtmlFromFile(filepath){

    const html = await fs.readFile(filepath, function (error, html) {
        if (error) {
          throw error;
        }
        return html
    });

    //const fragContent = JSDOM.fragment(html).textContent
    //return fragContent

    return html.toString()
}

export async function getBinaryFromFile(filepath){

    let file_data = null;
    try {
        file_data = readFileSync(filepath);
    } catch (error) {
        console.error('Error reading image file:', error);
    }

    return new Binary(file_data)
}

export async function writehtmlBacktoFile(html, filepath="return.html"){
    console.log("Writing file:", filepath)
    writeFile(filepath, html, err => {
        if (err) {
            console.error(err);
        }
    });
}