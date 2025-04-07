module.exports = async (params) => {
    try {
      const modalForm = app.plugins.plugins.modalforms.api;
      const result = await modalForm.openForm('add-exercise');
  
      if (result) {
        const muscleGroup = result['muscle group'].value;
        const exercise = result.exercise.value;
        const sets = result.sets.value;
        const maxReps = result['max reps'].value;
        const maxWeight = result['max weight'].value;
        const duration = result.duration.value;
        const isDone = result.done.value;
  
        // Get current date and time
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        const WORKOUT_FOLDER = 'tracker/health/workouts/gym/sessions';
  
        // Define path to today's workout note
        const dailyNotePath = `${WORKOUT_FOLDER}/${dateStr}.md`;
        
        const newExercise = {
          name: exercise,
          category: muscleGroup,
          sets: sets || 0,
          max_weight: maxWeight ? `${maxWeight} kg` : 'Bodyweight',
          max_reps: maxReps || '',
          duration: duration || 0,
          done: isDone || false,
          session: timeStr
        };
        
        // Check if the file exists
        let dailyNote;
        try {
          dailyNote = app.vault.getAbstractFileByPath(dailyNotePath);
        } catch (e) {
          // File doesn't exist
        }
  
        if (dailyNote) {
          // File exists, update frontmatter
          const fileContent = await app.vault.read(dailyNote);
          
          // Check if the file has proper frontmatter structure
          const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          
          if (frontmatterMatch) {
            try {
              // Extract the YAML frontmatter and content
              const yamlText = frontmatterMatch[1];
              const contentWithoutFrontmatter = frontmatterMatch[2];
              
              // Parse existing exercises from frontmatter
              let frontmatter = { date: dateStr, exercises: [] };
              const lines = yamlText.split('\n');
              
              let i = 0;
              while (i < lines.length) {
                const line = lines[i].trim();
                if (line.startsWith('exercises:')) {
                  i++;
                  while (i < lines.length) {
                    if (lines[i].trim().startsWith('- name:')) {
                      const exercise = {};
                      const nameLine = lines[i].trim();
                      exercise.name = nameLine.substring(nameLine.indexOf('"')).replace(/"/g, '').trim();
                      
                      // Get category
                      i++;
                      if (i < lines.length && lines[i].trim().startsWith('category:')) {
                        const categoryLine = lines[i].trim();
                        exercise.category = categoryLine.substring(categoryLine.indexOf('"')).replace(/"/g, '').trim();
                      }
                      
                      // Get sets
                      i++;
                      if (i < lines.length && lines[i].trim().startsWith('sets:')) {
                        const setsLine = lines[i].trim();
                        exercise.sets = parseInt(setsLine.substring(setsLine.indexOf(':') + 1).trim());
                      }
                      
                      // Get max_weight
                      i++;
                      if (i < lines.length && lines[i].trim().startsWith('max_weight:')) {
                        const weightLine = lines[i].trim();
                        exercise.max_weight = weightLine.substring(weightLine.indexOf('"')).replace(/"/g, '').trim();
                      }
                      
                      // Get max_reps
                      i++;
                      if (i < lines.length && lines[i].trim().startsWith('max_reps:')) {
                        const repsLine = lines[i].trim();
                        exercise.max_reps = repsLine.substring(repsLine.indexOf('"')).replace(/"/g, '').trim();
                      }
                      
                      // Get duration
                      i++;
                      if (i < lines.length && lines[i].trim().startsWith('duration:')) {
                        const durationLine = lines[i].trim();
                        exercise.duration = parseInt(durationLine.substring(durationLine.indexOf(':') + 1).trim()) || 0;
                      }
                      
                      // Get done
                      i++;
                      if (i < lines.length && lines[i].trim().startsWith('done:')) {
                        const doneLine = lines[i].trim();
                        exercise.done = doneLine.substring(doneLine.indexOf('"')).replace(/"/g, '').trim();
                      }
                      
                      // Get session
                      i++;
                      if (i < lines.length && lines[i].trim().startsWith('session:')) {
                        const sessionLine = lines[i].trim();
                        exercise.session = sessionLine.substring(sessionLine.indexOf('"')).replace(/"/g, '').trim();
                      }
                      
                      frontmatter.exercises.push(exercise);
                    } else if (!lines[i].trim().startsWith('  ')) {
                      // No longer in the exercises section
                      break;
                    }
                    i++;
                  }
                } else {
                  i++;
                }
              }
              
              // Check if we need to create a new session based on time difference
              let lastSessionTime = null;
              if (frontmatter.exercises.length > 0) {
                lastSessionTime = frontmatter.exercises[frontmatter.exercises.length - 1].session;
                
                // Parse times to compare
                const [lastHour, lastMinute] = lastSessionTime.split(':').map(Number);
                const [currentHour, currentMinute] = timeStr.split(':').map(Number);
                
                // Calculate time difference in minutes
                const lastTimeInMinutes = lastHour * 60 + lastMinute;
                const currentTimeInMinutes = currentHour * 60 + currentMinute;
                const timeDiffInMinutes = currentTimeInMinutes - lastTimeInMinutes;
                
                // If less than 2 hours difference, use the same session time
                if (timeDiffInMinutes < 120 && timeDiffInMinutes >= 0) {
                  newExercise.session = lastSessionTime;
                }
              }
              
              // Add the new exercise
              frontmatter.exercises.push(newExercise);
              
              // Generate the new frontmatter YAML
              let newFrontmatter = '---\n';
              newFrontmatter += `date: ${frontmatter.date}\n`;
              newFrontmatter += `tags: workouts/gym\n`;
              newFrontmatter += 'exercises:\n';
              
              for (const exercise of frontmatter.exercises) {
                newFrontmatter += `  - name: "${exercise.name}"\n`;
                newFrontmatter += `    category: "${exercise.category}"\n`;
                newFrontmatter += `    sets: ${exercise.sets}\n`;
                newFrontmatter += `    max_weight: "${exercise.max_weight}"\n`;
                newFrontmatter += `    max_reps: "${exercise.max_reps}"\n`;
                newFrontmatter += `    duration: ${exercise.duration}\n`;
                newFrontmatter += `    done: "${exercise.done}"\n`;
                newFrontmatter += `    session: "${exercise.session}"\n`;
              }
              
              newFrontmatter += '---\n';
              
              // Combine the new frontmatter with the existing content
              const updatedContent = newFrontmatter + contentWithoutFrontmatter;
              
              await app.vault.modify(dailyNote, updatedContent);
            } catch (e) {
              console.error("Error parsing frontmatter:", e);
              // If there's an error parsing, create a new frontmatter
              await createNewFrontmatter();
            }
          } else {
            // No proper frontmatter found, create new
            await createNewFrontmatter();
          }
          
          // Helper function to create new frontmatter
          async function createNewFrontmatter() {
            let newContent = '---\n';
            newContent += `date: ${dateStr}\n`;
            newContent += 'tags: workouts/gym\n';
            newContent += 'exercises:\n';
            newContent += `  - name: "${newExercise.name}"\n`;
            newContent += `    category: "${newExercise.category}"\n`;
            newContent += `    sets: ${newExercise.sets}\n`;
            newContent += `    max_weight: "${newExercise.max_weight}"\n`;
            newContent += `    max_reps: "${newExercise.max_reps}"\n`;
            newContent += `    duration: ${newExercise.duration}\n`;
            newContent += `    done: "${newExercise.done}"\n`;
            newContent += `    session: "${newExercise.session}"\n`;
            newContent += '---\n\n';
            
            // If there was existing content, preserve it
            if (fileContent && !fileContent.startsWith('---')) {
              newContent += fileContent;
            } else {
              newContent += `# Workout ${dateStr}\n`;
            }
            
            await app.vault.modify(dailyNote, newContent);
          }
        } else {
          // File doesn't exist, create it with frontmatter
          try {
            // Check if folders exist before creating them
            const workoutsFolder = app.vault.getAbstractFileByPath("workouts");
            if (!workoutsFolder) {
              console.log("Creating workouts folder");
              await app.vault.createFolder("workouts");
            } else {
              console.log("workouts folder already exists");
            }
            
            const gymFolder = app.vault.getAbstractFileByPath("tracker/health/workouts/gym");
            if (!gymFolder) {
              console.log("Creating tracker/health/workouts/gym folder");
              await app.vault.createFolder("tracker/health/workouts/gym");
            } else {
              console.log("tracker/health/workouts/gym folder already exists");
            }
            
          // Create frontmatter for the new file
            let newContent = '---\n';
            newContent += `date: ${dateStr}\n`;
            newContent += 'tags: workouts/gym\n';
            newContent += 'exercises:\n';
            newContent += `  - name: "${newExercise.name}"\n`;
            newContent += `    category: "${newExercise.category}"\n`;
            newContent += `    sets: ${newExercise.sets}\n`;
            newContent += `    max_weight: "${newExercise.max_weight}"\n`;
            newContent += `    max_reps: "${newExercise.max_reps}"\n`;
            newContent += `    duration: ${newExercise.duration}\n`;
            newContent += `    done: "${newExercise.done}"\n`;
            newContent += `    session: "${newExercise.session}"\n`;
            newContent += '---\n\n';
            newContent += "\`\`\`dataviewjs\n";
            newContent += "// Get current file and its exercises\n";
            newContent += "const currentFile = dv.current();\n";
            newContent += "const exercises = currentFile.exercises || [];\n\n";
            newContent += "if (exercises.length > 0) {\n";
            newContent += "  // Group exercises by session\n";
            newContent += "  const sessionGroups = {};\n\n";
            newContent += "  exercises.forEach(ex => {\n";
            newContent += "    if (!sessionGroups[ex.session]) {\n";
            newContent += "      sessionGroups[ex.session] = {};\n";
            newContent += "    }\n\n";
            newContent += "    if (!sessionGroups[ex.session][ex.category]) {\n";
            newContent += "      sessionGroups[ex.session][ex.category] = [];\n";
            newContent += "    }\n\n";
            newContent += "    sessionGroups[ex.session][ex.category].push(ex);\n";
            newContent += "  });\n\n";
            newContent += "  // Sort sessions\n";
            newContent += "  const sortedSessions = Object.keys(sessionGroups).sort();\n\n";
            newContent += "  // Output formatted list\n";
            newContent += "  let output = \"\";\n\n";
            newContent += "  sortedSessions.forEach(session => {\n";
            newContent += "    output += `## Session @ ${session}\\n\\n`;\n\n";
            newContent += "    const categories = Object.keys(sessionGroups[session]).sort();\n\n";
            newContent += "    categories.forEach(category => {\n";
            newContent += "      output += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\\n\\n`;\n\n";
            newContent += "      sessionGroups[session][category].forEach(ex => {\n";
            newContent += "        let exerciseDetails = `\\n* ${ex.name} - ${ex.sets > 0 ? ex.sets + ' sets' : ''}`;\n\n";
            newContent += "        if (ex.max_weight) {\n";
            newContent += "            exerciseDetails += ` at ${ex.max_weight}`;\n";
            newContent += "        }\n\n";
            newContent += "        if (ex.max_reps) {\n";
            newContent += "            exerciseDetails += ` for ${ex.max_reps} reps`;\n";
            newContent += "        } else if (ex.duration > 0) {\n";
            newContent += "            exerciseDetails += ` for ${ex.duration} min`;\n";
            newContent += "        }\n\n";
            newContent += "        output += exerciseDetails;\n";
            newContent += "      });\n\n";
            newContent += "      output += \"\\n\";\n";
            newContent += "    });\n";
            newContent += "  });\n\n";
            newContent += "  dv.paragraph(output);\n";
            newContent += "} else {\n";
            newContent += "  dv.paragraph(\"No exercises found\");\n";
            newContent += "}\n";
            newContent += "\`\`\`\n";
            
            await app.vault.create(dailyNotePath, newContent);
          } catch (error) {
            console.error('Error creating workout file:', error);
            new Notice(`Error creating workout file: ${error.message}`);
          }
        }
        
        // Show notification
        new Notice(`Added ${exercise} to today's workout`);
        
        // Open the workout note
        const dailyNoteFile = app.vault.getAbstractFileByPath(dailyNotePath);
        if (dailyNoteFile) {
          app.workspace.getLeaf().openFile(dailyNoteFile);
        }
        
        // Return success message instead of undefined 'output' variable
        return `Successfully added ${exercise} to workout.`;
      } else {
        return "Form cancelled or no data entered.";
      }
    } catch (error) {
      console.error("Error in fetchExercises:", error);
      new Notice(`Error: ${error.message}`);
      return `Error: ${error.message}`;
    }
  };
  