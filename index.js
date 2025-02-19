// Imports
const pdfkit = require('pdfkit');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');

// File IO and Template Constants
const OUTPUTFOLDER = './resources/cover_letters/';
const INPUTFILE = './resources/Revify-Sample-Leads.csv';
const TEMPLATEFILE = './resources/template.txt';
const TEMPLATE = getTemplate();

// Mapping Constants
const VALUE_MAP = {'Company Name': 'company', 'Address': 'address', 'City': 'city', 'State': 'state', 'Zip': 'zip', 'Name': 'first_name', 'Your Name': 'Zach'}
const VALUE_REGEX = RegExp(("\\[*" + Object.keys(VALUE_MAP).join("\\]*|\\[*") + "\\]*"),"g");

// Gets the text for the template from given text file
function getTemplate()
{
    return new Promise((resolve) => {
        let templateText = "";
        fs.createReadStream(TEMPLATEFILE)
            .on('data', (chunk) => {
                templateText += chunk;
            })
            .on('end', () => {
                resolve(templateText);
            })
    })
}

// Uses regex to create a new template string with imported data (sidenote: could change the values in the map to be a list of csv header values and loop through each value in data appending them how the user would like ie [first_name, last_name] for Name instead of just first_name. delimeter would need to be defined elsewhere)
async function fillTemplate(data)
{
    const template = await TEMPLATE;

    const newTemplate = template.replaceAll(/\[(.*?)\]/gm, (brackets) => {
        return brackets.replaceAll(VALUE_REGEX, (matched) => {
            lookupValue = VALUE_MAP[matched.replaceAll(/\[|\]/g, "")] 
            return data[lookupValue] != undefined ? data[lookupValue] : "Zach";
        })
    });

    return newTemplate;
}

// Creates the cover letter pdf based on the json data passed to it (originates from the csv)
async function makePDF(data)
{
    const doc = new pdfkit();
    const output = path.join(OUTPUTFOLDER, data['company'] + ".pdf");
    doc.pipe(fs.createWriteStream(output));
    doc .fontSize(12) 
        .text(await fillTemplate(data), 100, 100);
    doc.end();
}

// Parses the given csv file and makes a new pdf cover letter for each row
function parseCSVFile(csvFilename)
{
    fs.createReadStream(csvFilename)
        .pipe(csvParser({ separator: ',' }))
        .on('data', (row) => {
            makePDF(row);
        })
        .on('end', () => {
            console.log("end");
        });
}

// Resets the output directory and creates the cover letters from the given data file
async function coverLetters(csvFilename)
{
    try{
        await resetDir(OUTPUTFOLDER);
        parseCSVFile(csvFilename);
    }catch(e){
        console.error(e);
    }
}

function resetDir(directoryName)
{
    return new Promise((resolve, reject) => {
        fs.readdir(directoryName, (problem, files) => {
            if (problem) {
                reject(problem);
                return;
            }
    
            for (const file of files){
                fs.unlink(path.join(directoryName, file), (problem) => {
                    if (problem) {
                        reject(problem);
                        return;
                    }
                });
            }
            resolve();
        });
    });
}


function main()
{
    coverLetters(INPUTFILE);
}
main();