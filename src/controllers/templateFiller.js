const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');

const OUTPUTFOLDER = './src/filledTemplates/';

let template = '';
let valueMap = {};
let valueRegex = /'/;

async function fillTemplates(result) {
    let csvData = result.csvData.data;
    let templateInfo = result.templateInfo;
    setValueMap(templateInfo);
    valueRegex = createRegex();
    csvData.map(element => {
        const output = path.join(OUTPUTFOLDER, element['company'] + ".pdf");
        const doc = new pdfkit();
        doc.pipe(fs.createWriteStream(output));
        doc .fontSize(12)
            .text(findReplace(template, element), 100, 100);
        doc.end();
    })

    valueMap = {};
    template = '';
    valueRegex = /'/;

    return result;
}

function findReplace(template, data) {
    const newTemplate = template.replaceAll(/\[(.*?)\]/gm, (brackets) => {
        return brackets.replaceAll(valueRegex, (matched) => {
            lookupValue = valueMap[matched.replaceAll(/\[|\]/g, "")]
            return data[lookupValue] != undefined ? data[lookupValue] : lookupValue; // This could mean that the user created custom replace values
        })
    });
    return newTemplate;
}

function setValueMap(templateInfo) {
    for (const entry in templateInfo){
        if (templateInfo[entry]){
            valueMap[templateInfo[entry]] = entry;
        }
    }
}

function createRegex() {
    return RegExp(("\\[*" + Object.keys(valueMap).join("\\]*|\\[*") + "\\]*"),"g");
}

function setTemplate(newTemplate) {
    template = newTemplate;
}

async function clearTemplates() {
    return new Promise((resolve, reject) => {
        fs.readdir(OUTPUTFOLDER, (problem, files) => {
            if (problem) {
                if (problem.errno==-4058){
                    fs.mkdir(OUTPUTFOLDER, (err) => {
                        if (err) {
                          console.error('Did not find output directory. Could not create:', err);
                        } else {
                          console.log('Did not find output directory. Created successdully');
                        }
                    });
                }
                reject(problem);
                return;
            }
    
            for (const file of files){
                fs.unlink(path.join(OUTPUTFOLDER, file), (problem) => {
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

// Zip the templates in filledTemplates and send to user (could then clear the filled templates folder - maybe try to find a way to remove the zip file after some time as well)
function zipTemplates() {

}

module.exports = {fillTemplates, clearTemplates, setTemplate, zipTemplates};