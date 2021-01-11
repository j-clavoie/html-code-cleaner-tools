const vscode = require('vscode');
const genFunc = require('./genericFunctions');
const JSDOM = require('jsdom').JSDOM;

// Read the JSON file that contains characters definitions (it's imported as JSON object, not string)
const listChars = require('../lib/special_characters.json');


/**
 * * This method is called when extension is activated
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let functionBegin = vscode.commands.registerCommand('html-code-cleaner-tools.begin', async function () {
		await cleanCodeBegin();
	});

	let functionEnd = vscode.commands.registerCommand('html-code-cleaner-tools.end', function () {
		cleanCodeEnd();
	});

	let convertSpecialCharacters = vscode.commands.registerCommand('html-code-cleaner-tools.convert-special-characters', function () {
		convertSepecialCharacters();
	});

	context.subscriptions.push(functionBegin);
	context.subscriptions.push(functionEnd);
	context.subscriptions.push(convertSpecialCharacters);
}

// this method is called when extension is deactivated
function deactivate() { }
exports.activate = activate;
module.exports = {
	activate,
	deactivate
}


/* *#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#* */
/* *#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#* */
/* *#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#* */


/**
 * This method cleans the code of unwanted/useless code/characters/etc
 * Execute regex replacement stored in the Extenstion's properties
 */
async function cleanCodeBegin() {
	// Validate if the code is HTML, if not stop process
	if (!genFunc.isHTMLcode()) {
		return;
	}

	// Select the current editor, if no one available then show an error message and exit
	const myEditor = genFunc.getActiveEditor();
	if (!myEditor) {
		return false;
	}

	// Get the language of the text in the code
	const textLang = await genFunc.getLang("html-code-cleaner-tools");
	if (textLang == null) {
		vscode.window.showErrorMessage("The extension is experiencing an issue related to Language of text. Check Extension's properties to fix potential conflicts.");
		return;
	} else if (textLang == -1) {
		return;
	}

	// Define the whole document as range. Range is required to update the Editor's content
	const SelectedTextRange = genFunc.getRangeSelected(true);

	// Get the selected text in the Active Editor
	let docText = genFunc.getTextSelected(true);

	// Delete useless empty SPAN and SPAN LANG of the text of in the code
	docText = deleteUselessSpan(docText, textLang);

	// Delete domain in "A href" and "IMG src"
	docText = deleteDomains(docText);

	// Clean URL
	docText = cleanURL(docText);

	// Apply all RegEx stored in the Extension's properties for the Begin script
	docText = searchReplaceFromProperties(docText, "SearchReplaceBegin");

	// Replace the content of the Active Editor with the new one cleanned
	genFunc.updateEditor(docText, SelectedTextRange);

	// Execute the commande "Format Document" to set the code more readable
	vscode.commands.executeCommand("editor.action.formatDocument");
}



/**
 * This method cleans/set the code before to publish it.
 * Execute regex replacement stored in the Extenstion's properties
 */
function cleanCodeEnd() {
	// Validate if the code is HTML
	if (!genFunc.isHTMLcode()) {
		return;
	}

	// Select the current editor, if no one available then show an error message and exit
	const myEditor = genFunc.getActiveEditor();
	if (!myEditor) {
		return false;
	}

	// Define the whole document as range. Range is required to update the Editor's content
	const SelectedTextRange = genFunc.getRangeSelected(true);

	// Get the selected text in the Active Editor
	let docText = genFunc.getTextSelected(true);

	// ****** MAIN PROCESS - Apply replacement ****** 
	// TODO: 	Add a DOM to keep all A tag with FILE: protocol and replace \ by / and space by %20
	// 				Must be executed before all other replacement - 

	// Clean URL
	docText = cleanURL(docText);


	// Delete domain in "A href" and "IMG src"
	docText = deleteDomains(docText);

	// Apply all RegEx stored in the Extension's properties for the Begin script
	docText = searchReplaceFromProperties(docText, "SearchReplaceEnd");

	// Convert French Number to replace space by no-blank-space
	docText = setFrenchNumber(docText);

	// Replace the content of the Active Editor with the new one cleanned
	genFunc.updateEditor(docText, SelectedTextRange);

	// Execute the commande "Format Document" to set the code more readable
	vscode.commands.executeCommand("editor.action.formatDocument");
}


/**
 * This method convert all special characters by the characters itself
 * For now, this funciton only convert accented characters coded with the name not the number.
 */
function convertSepecialCharacters() {
	// Validate if the code is HTML
	if (!genFunc.isHTMLcode()) {
		return;
	}

	// Select the current editor, if no one available then show an error message and exit
	const myEditor = genFunc.getActiveEditor();
	if (!myEditor) {
		return false;
	}

	// Define the whole document as range. Range is required to update the Editor's content
	const SelectedTextRange = genFunc.getRangeSelected(true);

	// Get the selected text in the Active Editor
	let docText = genFunc.getTextSelected(true);

	// ****** MAIN PROCESS - Apply replacement ****** 
	// Pass through out all characters and replace their name (&#####;) by their character (x) in the selected part of text
	// Only the name is replaced. Special characters coded with their number is kept in the code.
	for (let i = 0; i < listChars.accentedCharacters.length; i++) {
		// Define the RegEx partern 
		let tmpPatern = listChars.accentedCharacters[i].name;
		// Create a temporary RegEx object
		let tmpRegEx = new RegExp(tmpPatern, "g");
		// Proceed to replacement of all instances of the character's name by the caracter itself
		docText = docText.replace(tmpRegEx, listChars.accentedCharacters[i].character);
	}

	// Replace the content of the Active Editor with the new one cleanned
	genFunc.updateEditor(docText, SelectedTextRange);
}





/**
 * Method to delete all domain stored in the Extension's properties
 * Domains are removed from the A tags and IMG tags
 * @param {string} docText HTML code source to clean
 * If no properties set, the docText is return without any changes
 * Return HTML code with domains removed from "a href" and "img src"
 */
function deleteDomains(docText) {
	// Get list of domains to remove in links (stored in Extension's properties)
	const configDomainsToRemove = vscode.workspace.getConfiguration("html-code-cleaner-tools").domainsToDelete;
	const deleteSubDomains = vscode.workspace.getConfiguration("html-code-cleaner-tools").includeSubDomainsInDeletion;

	// If no domain to remove then only return the original docText
	if (configDomainsToRemove.length < 1 || configDomainsToRemove == null) {
		return docText;
	}

	// Initial the variable (empty)
	let domainsToRemoveString = '';
	// Pass through all domains in properties
	configDomainsToRemove.forEach(function (elem) {
		elem = elem.replace(".", "\\.");
		// Check if sub-domains must be deleted
		if (deleteSubDomains) {
			// Add regex part to includes subdomains if present
			domainsToRemoveString = domainsToRemoveString + "(.*?\\.)*?" + elem + "|";
		} else {
			// Use only domain defined in properties
			domainsToRemoveString = domainsToRemoveString + elem + "|";
		}
	});
	// Remove the "|" at the end of the string
	domainsToRemoveString = domainsToRemoveString.substr(0, domainsToRemoveString.length - 1);

	// Create a regex pattern
	let patternText = "(href=['\"])http(s*):\\/\\/(" + domainsToRemoveString + ")";
	let domainsPattern = new RegExp(patternText, "gmi");

	// Delete all Domains in "href"
	docText = docText.replace(domainsPattern, '$1');

	// Delete all Domains in "IMG src"
	patternText = "(<img.*?)(src=['\"])http(s*):\\/\\/(" + domainsToRemoveString + ")";
	domainsPattern = new RegExp(patternText, "gmi");
	docText = docText.replace(domainsPattern, '$1$2');

	// Return the code cleaned
	return docText;
}



/**
 * Method that delete all empty SPAN tag, 
 * delete SPAN with the same language than the one selected by user with the popop,
 * or remove the lang="XX" from the SPAN if ID or class is set in the SPAN.
 * ie.: If it's a English text (content) then all "SPAN LANG='EN'" are useless and must be deleted
 * @param {string} docText HTML code source to clean
 *
 * Return HTML code with domains removed from "a href" and "img src"
 */
function deleteUselessSpan(docText, textLang) {
	// This pattern remove only empty SPAN and SPAN LANG="XX"... 
	//let patternText = "<span(.*?)lang=[\"']" + textLang + "[\"'](.*?)>(.*?)<\\/span>|<span>(.*?)<\\/span>";
	// This pattern remove Empty SPAN and SPAN lang="XX" or the lang="xx" if SPAN has ID or CSS class
	let patternText = "(<span.*?)\\s*lang=[\"']" + textLang + "[\"'](.*?>.*?<\\/span>)|<span(.*?)lang=[\"']" + textLang + "[\"'](.*?)>(.*?)<\\/span>|<span>(.*?)<\\/span>";
	const spanPattern = new RegExp(patternText, "gmi");
	// Execute the replacement until the regex pattern is present in the code
	while (docText.match(spanPattern) != undefined) {
		docText = docText.replace(spanPattern, '$1$2$3$6');
	}

	// Return the code cleaned
	return docText;
}


/**
 * Method that replace space in French number by no-blank-space. Do the same with $ and % symbol.
 * ie.: 1 123 $  =  1&#160;123&#160;$
 * @param {string} docText HTML code source to clean
 *
 * Return HTML code with domains removed from "a href" and "img src"
 */
function setFrenchNumber(docText) {
	// Check if French number conversion must be applied
	const convertFrenchNumber = vscode.workspace.getConfiguration("html-code-cleaner-tools").convertFrenchNumbers;
	if (convertFrenchNumber) {
		// Regex pattern
		let patternText = "(\\d) +(\\d{3})";
		const spanPattern = new RegExp(patternText, "gmi");
		// Execute the regex until the pattern is present in the docText
		while (docText.match(spanPattern) != undefined) {
			docText = docText.replace(spanPattern, '$1&#160;$2');
		}
		// Adding no-blank-space before $ and % symbols
		docText = docText.replace(/(\d) +([$%])/gmi, '$1&#160;$2');
	}
	// Return the code cleaned
	return docText;
}


/**
 * Method that executes Regex stored in the Extension's properties
 * @param {string} docText HTML code source to clean
 * @param {string} property the Extension Property name to use for the Search and replace
 * Return the HTML code updated
 */
function searchReplaceFromProperties(docText, property) {
	// Retrieve the Search and Replace information to execute (store in Extension's properties)
	const searchReplace = vscode.workspace.getConfiguration('html-code-cleaner-tools')[property];
	// If Search and Replace to execute then process
	if (searchReplace != null && searchReplace.length > 0) {
		// Process each Search/Replace stored
		searchReplace.forEach(function (elem) {
			// Create regex pattern
			let srPattern = new RegExp(elem.search, "gmi");
			// If the regex must be executed many times or only one
			if (elem.multipass) {
				// Pass through the docText until Pattern is present
				while (docText.match(srPattern) != undefined) {
					docText = docText.replace(srPattern, elem.replace);
				}
			} else {
				// Execute only once the regex
				docText = docText.replace(srPattern, elem.replace);
			}
		});
	}
	// Return the processed text
	return docText;
}

/**
 * Method that executes Regex stored in the Extension's properties
 * @param {string} docText HTML code source to clean
 * Return the HTML code updated
 */
function cleanURL(docText) {
	// If the Extension's property "cleanURL" is set to TRUE
	if (!vscode.workspace.getConfiguration("html-code-cleaner-tools").cleanURL) {
		// Return the docText without changes
		return docText;
	}

	// Create a DOM from the selected text
	let myDOM = new JSDOM(docText);

	// Retrieve all A tags in the DOM
	let ATags = myDOM.window.document.querySelectorAll('a');
	// Process each A tag
	ATags.forEach(function (elem) {
		// Trim spaces in both start and end of URL
		elem.href = elem.href.trim();
		
		// EMAIL address
		if (elem.href.match(/^mailto\:/gi) != null){
			// Retrive the first part of URL (from "mailto" to "?" all stuff after the symbol ? should not be touched)
			let tmphref = elem.href.match(/^mailto:.+\?*/g);
			// convert to lowercase
			tmphref = tmphref[0].toLowerCase();
			// remove space
			tmphref = tmphref.replace(/\s*/g, '');
			// reset the href of current element
			elem.href = tmphref;
		}
		
		// Replace space by %20
		elem.href = elem.href.replace(/\s/g, '%20');

		// replace \ by / in URL
		elem.href = elem.href.replace(/\\/g, '/');

		// replace group of / (3 or more) by only 2 (ex.: file://// => file://)
		elem.href = elem.href.replace(/(\/{3,})/, '//');

		// trim space in link's name (inside <a></a>)
		elem.innerHTML = elem.innerHTML.trim();
	});


	// Retrieve all IMG tags in the DOM
	let ImgTags = myDOM.window.document.querySelectorAll('img');
	// Process each A tag
	ImgTags.forEach(function (elem) {
		// Trim spaces in both start and end of URL
		elem.src = elem.src.trim();
		elem.src = elem.src.replace(/\s/g, '%20');
	});

	// Convert the DOM to text (HTML code)
	docText =  myDOM.window.document.getElementsByTagName('body')[0].innerHTML;

	// I don't know why but JSDOM add "about:blank" in anchor link
	// Remove it
	docText = docText.replace("about:blank", "");

	// add spaces both ends of A tags (extra spaces will be removed with the format document command)
	docText = docText.replace(/(<a(.*?)href)/gmi, ' $1');
	docText = docText.replace(/(<\/a>)/gmi, '$1 ');
	
	// Return the processed text
	return docText;
}