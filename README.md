# VaultEvolving: Project Management Workflow in Obsidian

## Overview

Welcome to my project management workflow in [Obsidian](https://obsidian.md/). This setup helps keep projects and tasks organized with a system that automates templates, task management, and information consolidation. I'm documenting this journey as @VaultEvolving on [Twitter](https://twitter.com/VaultEvolving).

## What It Does

This workflow manages projects in Obsidian through:
- Automated project note creation with templates (using the PARA method)
- Streamlined task addition via forms with project prefixes
- Consolidated task views within each project note

Here's the workflow:

1. **Templater Sets Up Project Notes**  
   New notes in the `projects` folder are automatically populated with a `Project_template` (PARA method) via [Templater](https://github.com/SilentVoid13/Templater). The template includes frontmatter (start date, status, etc.) and sections for goals, tasks, and more.  
   <!-- TODO: add screenshot -->

2. **ModalForms for Task Input**  
   [ModalForms](https://github.com/obsidianmd/obsidian-modal-forms) allows for selecting a project (e.g., "Obsidian") from the `projects` folder and adding tasks efficiently.  
   <!-- TODO: add screenshot -->

3. **QuickAdd + Script to Add Tasks**  
   A [QuickAdd](https://github.com/chhoumann/quickadd) macro (pinned to the Command Palette) executes a custom script that adds tasks to `🏗️ Tasks.md`, prefixed with the project name (e.g., "Obsidian: new tweet…").  
   <!-- TODO: add screenshot -->

4. **Dataview Pulls Tasks into Project Notes**  
   Each project note uses [Dataview](https://github.com/blacksmithgu/obsidian-dataview) to display all tasks (completed or not) related to the project, creating a centralized view.  
   <!-- TODO: add screenshot -->

## Next Steps

- [ ] Add a way to track time spent on tasks automatically.
- [ ] Improve task filtering with more Dataview queries.

## Contributing

Feel free to fork this repo, try the workflow, and share your feedback! Open an issue or submit a pull request with improvements.