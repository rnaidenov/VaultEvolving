---
tags:
  - type/person
  - theme/xyz
  - role/xyz
aliases: 
birth: 
death: 
years: <%* tp.user.years(this.birth, this.death) %>
bio_short: 
lead: +++ Term definition goes here +++
visual: "![[image.jpg]]"
created:
  "{ DATE:YYYY-MM-DD, HH:mm }": 
modified:
  "{ DATE:YYYY-MM-DD, HH:mm }": 
template_type: Person
template_version: "1"
---

# {{Title}}

##  Bio
<!-- Short biography of the PERSON -->

> [!Bio short]
> [`Short biography of the PERSON`]


**Books**
<!-- Link any relevant books. Format should be: <author> - <book title> -->
* 

## Notes
<!-- The main content of my thoughts really -->
- 

## Quotes
<!-- Notable quotes with reference to their page or location -->
- 

---
# Back Matter
**Source**
<!-- Always keep a link to the source- --> 
- based_on::

**References**
<!-- Links to pages not referenced in the content. -->
- 

**Terms**
<!-- Links to definition pages. -->
- 

**Target**
<!-- Link to project note or externaly published content. -->
* 

**Tasks**
<!-- What remains to be done with this note? --> 
- 

**Questions**
<!-- What remains for you to consider? --> 
- 

<%*
const templatePath = tp.config.template_file.path;
const templateContent = await app.vault.read( app.vault.getAbstractFileByPath(templatePath) );

const activeFile = app.workspace.getActiveFile();
let title = activeFile?.basename ?? tp.file.title;

const newFileTitlePattern = /Untitled(\s\d+)*/; 
if (newFileTitlePattern.test(title)) {
  title = await tp.system.prompt("Enter title for your note:");
} else if (activeFile) {
  app.vault.delete(activeFile);
}
await tp.file.rename("NEW - " + title);

const aiContent = await tp.ai.chat(`Based on the title "${title}", please generate content following this template structure:\n\n${templateContent}`);

console.log(aiContent);

tR = aiContent + " ";
console.log(tR);
%>

