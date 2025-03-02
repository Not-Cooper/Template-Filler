import { parse } from "papaparse";

const baseURL = 'http://localhost:3000/templates';

(function() {
    var csvListener = document.getElementById('csv-file');
    var templateListener = document.getElementById('template-file');
    var fillListener = document.getElementById('fill-button');
    var clearListener = document.getElementById('clear-files');

    csvListener.addEventListener('change', function() {
        if (csvListener.files && csvListener.files.length > 0){
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
        if (csvListener.files && csvListener.files.length > 0){
            parseCSVFile(csvListener.files[0]);
        }
    });

    clearListener.addEventListener('click', function() {
        clearTemplates();
    });

    async function parseCSVFile(file) {
        // Option for transforming headers into something else might be useful (might not need to map from template to keys)
        parse(file, {
            header: true,
            download: true,
            complete: async function(results) {
                await fetch(baseURL + '/csv', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(results)
                })
            }
        });
    }

    async function clearTemplates() {
        await fetch(baseURL + '/templates/clear', {
            method: 'POST'
        })
    }
})();