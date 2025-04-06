
```dataviewjs
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
    return `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
        <div style="flex:1;background:#eee;height:12px;border-radius:6px;overflow:hidden">
            <div style="width:${percentage}%;background:${color};height:100%"></div>
        </div>
        <span style="min-width:100px;text-align:right">${current.toFixed(1)} / ${max || 'N/A'}</span>
    </div>`;
}

// Helper function for food item display
function createFoodItem(item) {
    return `<div style="display:flex;justify-content:space-between;padding:8px;margin:4px 0;background:#f5f5f5;border-radius:4px">
        <div style="flex:1">
            <strong>${item.food}</strong>
            <div style="color:#666;font-size:0.9em">${item.quantity}</div>
        </div>
        <div style="display:flex;gap:16px;color:#666;font-size:0.9em">
            <div>🔥 ${item.calories}</div>
            <div>🥩 ${item.protein}g</div>
            <div>🍚 ${item.carbs}g</div>
            <div>🥑 ${item.fat}g</div>
        </div>
    </div>`;
}

// Calculate totals
const totals = page.items.reduce((acc, item) => ({
    calories: acc.calories + (item.calories || 0),
    protein: acc.protein + (item.protein || 0),
    carbs: acc.carbs + (item.carbs || 0),
    fat: acc.fat + (item.fat || 0)
}), { calories: 0, protein: 0, carbs: 0, fat: 0 });

dv.header(1, "Food Log 2025-03-17");

// Display food items
dv.header(2, "Today's Meals");
for (const item of page.items) {
    dv.paragraph(createFoodItem(item));
}

// Display progress
dv.header(2, "Nutrition Progress");
const progressHtml = `
<div style="padding:12px;background:#fff;border-radius:8px;margin:12px 0;">
    <div style="margin-bottom:16px;">
        <div style="color:#666;margin-bottom:4px">Calories</div>
        ${createProgressBar(totals.calories, goals?.calories, "#FF9800")}
    </div>
    <div style="margin-bottom:16px;">
        <div style="color:#666;margin-bottom:4px">Protein</div>
        ${createProgressBar(totals.protein, goals?.protein, "#4CAF50")}
    </div>
    <div style="margin-bottom:16px;">
        <div style="color:#666;margin-bottom:4px">Carbs</div>
        ${createProgressBar(totals.carbs, goals?.carbs, "#2196F3")}
    </div>
    <div style="margin-bottom:16px;">
        <div style="color:#666;margin-bottom:4px">Fat</div>
        ${createProgressBar(totals.fat, goals?.fat, "#F44336")}
    </div>
</div>`;

dv.paragraph(progressHtml);
})();
