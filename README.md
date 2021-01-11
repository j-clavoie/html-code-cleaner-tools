# HTML Code Cleaner Tools Extension for Visual Studio Code
This is a Visual Studio Code extension for HTML file that helps to clean HTML code.

## **Overview**
This extension contains 3 functions for the moment.

+ **HTML Code Cleaner - Begin**: This function can be executed before to work on code. This function helps to remove useless/unwanted piece of code in the active text editor.

+ **HTML Code Cleaner - End**: This function can be executed before to publish a HTML page. This function helps to convert and set code to make code uniform between each page on a site.

+ **HTML - Convert special characters**: This function converts HTML special characters to the real humain readable character. (example: &amp;eacute; will be converted to é, &amp;amp; will be converted to &).
For the moment, the function allows only conversion from HTML code to real character, not real character to HTML code.

<br />
<br />


## **How to use**
All functions in this extension will apply to selected text (part of code). If no text is selected in the code, the function will use the whole content.

<br />

### **HTML Code Cleaner - Begin**
Open the code to update and execute this function to clean the text/code.

The function will:
+ Delete all useless SPAN (empty, lang other than the language of text (content)). This step is not optional
+ Delete domains stored in Extension's properties inside A and IMG tags. This step is optional, it can be disabled in Extension's properties
+ Apply all Search and Replace stored in the Extension's properties

<br />

### **HTML Code Cleaner - End**
Before to save and publish the HTML code, execute this function to clean the code and set special coding to uniform the code.

The function will:
+ Delete domains stored in Extension's properties inside A and IMG tags. This step is optional, it can be disabled in Extension's properties
+ Apply all Search and Replace stored in the Extension's properties
+ Set no-blank-space in French number. This step can be disabled in Extension's properties

<br />

### **HTML - Convert special characters**
This funciton is very simple, only have to execute the function and all characters will be converted.

The pairs (character = HTML code) are stored in a JSON file in the ```[extension folder]/lib/special_characters.json```

Instruction on how to customize this file will be developped later.

<br />
<br />

## **Configuration instructions**
There is the list of properties for this extension:

<br />

### **Search Replace Begin** and **Search Replace End**
These settings are arrays that contain all Search and Replace regex apply when use respectively the "HTML Code Cleaner - Begin" and "HTML Code Cleaner - End"

**IMPORTANT**: regex special characters must be escaped twice (\\) instead of simple escaped (\). The reason is that regular expression is stored in an JSON. 

This is an example of setting.

```JSON
"html-code-cleaner-tools.SearchReplaceBegin": [
  {
    "step": 1,
    "description": "Delete italic and underline",
    "search": "(<\\/?em>|<\\/?i>|<\\/?u>)",
    "replace": "",
    "multipass": false
  },
  {
    "step": 2,
    "description": "Delete all tag <a name>",
    "search": "<a name=[\"'].*?[\"']>(.*?)<\\/a>",
    "replace": "$1",
    "multipass": true
  }
```
+ step is used only to help to know the order when this Search/Replace will be executed
+ description is only to help to remember to goal of this Search/Replace
+ search is the regex to search
+ replace is the replace expression of the search. Note that group can be used like is shown in the second example.
+ multipass is used to indicate if the Search/Replace must be executed only once or until the search expression is found in the code. Take care when you set to "true" to not create endless loop.

<br />

### **Domains To Delete**
This setting is an array of string that contain domain(s) to remove in link (A tag and IMG tag). 

```JSON
"html-code-cleaner-tools.domainsToDelete": [
  "yourdomain.com", "anotherdomain.com", "app.yourdomain.com"
]
```

<br />

### **Include Sub Domains In Deletion**
This setting is linked to the previous setting (Domains To Delete). It's a boolean value (true/false) to indicate if subdomain must be considered in the domain deletion.

Example: If "Domains To Delete" contains "yourdomain.com" and the "Include Sub Domains in Deletion" is actiavted, then all these domains will be deleted: "subdomain.yourdomain.com", "www.yourdomain.com", "database.yourdomain.com", etc.

The default value is TRUE.

<br />

### **Text Languages**
This setting is an array of language and code language. It's used to know the language of the text (not the coding language).

This setting is used with the "HTML Code Cleaner - Begin" when empty SPAN are deleted. The script will removed all ```<span lang="xx">``` that are the same than the language of text. It's a useless SPAN and must be removed.

```JSON
"html-code-cleaner-tools.textLanguages": [
  {
    "langName": "English",
    "langCode": "en"
  },
  {
    "langName": "French",
    "langCode": "fr"
  }
]
```

<br />

### **Convert French Numbers **
This setting has a boolean value (true/false) to indicate if French numbers must be converted.

The default value is TRUE. 

If you set to False, the conversion won't be executed.

The conversion consists to replace "space" by "no blank space" in number and before symbol.
Example: the number: ```12 654 $``` will be converted to ```12&#160;654&#160;$```

<br />
<br />

## Known issues

### HTML Code Cleaner - Begin & End
When using these both functions, all comment at the beginning of the code will be removed.<br>
All other comments will keep but if the code starts with comments then these comments will be removed.alias


## Reference
List of Special characters: https://www.freeformatter.com/html-entities.html

