const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');

const OUTPUTFOLDER = './src/filledTemplates/';

async function parseCSV(result){
    result.data.map(element => {
        const output = path.join(OUTPUTFOLDER, element['company'] + ".pdf");
        const doc = new pdfkit();
        doc.pipe(fs.createWriteStream(output));
        doc .fontSize(12)
            .text('test', 100, 100);
        doc.end();
    })

    return result;
}

async function clearTemplates(){
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

module.exports = {parseCSV, clearTemplates};