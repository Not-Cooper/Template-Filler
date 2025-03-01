const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');

const OUTPUTFOLDER = '../filledTemplates';

export async function parseCSV(data){
    // const doc = new pdfkit();
    // const output = path.join(OUTPUTFOLDER, data[1][1] + ".pdf");
    // doc.pipe(fs.createWriteStream(output));
    // doc .fontSize(12) 
    //     .text('test', 100, 100);
    // doc.end();

    return data;
}