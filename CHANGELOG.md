# Change Log


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