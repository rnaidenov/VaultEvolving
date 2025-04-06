---
tags:
  - type/note
  - theme/xyz
aliases: 
lead: +++ Lead paragraph goes here +++
visual: "![[image.jpg]]"
created:
  "{ DATE:YYYY-MM-DD, HH:mm }": 
modified:
  "{ DATE:YYYY-MM-DD, HH:mm }": 
template_type: Note
template_version: "1"
---
# {{Title}}
<!--  Clear and descriptive title -->

<!--  Most essential idea from "lead"-key  in properties section -->

> [!Summary]
> [summary of the note - can be a duplicate of the entry in lead meta]

**Details**
<!-- Main content in body of my note  -->
- 

**Supporting Content**
<!-- Supporting content in tail of my note  -->
- 


**Images** 
<!-- Relevant images with descriptions, can be multiple links --> 
https://google.com/search?q=[related_search_term]&udm=2

---
# Back Matter

**Source**
<!-- Always keep a link to the source- --> 
- based_on::

**References**
<!-- Links to pages not referenced in the content. 
- see:: [[related note]] and <why you made this connection> -->
- see:: 

**Books**
<!-- Link any relevant books. Format should be: <author> - <book title> -->
- 

**Documentaries**
<!-- Link any relevant documentaries with link, if possible. -->
- 

**Music**
<!-- Link any relevant music. -->
- 

**Terms**
<!-- Links to definition pages. -->

**Snapshot**
<!— Analogy / rhyme / shocking story / word play / some other effective way to remember this word (only if relevant —> 
- 

**Target**
<!-- Link to project note or externaly published content. -->
- 
---
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

tR = aiContent + " ";
console.log(tR);
%>

