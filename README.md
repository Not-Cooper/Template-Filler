# Template-Filler
Webapp that allows users to fill a template with certain values from a csv    

# To Build
npm install  
npm run build  

# How To use  
Build and run the application. Then open to the port in your browser.  
Provide a csv file with your data and then a .txt file with the template to be filled (your template should follow the guidelines outlined in this readme).  
Specify the translation values from your csv headers to your template values that you want to be replaced.  
Click the "Fill Templates" button. If it worked, the filled_templates directory within the project should be filled with the generated pdfs.  
To clear this directory easily, just click the "Clear Templates" button  

# Template Guidelines  
Values you want to be replaced by csv data must be placed in between square brackets ie. [Value1]  
You can include any number of values between these brackets ie. [Value1 Value2, Value3]  
The brackets will be removed in the final template, but the punctuation within will not be touched  

# Output
Output is directed to a filled_templates directory (may need to create it first, or use the clear templates button and rerun)  
