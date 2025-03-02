import { parse } from "papaparse";

const baseURL = 'http://localhost:3000/templates';

(function() {
    const csvListener = document.getElementById('csv-file');
    const templateListener = document.getElementById('template-file');
    const fillListener = document.getElementById('fill-button');
    const clearListener = document.getElementById('clear-files');
    const inputContainer = document.getElementById('field-container');

    let csvData;

    csvListener.addEventListener('change', function() {
        if (csvListener.files && csvListener.files.length > 0){
            parse(csvListener.files[0], {
                header: true,
                download: true,
                complete: async function(results) {
                    csvData = results;
                    createFieldInputs();
                }
            });
            console.log('csv given')
        }
    });

    templateListener.addEventListener('change', function() {
        if (templateListener.files && templateListener.files.length > 0){
            console.log("template given");
        }
    });

    fillListener.addEventListener('click', function() {
        console.log("Fill button pressed");
        if (csvListener.files && csvListener.files.length > 0 && csvData){
            fillTemplates();
        }
        else{
            console.log("No file given");
        }
    });

    clearListener.addEventListener('click', function() {
        console.log("Clearing template files...");
        clearTemplates();
    });

    function createFieldInputs() {
        console.log("Now Input Template Values");
    }

    async function fillTemplates() {
        // Option for transforming headers into something else might be useful (might not need to map from template to keys)
        await fetch(baseURL + '/csv', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(csvData)
        })
    }

    async function clearTemplates() {
        await fetch(baseURL + '/templates/clear', {
            method: 'POST'
        })
    }
})();