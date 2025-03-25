module.exports = async (params) => {
  try {
    const modalForm = app.plugins.plugins.modalforms.api;
    const result = await modalForm.openForm('new-task');

    if (result) {
      const project = result['project'].value;
      const task = result['task'].value;
      
      let output = '';
      if (project) {
        output = `- [ ] ${project}: ${task}`;
      } else {
        output = `- [ ] ${task}`;
      }

      const tasksNotePath = 'todo/🏗️ Tasks.md';
      const tasksNote = app.vault.getAbstractFileByPath(tasksNotePath);
      
      if (tasksNote) {
        const content = await app.vault.read(tasksNote);
        const newContent = output + '\n' + content;
        await app.vault.modify(tasksNote, newContent);
        new Notice('Task added successfully');
        await app.workspace.openLinkText(tasksNotePath, '');
      }
    }
  } catch (error) {
    console.error('Error adding task:', error);
    new Notice('Error adding task: ' + error.message);
  }
}