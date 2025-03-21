# Calorie Tracking Workflow in Obsidian 🥗

## Overview

When my [MacroFactor](https://macrofactorapp.com/) subscription ended, I decided to build a custom calorie-tracking workflow in [Obsidian](https://obsidian.md/). This project leverages Obsidian’s flexibility, along with plugins and AI, to log food, calculate macros/calories, and visualize progress—all within my vault. Follow the journey on Twitter at [@VaultEvolving](https://twitter.com/VaultEvolving)!

## How It Works

Here’s the step-by-step flow of the calorie-tracking system:

1. **ModalForms for Input**  
   I use the [ModalForms](https://github.com/danielo515/obsidian-modal-form) plugin to create a form for adding food. I can input food / the portion size via text (e.g., "snack") or upload an image of what I’m eating.  
   ![ModalForms Input](path/to/modalforms-screenshot.png)

2. **QuickAdd Triggers the Script**  
   The [QuickAdd](https://github.com/chhoumann/quickadd) plugin ties the process to Obsidian’s command palette. I run the `addFood` command to trigger a custom script.  
   ![QuickAdd Command](path/to/quickadd-screenshot.png)

3. **Script Pulls Data via LLM**  
   A custom script uses [OpenRouter API](https://openrouter.ai/), particularly Gemini 2.0 Flash, to calculate calories and macros from the input (text or image). It then updates the frontmatter of a new or existing daily log note with the data.

4. **Dataview Visualizes the Data**  
   The [Dataview](https://github.com/blacksmithgu/obsidian-dataview) plugin reads the frontmatter to display food items and calorie totals in a daily log. I also use it to visualize nutrition progress over time.  
   ![Daily Log](path/to/food-log-screenshot.png)  
   ![Nutrition Progress](path/to/progress-bars-screenshot.png)

## Tools Used

- **Obsidian**: The core app for note-taking and data management.
- **ModalForms**: For creating input forms.
- **QuickAdd**: For triggering scripts via the command palette.
- **Gemini Flash 2.0**: An LLM to calculate calories and macros from text or images.
- **Dataview**: For querying and visualizing data from frontmatter.

## Setup Instructions

1. Install the required plugins in Obsidian: ModalForms, QuickAdd, and Dataview.
2. Set up a ModalForms form for food input (see script details below).
3. Configure QuickAdd with a custom `addFood` command to run the script.
4. Add the script to call Gemini Flash 2.0 and update note frontmatter (script available in this repo).
5. Use Dataview to query and display your food logs and progress.

Detailed script and setup instructions are in the [`feat/calories-tracker` branch](https://github.com/rnaidenov/VaultEvolving/tree/feat/calories-tracker).


## Next Steps

- [ ] Add remaining calories view

## Contributing

Feel free to fork this repo, try the workflow, and share your feedback! Open an issue or submit a pull request with improvements.