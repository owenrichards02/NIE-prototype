import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import csvParser from 'csv-parser';
import xlsx from 'xlsx';

import convertSurvey from './surveyConverter.js'

// Initialize a new Command instance
const program = new Command();

// Define command-line arguments and options
program
    .argument('<filename>', 'file to read')
    .option('-t, --type <type>', 'specify the conversion type [survey]')
    .option('-o, --outfile <outfile>', 'specify an output filename [output.html]')
    .parse(process.argv);

// Extract the parsed arguments and options
const options = program.opts();
const filename = program.args[0];
let convType = options.type ?? 'survey';
let outputFilename = options.outfile ?? 'output.html';

// Resolve the full path to the file
const filePath = path.resolve(process.cwd(), filename);

// Infer file type from filename
let fileType = '';
const ext = path.extname(filename).toLowerCase();
if (ext === '.csv') {
    fileType = 'csv';
} else if (ext === '.xlsx') {
    fileType = 'xlsx';
} else {
    console.error("Must use a .csv or .xlsx file as input");
    exit;
}

console.log(`Reading file: ${filename}`);
console.log(`Detected file type: ${fileType}`);

// Function to parse CSV files
function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
}

// Function to parse XLSX files
function parseXLSX(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json(sheet, {});
            resolve(rows);
        } catch (err) {
            reject(err);
        }
    });
}

async function parseFile(fileType, filePath) {
    try {
        let result;
        if (fileType === 'csv') {
            result = await parseCSV(filePath);
        } else if (fileType === 'xlsx') {
            result = await parseXLSX(filePath);
        } else {
            result = await parseText(filePath);
        }
        return result;
    } catch (err) {
        console.error(`Error parsing file: ${err.message}`);
    }
}

// Load the content and parse into rows
let rows = await parseFile(fileType, filePath);

console.log(rows);

let content = '';
switch(convType) {
    case 'survey':
    default:
        content = convertSurvey(rows);

        break;
}

function writeFile(filename, content, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(process.cwd(), filename);

        fs.writeFile(filePath, content, { encoding }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

writeFile(outputFilename, content);