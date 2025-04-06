---
tags:
  - type/note
  - theme/xyz
aliases:
  - At least English and Bulgarian aliases - can have more where relevant
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
<!-- Clear and descriptive title of the term (English and Bulgarian) -->  

> [!Definition]  
> <definiton of the word> 

> [!Origin]  
> <origin of the word>


**Explanation**  
<!-- Main explanation of the term -->  
-  

**Examples**  
<!-- Practical usage or contextual examples -->  
-

**Snapshot**
<!— Analogy / rhyme / shocking story / word play / some other effective way to remember this word —> 
- 

**Related Terms**  
<!-- Link to related concepts or notes -->  
-  

**References**  
<!-- Sources or further reading -->  
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

const aiContent = await tp.ai.chat(`Based on the title "${title}", please generate content following this template structure. Use original language or word plus English for extra reference:\n\n${templateContent}`);

console.log(aiContent);

tR = aiContent + " ";
console.log(tR);
%>


