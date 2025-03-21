module.exports = async (params) => {
    const modalForm = app.plugins.plugins.modalforms.api;

    // Helper function to format quantity with unit
    const formatQuantity = (quantity) => {
        if (typeof quantity !== 'string') {
            return `${quantity}g`; // Default case for numbers
        }

        // If already has units, return as is
        if (quantity.endsWith('g') || quantity.endsWith('ml')) {
            return quantity;
        }

        // List of terms that shouldn't have 'g' appended
        const noUnitTerms = [
            'large', 'medium', 'small',
            'piece', 'pieces',
            'slice', 'slices',
            'square', 'squares',
            'egg', 'eggs',
            'whole',
            'cup', 'cups',
            'tbsp', 'tsp',
            'tablespoon', 'tablespoons',
            'teaspoon', 'teaspoons'
        ];

        // Check if the quantity contains any of these terms
        if (noUnitTerms.some(term => quantity.toLowerCase().includes(term))) {
            return quantity;
        }

        // If it's just a number or doesn't match any special cases, add 'g'
        return `${quantity}g`;
    };

    // Helper function to generate the dataviewjs code
    const addDataviewJS = (dateStr) => {
        return `\`\`\`dataviewjs
(() => {
// Get current page and nutrition goals
const page = dv.current();
const goals = dv.page("Nutrition Goals");

if (!page.items) {
    dv.paragraph("No food items logged today");
    return;
}

// Helper function for progress bars
function createProgressBar(current, max, color = "#4CAF50") {
    const percentage = max ? Math.min(100, (current / max) * 100) : 0;
    return \`<div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
        <div style="flex:1;background:#eee;height:12px;border-radius:6px;overflow:hidden">
            <div style="width:\${percentage}%;background:\${color};height:100%"></div>
        </div>
        <span style="min-width:100px;text-align:right">\${current.toFixed(1)} / \${max || 'N/A'}</span>
    </div>\`;
}

// Helper function for food item display
function createFoodItem(item) {
    const formattedQuantity = item.quantity;
    return \`<div style="display:flex;justify-content:space-between;padding:8px;margin:4px 0;background:#f5f5f5;border-radius:4px">
        <div style="flex:1">
            <strong>\${item.food}</strong>
            <div style="color:#666;font-size:0.9em">\${formattedQuantity}</div>
        </div>
        <div style="display:flex;gap:16px;color:#666;font-size:0.9em">
            <div>🔥 \${item.calories}</div>
            <div>🥩 \${item.protein}g</div>
            <div>🍚 \${item.carbs}g</div>
            <div>🥑 \${item.fat}g</div>
        </div>
    </div>\`;
}

// Calculate totals
const totals = page.items.reduce((acc, item) => ({
    calories: acc.calories + (item.calories || 0),
    protein: acc.protein + (item.protein || 0),
    carbs: acc.carbs + (item.carbs || 0),
    fat: acc.fat + (item.fat || 0)
}), { calories: 0, protein: 0, carbs: 0, fat: 0 });

dv.header(1, "Food Log ${dateStr}");

// Display food items
dv.header(2, "Today's Meals");
for (const item of page.items) {
    dv.paragraph(createFoodItem(item));
}

// Display progress
dv.header(2, "Nutrition Progress");
const progressHtml = \`
<div style="padding:12px;background:#fff;border-radius:8px;margin:12px 0;">
    <div style="margin-bottom:16px;">
        <div style="color:#666;margin-bottom:4px">Calories</div>
        \${createProgressBar(totals.calories, goals?.calories, "#FF9800")}
    </div>
    <div style="margin-bottom:16px;">
        <div style="color:#666;margin-bottom:4px">Protein (g)</div>
        \${createProgressBar(totals.protein, goals?.protein, "#4CAF50")}
    </div>
    <div style="margin-bottom:16px;">
        <div style="color:#666;margin-bottom:4px">Carbs (g)</div>
        \${createProgressBar(totals.carbs, goals?.carbs, "#2196F3")}
    </div>
    <div style="margin-bottom:16px;">
        <div style="color:#666;margin-bottom:4px">Fat (g)</div>
        \${createProgressBar(totals.fat, goals?.fat, "#F44336")}
    </div>
</div>\`;

dv.paragraph(progressHtml);
})();
\`\`\``;
    };

    // Helper function to parse macro values from Claude's response
    const parseMacros = (content) => {
        try {
            // Try to parse the entire content as JSON first
            return JSON.parse(content);
        } catch (e) {
            console.error('Failed to parse direct JSON, trying to extract JSON:', e);
            try {
                // Try to find JSON in the content
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (e2) {
                console.error('Failed to parse extracted JSON:', e2);
                return { items: [] };
            }
        }
    };

    // Helper function to format an item for YAML
    const formatItemForYaml = (item) => {
        // Use the same formatting logic for consistency
        const formattedQuantity = formatQuantity(item.quantity);
            
        return `  - food: "${item.food}"
    quantity: "${formattedQuantity}"
    calories: ${item.calories}
    protein: ${item.protein}
    carbs: ${item.carbs}
    fat: ${item.fat}`;
    };

    // Helper function to parse YAML items array
    const parseYamlItems = (yamlContent) => {
        const items = [];
        // Find the items section
        const itemsMatch = yamlContent.match(/items:\n([\s\S]*?)(?=\n\w|$)/);
        
        if (!itemsMatch) return items;
        
        const itemsSection = itemsMatch[1];
        const itemBlocks = itemsSection.split(/\n  -/).filter(Boolean);
        
        for (const block of itemBlocks) {
            try {
                const foodMatch = block.match(/food: "([^"]+)"/);
                const quantityMatch = block.match(/quantity: "([^"]+)"/);
                const caloriesMatch = block.match(/calories: (\d+)/);
                const proteinMatch = block.match(/protein: (\d+)/);
                const carbsMatch = block.match(/carbs: (\d+)/);
                const fatMatch = block.match(/fat: (\d+)/);

                if (foodMatch && quantityMatch && caloriesMatch && proteinMatch && carbsMatch && fatMatch) {
                    items.push({
                        food: foodMatch[1],
                        quantity: quantityMatch[1],
                        calories: parseInt(caloriesMatch[1]),
                        protein: parseInt(proteinMatch[1]),
                        carbs: parseInt(carbsMatch[1]),
                        fat: parseInt(fatMatch[1])
                    });
                }
            } catch (e) {
                console.error('Error parsing item block:', e);
            }
        }
        
        return items;
    };

    // Helper function to update frontmatter
    const updateFrontmatter = async (existingContent, newMacros, dateStr) => {
        let items = [];

        // Parse existing frontmatter if it exists
        const fmMatch = existingContent.match(/^---\n([\s\S]*?)\n---/);
        if (fmMatch) {
            const existingFm = fmMatch[1];
            console.log("Existing frontmatter:", existingFm);
            items = parseYamlItems(existingFm);
            console.log("Parsed existing items:", items);
        }

        // Add new items to the array
        if (newMacros.items) {
            items = [...items, ...newMacros.items];
        }

        console.log("Final frontmatter items:", items);

        // Generate new frontmatter string with dataviewjs
        const newContent = `---
items:
${items.map(formatItemForYaml).join('\n')}
---

${addDataviewJS(dateStr)}`;

        // Replace existing content or return new content
        if (fmMatch) {
            // Replace everything in the file
            return newContent;
        }
        return newContent;
    };

    const result = await modalForm.openForm('add-food');

    if (result) {
        const food = result['snack(s)']?.value;
        const imageFile = result['image']?.value;
        
        if (!food && !imageFile) {
            new Notice('Please enter either a food item or upload an image');
            return;
        }

        console.log('Food:', food);
        console.log('Image file:', imageFile);

        // Get the full path for the image if it exists
        let imageUrl;
        if (imageFile) {
            try {
                // Get the file contents as an ArrayBuffer
                const buffer = await app.vault.readBinary(imageFile);
                // Convert ArrayBuffer to Base64
                const base64 = arrayBufferToBase64(buffer);
                // Get MIME type based on file extension
                const mimeType = getMimeType(imageFile.extension);
                // Create data URL
                imageUrl = `data:${mimeType};base64,${base64}`;
                console.log('Image processed successfully');
            } catch (error) {
                console.error('Error processing image:', error);
                new Notice('Error processing image. Please try again.');
                return;
            }
        }

        // Helper function to convert ArrayBuffer to Base64
        function arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

        // Helper function to get MIME type
        function getMimeType(extension) {
            const mimeTypes = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp'
            };
            return mimeTypes[extension.toLowerCase()] || 'image/jpeg';
        }
        
        // Prepare the API request
        const requestBody = {
            model: 'google/gemini-2.0-flash-001:web',
            messages: [
                {
                    role: 'system',
                    content: `You are a precise macro calculator that validates nutritional information through web searches.

HANDLING COMBINED IMAGE AND TEXT:
When both image and text are provided:
1. First identify the food item(s) from the image
2. Use the text input to determine exact quantities or portions
3. Example scenarios:
   - Image: chocolate bar + Text: "4 squares" → Calculate for exactly 4 squares
   - Image: plate of pasta + Text: "half portion" → Calculate for half of what you see
   - Image: mixed nuts + Text: "30g" → Use the specified 30g measurement
4. Always use the text input as the primary source for quantity/portion size

For IMAGES ONLY (no text):
1. Describe what you see in detail (type of food, apparent serving size)
2. Estimate quantities using standard serving sizes
3. Note any assumptions about portions

For TEXT ONLY (no image):
1. Parse each item separately (split by commas, newlines, "and", or context)
2. Extract both quantity and food name
3. If quantity is missing, use standard serving size

NUTRITIONAL CALCULATIONS:
1. First identify the exact food item (brand if visible in image)
2. Perform web search to find accurate nutritional data
3. For branded items: use official nutritional information
4. For generic items: use USDA database
5. Scale values based on specified quantity
6. Always show calculation method in description

ALWAYS:
- Convert all measurements to metric (g or ml)
- Show your sources and calculations
- Explain any assumptions
- Use ranges if uncertain (e.g., "estimated 100-120g portion")

Return your response in this exact format:
{
    "description": "Detailed description including:
    - What you see (for images)
    - How text input was applied
    - Sources used for nutrition data
    - Calculations performed
    - Any assumptions made",
    "items": [
        {
            "food": "item name (include brand if known)",
            "quantity": "quantity in g or ml",
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number
        }
    ]
}`
                },
                {
                    role: 'user',
                    content: [
                        ...(imageUrl ? [{ 
                            type: 'image_url', 
                            image_url: { url: imageUrl } 
                        }] : []),
                        ...(food ? [{ 
                            type: 'text', 
                            text: food 
                        }] : [])
                    ]
                }
            ]
        };

        // Helper function to make API call with retries
        async function makeApiCallWithRetry(requestBody, maxRetries = 3) {
            let lastError;
            
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer $OPENROUTER_API_KEY',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    if (!data.choices?.[0]?.message?.content) {
                        throw new Error('Invalid response format from API');
                    }

                    return data;
                } catch (error) {
                    console.error(`API call attempt ${attempt} failed:`, error);
                    lastError = error;
                    
                    // If this is an SSL error, wait a bit longer
                    const waitTime = error.message.includes('SSL') ? 2000 : 1000;
                    
                    if (attempt < maxRetries) {
                        new Notice(`API call failed, retrying... (${attempt}/${maxRetries})`);
                        await new Promise(resolve => setTimeout(resolve, waitTime * attempt));
                    }
                }
            }

            throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
        }

        console.log('Sending request with:', {
            hasImage: !!imageUrl,
            textInput: food || 'none',
            combinedInput: !!(imageUrl && food)
        });

        try {
            // Make API call with retry logic
            const data = await makeApiCallWithRetry(requestBody);
            const macroAnalysis = data.choices[0].message.content;
            console.log("API Response:", macroAnalysis);
            const macros = parseMacros(macroAnalysis);
            console.log("Parsed macros:", macros);

            if (!macros.items || macros.items.length === 0) {
                throw new Error('No food items were parsed from the response');
            }

            // Create food log directory if it doesn't exist
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            const folderPath = 'food/log';
            const filePath = `${folderPath}/${dateStr}.md`;

            try {
                // Ensure directory exists
                if (!app.vault.getAbstractFileByPath(folderPath)) {
                    await app.vault.createFolder(folderPath);
                }

                let existingContent = '';
                const existingFile = app.vault.getAbstractFileByPath(filePath);
                
                if (existingFile) {
                    existingContent = await app.vault.read(existingFile);
                    const updatedContent = await updateFrontmatter(existingContent, macros, dateStr);
                    await app.vault.modify(existingFile, updatedContent);
                } else {
                    const initialContent = `---
items:
${macros.items ? macros.items.map(formatItemForYaml).join('\n') : ''}
---

${addDataviewJS(dateStr)}`;
                    await app.vault.create(filePath, initialContent);
                }

                // Open the file
                const file = app.vault.getAbstractFileByPath(filePath);
                if (file) {
                    const leaf = app.workspace.getLeaf();
                    await leaf.openFile(file);
                } else {
                    new Notice('File created but not found in vault. Please refresh Obsidian.');
                }

            } catch (error) {
                console.error('Error updating food log:', error);
                new Notice('Error updating food log: ' + error.message);
            }
        } catch (error) {
            console.error('Error processing API response:', error);
            new Notice('Error processing API response: ' + error.message);
        }
    }
}