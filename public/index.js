import { parse } from "papaparse";

const baseURL = 'http://localhost:3000/templates/csv';

(function() {
    var fileListener = document.getElementById('csv-file');

    fileListener.addEventListener('change', function() {
        if (fileListener.files && fileListener.files.length > 0){
            parseCSVFile(fileListener.files[0]);
        }
    });

    async function parseCSVFile(file) {
        // Option for transforming headers into something else might be useful (might not need to map from template to keys)
        parse(file, {
            header: true,
            download: true,
            complete: async function(results) {
                fetch(baseURL, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(results)
                })
            }
        });
    }
})();