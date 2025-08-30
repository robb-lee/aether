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
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
};

function generateDailySummary() {
  try {
    const taskContent = fs.readFileSync(TASK_FILE, 'utf8');
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    // Count today's completed tasks
    const completedToday = [];
    const blockedTasks = [];
    const inProgressTasks = [];
    
    // Parse tasks to find today's work
    const taskRegex = /#### Task (\d+\.\d+): ([^\n]*)[^]*?\*\*Status\*\*: \[([ x])\]([^]*?\*\*Actual Time\*\*: ([^\n]*))?/g;
    let match;
    
    while ((match = taskRegex.exec(taskContent)) !== null) {
      const taskNum = match[1];
      const taskName = match[2];
      const status = match[3];
      const actualTime = match[5] || 'N/A';
      
      if (status === 'x') {
        completedToday.push({ num: taskNum, name: taskName, time: actualTime });
      }
    }
    
    // Find in-progress tasks
    const inProgressRegex = /#### Task (\d+\.\d+): ([^\n]*)[^]*?🔄 In Progress/g;
    while ((match = inProgressRegex.exec(taskContent)) !== null) {
      inProgressTasks.push({ num: match[1], name: match[2] });
    }
    
    // Find blocked tasks
    const blockedRegex = /#### Task (\d+\.\d+): ([^\n]*)[^]*?❌ Blocked/g;
    while ((match = blockedRegex.exec(taskContent)) !== null) {
      blockedTasks.push({ num: match[1], name: match[2] });
    }
    
    // Calculate total time spent
    let totalMinutes = 0;
    completedToday.forEach(task => {
      const timeMatch = task.time.match(/(\d+)min/);
      if (timeMatch) {
        totalMinutes += parseInt(timeMatch[1]);
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalTime = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    
    // Generate summary
    const summary = `
${'='.repeat(60)}
## 📅 Daily Summary - ${date} ${time}
${'='.repeat(60)}

### ✅ Tasks Completed Today (${completedToday.length})
${completedToday.length > 0 ? completedToday.map(t => 
  `- [x] Task ${t.num}: ${t.name} (${t.time})`
).join('\n') : '- No tasks completed yet'}

### 🔄 In Progress (${inProgressTasks.length})
${inProgressTasks.length > 0 ? inProgressTasks.map(t => 
  `- [ ] Task ${t.num}: ${t.name}`
).join('\n') : '- No tasks in progress'}

### ❌ Blocked Tasks (${blockedTasks.length})
${blockedTasks.length > 0 ? blockedTasks.map(t => 
  `- [ ] Task ${t.num}: ${t.name}`
).join('\n') : '- No blocked tasks'}

### 📊 Statistics
- **Total Time Spent**: ${totalTime}
- **Tasks Completed**: ${completedToday.length}
- **Average Time per Task**: ${completedToday.length > 0 ? Math.round(totalMinutes / completedToday.length) : 0}min
- **Productivity Score**: ${completedToday.length >= 4 ? '🔥 Excellent!' : completedToday.length >= 2 ? '👍 Good' : '💪 Keep going!'}

### 💭 Notes for Tomorrow
- [ ] Review any blocked tasks
- [ ] Continue with next priority tasks
- [ ] Update documentation

${'='.repeat(60)}
`;
    
    // Append to work-log.md
    fs.appendFileSync(LOG_FILE, summary);
    
    // Print to console
    console.log(`${colors.blue}${summary}${colors.reset}`);
    
    console.log(`\n${colors.green}✅ Daily summary generated and saved to work-log.md${colors.reset}`);
    
    // Show next tasks
    console.log(`\n${colors.yellow}📋 Next Tasks to Work On:${colors.reset}`);
    const nextTasksRegex = /#### Task (\d+\.\d+): ([^\n]*)[^]*?\*\*Status\*\*: \[ \] Not Started/g;
    let nextCount = 0;
    while ((match = nextTasksRegex.exec(taskContent)) !== null && nextCount < 3) {
      console.log(`  ${colors.magenta}→${colors.reset} Task ${match[1]}: ${match[2]}`);
      nextCount++;
    }
    
  } catch (error) {
    console.error('❌ Error generating summary:', error.message);
  }
}

// Run the summary
generateDailySummary();
