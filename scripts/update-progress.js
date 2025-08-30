#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TASK_FILE = path.join(__dirname, '../task.md');
const LOG_FILE = path.join(__dirname, '../work-log.md');

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

function updateProgressTracker() {
  try {
    const taskContent = fs.readFileSync(TASK_FILE, 'utf8');
    
    // Count tasks by day
    const dayProgress = {};
    
    // Initialize days
    for (let i = 1; i <= 14; i++) {
      dayProgress[i] = { total: 0, completed: 0 };
    }
    
    // Count tasks
    const taskRegex = /#### Task (\d+)\.(\d+):[^]*?\*\*Status\*\*: \[([ x])\]/g;
    let match;
    
    while ((match = taskRegex.exec(taskContent)) !== null) {
      const day = parseInt(match[1]);
      const isCompleted = match[3] === 'x';
      
      if (dayProgress[day]) {
        dayProgress[day].total++;
        if (isCompleted) {
          dayProgress[day].completed++;
        }
      }
    }
    
    // Generate progress report
    console.log(`\n${colors.blue}📊 Aether Development Progress${colors.reset}`);
    console.log('═'.repeat(50));
    
    let totalCompleted = 0;
    let totalTasks = 0;
    
    for (let day = 1; day <= 14; day++) {
      if (dayProgress[day].total > 0) {
        const progress = dayProgress[day];
        totalCompleted += progress.completed;
        totalTasks += progress.total;
        
        const percentage = Math.round((progress.completed / progress.total) * 100);
        const status = percentage === 100 ? '✅' : percentage > 0 ? '🔄' : '⏸️';
        const barLength = 20;
        const filled = Math.round((percentage / 100) * barLength);
        const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
        
        let color = colors.reset;
        if (percentage === 100) color = colors.green;
        else if (percentage > 0) color = colors.yellow;
        
        console.log(`Day ${day.toString().padStart(2)}: ${color}${bar}${colors.reset} ${progress.completed}/${progress.total} ${status} (${percentage}%)`);
      }
    }
    
    console.log('═'.repeat(50));
    
    const overallPercentage = Math.round((totalCompleted / totalTasks) * 100);
    console.log(`${colors.blue}Overall Progress:${colors.reset} ${totalCompleted}/${totalTasks} tasks (${overallPercentage}%)`);
    
    // Update progress tracker in task.md
    let updatedContent = taskContent;
    const trackerRegex = /- \*\*Tasks Completed\*\*: \[ \] ___\/84/;
    updatedContent = updatedContent.replace(trackerRegex, `- **Tasks Completed**: [${totalCompleted}] ${totalCompleted}/84`);
    
    // Update current day
    const currentDay = Math.ceil(totalCompleted / 6) || 1;
    const dayRegex = /- \*\*Current Day\*\*: \[ \] Day ___\/14/;
    updatedContent = updatedContent.replace(dayRegex, `- **Current Day**: [${currentDay}] Day ${currentDay}/14`);
    
    fs.writeFileSync(TASK_FILE, updatedContent);
    
    // Generate summary for work-log
    const summary = `
## 📊 Progress Update - ${new Date().toLocaleString()}
- Total Tasks Completed: ${totalCompleted}/${totalTasks}
- Overall Progress: ${overallPercentage}%
- Current Status: ${overallPercentage === 100 ? '✅ Complete!' : '🔄 In Progress'}
`;
    
    fs.appendFileSync(LOG_FILE, summary);
    
    console.log(`\n${colors.green}✅ Progress tracker updated successfully!${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Error updating progress:${colors.reset}`, error.message);
  }
}

// Run the update
updateProgressTracker();
