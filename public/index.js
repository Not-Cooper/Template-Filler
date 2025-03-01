import { parse, unparse } from "papaparse";

const baseURL = 'http://localhost:3000/templates/csv';

(function() {
    var fileListener = document.getElementById('csv-file');

    fileListener.addEventListener('change', function() {
        if (fileListener.files && fileListener.files.length > 0){
            parseCSVFile(fileListener.files[0]);
        }
    });

    async function parseCSVFile(file) {
        parse(file, {
            download: true,
            complete: async function(results) {
                const res = await fetch(baseURL, {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json'
                        },
                        body: JSON.stringify(results)
                    })
                console.log(await res.json());
            }
            // step: function(results, parser) {
            //     console.log("Row data:", results.data);
            //     console.log("Row errors:", results.errors);
            // },
            // complete: async function(results, file) {
            //     console.log("Parsing complete:", results, file);
            //     const res = await fetch(baseURL, {
            //         method: 'POST',
            //         headers: {
            //             "Content-Type": 'application/json'
            //         },
            //         body: JSON.stringify(results)
            //     })
            //     console.log(res);
            // }
        })
    }

})();