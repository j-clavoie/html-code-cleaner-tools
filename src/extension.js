const vscode = require('vscode');
const genFunc = require('./genericFunctions');
// Read the JSON file that contains characters definitions (it's imported as JSON object, not string)
const listChars = require('../lib/special_characters.json');


/**
 * * This method is called when extension is activated
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let functionBegin = vscode.commands.registerCommand('ddpd.code-cleaner_begin', async function () {
		await cleanCodeBegin();
	});

	let functionEnd = vscode.commands.registerCommand('ddpd.code-cleaner_end', function () {
		cleanCodeEnd();
	});

	let convertSpecialCharacters = vscode.commands.registerCommand('ddpd.convert-special-characters', function () {
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


/* *#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#* */
/* *#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#* */
/* *#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#* */


/**
 * This method clean the code of unwanted code/characters/etc
 * Replace one or many spaces/no blank spance to only one space
 * Remove all unwanted format coding (italic, superscript, underline)
 */
async function cleanCodeBegin() {
	// Validate if the code is HTML
	if (!genFunc.isHTMLcode()) {
		return;
	}

	// Get the language of the text in the code
	const textLang = await genFunc.getLang("html-code-cleaner");

	// Select the current editor, if no one available then show an error message and exit
	const myEditor = genFunc.getActiveEditor();
	if (!myEditor) {
		return false;
	}

	// Define the whole document as range. Range is required to update the Editor's content
	const SelectedTextRange = genFunc.getRangeSelected(true);

	// Get the selected text in the Active Editor
	let docText = genFunc.getTextSelected(true);

	// Delete useless empty SPAN and SPAN LANG of the text of in the code
	docText = deleteUselessSpan(docText, textLang);

	// Delete domain in "A href" and "IMG src"
	docText = deleteDomains(docText);

	// Apply all RegEx stored in the Extension's properties for the Begin script
	searchReplaceFromProperties(docText, "SearchReplaceBegin");

	// Replace the content of the Active Editor with the new one cleanned
	genFunc.updateEditor(docText, SelectedTextRange);

	// Execute the commande "Format Document" to set the code more readable
	vscode.commands.executeCommand("editor.action.formatDocument");
}



/**
 * This method replace not standard characters, add no blank space before and convert some characters
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

	// Delete domain in "A href" and "IMG src"
	docText = deleteDomains(docText);

	// Apply all RegEx stored in the Extension's properties for the Begin script
	searchReplaceFromProperties(docText, "SearchReplaceEnd");

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
	if (!isHTMLcode()) {
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
	const configDomainsToRemove = vscode.workspace.getConfiguration("html-code-cleaner").domainsToDelete;
	const deleteSubDomains = vscode.workspace.getConfiguration("html-code-cleaner").includeSubDomainsInDeletion;

	if (configDomainsToRemove.length < 1 || configDomainsToRemove == null) {
		return docText;
	}

	// Initial the variable (empty)
	let domainsToRemoveString = '';
	// Pass through all domains in properties
	configDomainsToRemove.forEach(function (elem) {
		// Check if sub-domains must be deleted
		if (deleteSubDomains) {
			// Add part of regex to includes subdomains
			domainsToRemoveString = domainsToRemoveString + ".*?" + elem + "|";
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
 * Method that delete all empty SPAN tag, or set with the same language than the textLang Parameter.
 * ie.: If it's a English text (content) then all "SPAN LANG='EN'" are useless and must be deleted
 * @param {string} docText HTML code source to clean
 *
 * Return HTML code with domains removed from "a href" and "img src"
 */
function deleteUselessSpan(docText, textLang) {
	let patternText = "<span lang=[\"']" + textLang + "[\"']>(.*?)<\\/span>|<span>(.*?)<\\/span>";
	const spanPattern = new RegExp(patternText, "gmi");
	while (docText.match(spanPattern) != undefined) {
		docText = docText.replace(spanPattern, '$1$2');
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
	const convertFrenchNumber = vscode.workspace.getConfiguration("html-code-cleaner").convertFrenchNumbers;
	if (convertFrenchNumber) {
		let patternText = "(\\d) (\\d{3})";
		const spanPattern = new RegExp(patternText, "gmi");
		while (docText.match(spanPattern) != undefined) {
			docText = docText.replace(spanPattern, '$1&#160;$2');
		}
		docText = docText.replace(/(\d) ([$%])/gmi, '$1&#160;$2');
	}
	// Return the code cleaned
	return docText;
}


/**
 * Method to Execute Regex stores in the Extension's properties
 * @param {string} docText HTML code source to clean
 * @param {string} property the Extension Property name to use for the Search and replace
 * Return the HTML code updated
 */
function searchReplaceFromProperties(docText, property) {
	const searchReplace = vscode.workspace.getConfiguration('html-code-cleaner')[property];
	if (searchReplace != null && searchReplace.length > 0 ) {
		searchReplace.forEach(function (elem) {
			let srPattern = new RegExp(elem.search, "gmi");
			if (elem.multipass) {
				while (docText.match(srPattern) != undefined) {
					docText = docText.replace(srPattern, elem.replace);
				}
			} else {
				docText = docText.replace(srPattern, elem.replace);
			}
		});
	}
	return docText;
}