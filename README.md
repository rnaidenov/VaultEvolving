# Calorie Tracking Workflow in Obsidian 🥗

## Overview

When my [MacroFactor](https://macrofactorapp.com/) subscription ended, I decided to build a custom calorie-tracking workflow in [Obsidian](https://obsidian.md/). This project leverages Obsidian’s flexibility, along with plugins and AI, to log food, calculate macros/calories, and visualize progress—all within my vault. Follow the journey on Twitter at [@VaultEvolving](https://twitter.com/VaultEvolving)!

## How It Works

Here’s the step-by-step flow of the calorie-tracking system:

<img width="592" alt="obsidian" src="https://github.com/user-attachments/assets/50065de3-0a32-40e2-81d4-4ff223e0cd36" />


1. **ModalForms for Input**  
   I use the [ModalForms](https://github.com/danielo515/obsidian-modal-form) plugin to create a form for adding food. I can input food / the portion size via text (e.g., "snack") or upload an image of what I’m eating.  
<img width="673" alt="Template" src="https://github.com/user-attachments/assets/de24a1bf-95e0-421e-8187-507b4ebdaae3" />
<img width="604" alt="Description" src="https://github.com/user-attachments/assets/f00af1c2-a6fc-4d48-b8f9-033f0db81154" />



2. **QuickAdd Triggers the Script**  
   The [QuickAdd](https://github.com/chhoumann/quickadd) plugin ties the process to Obsidian’s command palette. I run the `addFood` command to trigger a custom script.

<img width="599" alt="image" src="https://github.com/user-attachments/assets/47167c7e-eddc-493f-b97c-662bd1005111" />


   <img width="534" alt="Food Log 2025-03-18" src="https://github.com/user-attachments/assets/fb8b33d1-a357-45e6-a038-0fa17405d4c3" />
   <img width="609" alt="add food" src="https://github.com/user-attachments/assets/9d8a0c78-34f4-42c0-b954-7e7672e20fad" />


4. **Script Pulls Data via LLM**  
   A custom script uses [OpenRouter API](https://openrouter.ai/), particularly Gemini 2.0 Flash, to calculate calories and macros from the input (text or image). It then updates the frontmatter of a new or existing daily log note with the data.

5. **Dataview Visualizes the Data**  
   The [Dataview](https://github.com/blacksmithgu/obsidian-dataview) plugin reads the frontmatter to display food items and calorie totals in a daily log. I also use it to visualize nutrition progress over time.

<img width="553" alt="image" src="https://github.com/user-attachments/assets/38e1c080-50a8-4917-aeda-96a82b8174b7" />

<img width="534" alt="Food Log 2025-03-18" src="https://github.com/user-attachments/assets/adc88f0f-c1e4-4fa3-abfd-68f1b0163244" />

   
## Tools Used

- **Obsidian**: The core app for note-taking and data management.
- **ModalForms**: For creating input forms.
- **QuickAdd**: For triggering scripts via the command palette.
- **Gemini Flash 2.0**: An LLM to calculate calories and macros from text or images.
- **Dataview**: For querying and visualizing data from frontmatter.

## Setup Instructions

1. Install the required plugins in Obsidian: ModalForms, QuickAdd, and Dataview.
2. Set up a ModalForms form for food input 
3. Configure an `addFood` macro using QuickAdd. Set up the macro to use the `addFood` script you see in the files. 
4. The rest should be handled by the script - it just needs your input (;

## Next Steps

- [ ] Add remaining calories view

## Contributing

Feel free to fork this repo, try the workflow, and share your feedback! Open an issue or submit a pull request with improvements.
