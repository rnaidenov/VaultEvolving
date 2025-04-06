---
tags:
  - type/structure
  - structure/5-minute-journal
  - structure/bujo
created: <% tp.date.now("YYYY-MM-DD, HH:mm") %>
modified: <% tp.file.last_modified_date("YYYY-MM-DD, HH:mm") %>
template_type: BuJo Daily
gym: no
walk: no
love: no
read: no
diet: no
socialize: no
meditation: no
---

```button
^button-previous-day 
name < Previous Day 
type command 
action Daily notes: Open previous daily note 
```
> ## Daily Log
```button
^button-next-day 
name Next Day >
type command 
action Daily notes: Open next daily note 
```



<%*
// Get current date components
const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const dateString = `${year}-${month}-${day}`;

// Define folder and target path
const folderPath = `journal/daily/${year}/${month}`;
const targetPath = `${folderPath}/${dateString}.md`;

// Check if the target file already exists
const existingFile = app.vault.getAbstractFileByPath(targetPath);
if (existingFile) {
  throw new Error(`File "${targetPath}" already exists in the target folder!`);
}

// Ensure the target folder exists
await app.vault.createFolder(folderPath).catch(() => console.log("Folder exists"));

// Rename the current file to the date string
await tp.file.rename(dateString);

// Get the current file (after renaming)
const currentFile = tp.file.find_tfile(dateString); // Relative path after rename
console.log("Current file path:", currentFile.path);

// Move the file to the target location
await app.fileManager.renameFile(currentFile, targetPath);
%>

## 🌅 MORNING ROUTINE


## I am grateful for...

* 

## What would make today great?

- [ ]

## Daily affirmation:

<!-- 
	I am growing and changing for the better 
	I am committed to personal growth today
-->

I am 


## 🌙 EVENING REFLECTION

## 3 Amazing things that happened today...

1. 
2. 
3. 


## How could I have made today even better?

* 