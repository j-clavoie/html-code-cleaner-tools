# HTML Code Cleaner Tools Extension for Visual Studio Code
This is a Visual Studio Code extension for HTML file that helps to clean HTML code.

## Overview
This extension contains 3 functions for the moment.

+ **HTML Code Cleaner - Begin**: This function can be executed before to work on code. This function helps to remove useless/unwanted piece of code in the active text editor.

+ **HTML Code Cleaner - End**: This function can be executed before to publish a HTML page. This function helps to convert and set code to make code uniform between each page on a site.

+ **HTML - Convert special characters**: This function converts HTML special characters to the real humain readable character. (example: &amp;eacute; will be converted to é, &amp;amp; will be converted to &).
For the moment, the function allows only conversion from HTML code to real character, not real character to HTML code.

## How to use
All functions in this extension will apply to selected text (part of code). If no text is selected in the code, the function will use the whole content.

### **HTML Code Cleaner - Begin**
Open the code to update and execute this function to clean the text/code.

The function will:
+ Delete all useless SPAN (empty, lang other than the language of text (content)). This step is not optional
+ Delete domains stored in Extension's properties inside A and IMG tags. This step is optional, it can be disabled in Extension's properties
+ Apply all Search and Replace stored in the Extension's properties

### **HTML Code Cleaner - End**
Before to save and publish the HTML code, execute this function to clean the code and set special coding to uniform the code.

The function will:
+ Delete domains stored in Extension's properties inside A and IMG tags. This step is optional, it can be disabled in Extension's properties
+ Apply all Search and Replace stored in the Extension's properties
+ Set no-blank-space in French number. This step can be disabled in Extension's properties

### **HTML - Convert special characters**
This funciton is very simple, only have to execute the function and all characters will be converted.

## Configuration instructions
```JSON
to be defined
```


## Reference
List of Special characters: https://www.freeformatter.com/html-entities.html

