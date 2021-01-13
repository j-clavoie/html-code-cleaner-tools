# Change Log

## [0.0.16] - 2021-01-XXXXXXXXXXXXXXXXXXXX


## [0.0.15] - 2021-01-13
+ Fix some little bug with the ABBR cleaning space.
+ Change order where sub-function are executed.

## [0.0.14] - 2021-01-12
+ Add a remove/trim useless spaces function
  + Function removes useless spaces in:
    + All CLASS attribute of all Tags. 
    + Both ends of P, LI and ABBR tags
  + Function add spaces around ABBR tags
    + If tag is preceeded by: > - " /<br>
      Then space is removed
    + If tag is succeded by: , . ;<br>
      Then space is removed
  + Add Extension's property to enable/disable this new function<br>
  + Removed the regex to remove spaces in ```<li></li>``` that I added in version 0.0.13.
+ Update Readme file

## [0.0.13] - 2021-01-12
+ Fix a little bug when cleanning link (A tag).<br>
  Spaces were added both end of A tag.
+ Add in Extension's properties, in the "SearchReplaceEnd" property, a regex to remove spaces after and before ```<li></li>```

## [0.0.12] - 2021-01-11
+ Fix a regex

## [0.0.11] - 2021-01-11
+ Fix a regex

## [0.0.10] - 2021-01-11
+ Fix issue with the French number function. no-blank-space before symbols $ and % MUST have a space instead of may have a space.
+ Remove deletion of all ```<i>``` tags in the "Begin" function (remove from the Extension's properties). This tag is used for "awesome font".<br>
(MUST UPDATE Extension properties, to remove ```<\\/?i>```, in step 1 of SearchReplaceBegin property.)
+ Fix Regex to delete empyt P tag (in the Begin function, in Extension's properties)
+ Fix an issue with link that points to anchor in the page (```<a hef="#id">link's name</a>```). <br>
  I don't know why but "about:blank" is added before the hashtag in the href attribute.<br>
  So, I added a regex to remove all "about:blank" string in the whole document.


## [0.0.9] - 2021-01-08
+ Add a sub function "clean URL". It's applied in both "Begin" and "End" main functions.
+ Add Extension's property to enable/disable the "clean URL" step
+ Clean URL
  + A tags and IMG tags
    + Trim spaces in both ends of URL
    + Replace spaces by %20 inside the URL
    + Replace \ by / in URL
    + Replace extras dash (/) (3 and more) after protocol (ex.: file://// -> file://)
  + A tags only
    + Trim spaces in the text of A tags (link's name: inside the A tag)
    + Email address
      + Remove spaces in the address before the symbol "?"
      + Convert email address in lowercase (before the symbol "?")
+ Fix little issue when escaping popup message
      

## [0.0.8] - 2021-01-04
+ Fix error with the subdomain deletion:
  + Issues was that dot (.) wasn't present in the regex and the subdomain wasn't optional in the REGEX. So, when no subdomain was present, the domain wasn't deleted. <br />FIXED.
+ Fix error with French number conversion:
  + Issue was that numbers without spaces were splitted with no-blank-space. That was an error in the regexp where the space was optional but must be present. <br />FIXED


## [0.0.7] - 2020-12-29
Working version.
+ Readme file created.
+ Functions available:
  + HTML Code cleaner - Begin: that clean the code before doing any change in the code
  + HTML Code cleaner - End: that clean and set the code after all change are done and ready to publish
  + HTML - Convert special characters: Convert HTML coded special character to human readable character.
+ Most of the change can be enable/disable, and/or add/remove in the Extension's properties.
+ Validate if the Extension is executed in HTML file. If not, then no action.


## [previous 0.0.07]
All previous version were working but contain bugs.