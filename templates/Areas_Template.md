```dataview
LIST rows.file.link
FROM ""
WHERE contains(areas, this.file.name)
AND !contains(file.folder, "templates")
GROUP BY type
```