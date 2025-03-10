import { parse } from "papaparse";

const baseURL = 'http://localhost:3000/templates';

(function() {
    const csvListener = document.getElementById('csv-file');
    const templateListener = document.getElementById('template-file');
    const fillListener = document.getElementById('fill-button');
    const clearListener = document.getElementById('clear-files');
    const inputContainer = document.getElementById('field-container');
    const customFieldContainer = document.getElementById('custom-fields');

    let csvData;
    let templateInfo = {};

    // On csv updated
    csvListener.addEventListener('change', function() {
        inputContainer.innerHTML = "";
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

    // On template updated
    templateListener.addEventListener('change', function() {
        if (templateListener.files && templateListener.files.length > 0){
            console.log("template given");
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target.result;
                sendTemplate(fileContent);
            };
            reader.readAsText(templateListener.files[0]);
        }
    });

    // On fill button click
    fillListener.addEventListener('click', function() {
        console.log("Fill button pressed");
        if (csvListener.files && csvListener.files.length > 0 && csvData){
            fillTemplates();
        }
        else{
            console.log("No file given");
        }
    });

    // On clear button click
    clearListener.addEventListener('click', function() {
        console.log("Clearing template files...");
        clearTemplates();
    });

    // On inputs updated
    inputContainer.addEventListener('input', function(event) {
        templateInfo[event.target.name] = event.target.value;
    });

    customFieldContainer.addEventListener('input', function(event) {
        templateInfo[event.target.name] = event.target.value;
    });

    customFieldContainer.addEventListener('click', function(event) {
        if (event.target.name == "new-value"){
            const definitionInput = document.createElement("input");
            definitionInput.type = "text";
            definitionInput.id = "new-key"
            const submitButton = document.createElement("button");
            submitButton.name = "submit";
            submitButton.id = "submit-button";
            submitButton.textContent = "Submit";
            customFieldContainer.appendChild(definitionInput);
            customFieldContainer.appendChild(submitButton);
            customFieldContainer.appendChild(document.createElement("br"));
        }
        else if (event.target.name == "submit"){
            console.log("submit pressed");
            const label = document.createElement("label");
            const newValue = document.getElementById("new-key").value;
            label.textContent = newValue;
            const input = document.createElement("input");
            input.type = "text";
            input.name = newValue;
            input.placeholder = "Template Replace Key";
            templateInfo[newValue] = '';
            customFieldContainer.appendChild(label);
            customFieldContainer.appendChild(input);
            document.getElementById("new-key").remove();
            document.getElementById(event.target.id).remove();
            customFieldContainer.appendChild(document.createElement("br"));
        }
    });

    function createFieldInputs() {
        console.log("Now Input Template Values");
        let csvFields = csvData['meta']['fields'];
        csvFields.forEach(element => {
            templateInfo[element] = '';
            const label = document.createElement("label");
            label.textContent = element;
            const input = document.createElement("input");
            input.type = "text";
            input.name = element;
            inputContainer.appendChild(label);
            inputContainer.appendChild(input);
            inputContainer.appendChild(document.createElement("br"));
        });
    }

    async function sendTemplate(templateString) {
        await fetch(baseURL + '/templates/send', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({'template':templateString})
        })
    }

    async function fillTemplates() {
        const response = await fetch(baseURL + '/templates', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({'csvData':csvData, 'templateInfo': templateInfo})
        });
        
        let blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filename.zip'; // Set the desired filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function clearTemplates() {
        await fetch(baseURL + '/templates/clear', {
            method: 'POST'
        })
    }
})();