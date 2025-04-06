---
tags:
  - type/movie
  - theme/xyz
aliases: 
lead: +++ Lead paragraph goes here +++
visual: "![[poster.jpg]]"
title: "{{title}}"
subtitle:
  "{ subtitle }": 
director:
  "{ director }": 
writers:
  "{ writers }": 
cast:
  "{ cast }": 
category:
  "{ category }": 
categories:
  "{ categories }": 
description: 
studio:
  "{ studio }": 
runtime:
  "{ runtime }": 
poster_url:
  "{ posterUrl }": 
poster_small_url:
  "{ posterSmallUrl }": 
release_date:
  "{ releaseDate }": 
imdb_id:
  "{ imdbId }": 
link:
  "{ link }": 
preview_link:
  "{ preview_link }": 
rating: 
watched: '""'
status: not_watched
created:
  "{ DATE:YYYY-MM-DD, HH:mm }": 
modified:
  "{ DATE:YYYY-MM-DD, HH:mm }": 
template_type: Movie
template_version: "1.0"
---
<!-- 
rating: ⭐️    // 1 to 10 stars
watched: 2023          // when finished watching
status: undefined, backlog, to watch, watching, completed, stopped
*** See "Template Help" below for using properties ***
-->

# {{Title}}

Directed by [[{{director}}]]

> [View on IMDb](https://www.imdb.com/title/{{imdbId}})


<!-- No more than a couple paragraphs summarizing this MOVIE -->

> [!summary]
{{description}}

## Cast
- {{cast}}

## Notes
<!-- The main content of my thoughts really -->
- 

## Quotes
<!-- Memorable lines with reference to scenes, if applicable -->
- 

---
# Back Matter

**Source**
<!-- Always keep a link to the source --> 
- 

**References**
<!-- Links to pages not referenced in the content -->
- 

**Terms**
<!-- Links to definition pages -->
- 

**Target**
<!-- Link to project note or externally published content -->
- 

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
