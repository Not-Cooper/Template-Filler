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

module.exports = {parseCSV};