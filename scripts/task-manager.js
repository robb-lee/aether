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
  reset: '\x1b[0m'
};

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function markTaskComplete(taskNumber, actualTime) {
  try {
    // Update task.md
    let taskContent = fs.readFileSync(TASK_FILE, 'utf8');
    
    // Find the task section
    const taskRegex = new RegExp(`(Task ${taskNumber}:[^\\n]*\\n)(\\*\\*Status\\*\\*: \\[[^\\]]*\\][^\\n]*)`, 'g');
    
    if (!taskContent.match(taskRegex)) {
      console.error(`❌ Task ${taskNumber} not found in task.md`);
      return;
    }
    
    taskContent = taskContent.replace(taskRegex, (match, taskLine, statusLine) => {
      const newStatus = '**Status**: [x] Completed ✅\n**Actual Time**: ' + actualTime;
      return taskLine + newStatus;
    });
    
    // Update progress tracker
    const progressRegex = /\| (\d+) \| ([^|]*) \| (\d+) tasks \| (\d+)\/(\d+) \|/g;
    taskContent = taskContent.replace(progressRegex, (match, day, date, planned, completed, total) => {
      const newCompleted = parseInt(completed) + 1;
      return `| ${day} | ${date} | ${planned} tasks | ${newCompleted}/${total} |`;
    });
    
    fs.writeFileSync(TASK_FILE, taskContent);
    
    // Update work-log.md
    const timestamp = getCurrentTime();
    const logEntry = `\n- [x] **${timestamp}** - Task ${taskNumber}: Completed\n  - Status: ✅ Complete\n  - Time: ${actualTime}\n`;
    
    let logContent = fs.readFileSync(LOG_FILE, 'utf8');
    
    // Find today's section and append
    const todaySection = logContent.lastIndexOf('#### Morning Session') || logContent.lastIndexOf('#### Afternoon Session');
    if (todaySection > -1) {
      const insertPosition = logContent.indexOf('\n\n', todaySection);
      logContent = logContent.slice(0, insertPosition) + logEntry + logContent.slice(insertPosition);
    } else {
      fs.appendFileSync(LOG_FILE, logEntry);
    }
    
    fs.writeFileSync(LOG_FILE, logContent);
    
    console.log(`${colors.green}✅ Task ${taskNumber} marked as complete!${colors.reset}`);
    console.log(`${colors.blue}📊 Progress updated in task.md${colors.reset}`);
    console.log(`${colors.blue}📝 Log entry added to work-log.md${colors.reset}`);
    console.log(`${colors.yellow}⏱️  Actual time: ${actualTime}${colors.reset}`);
    
  } catch (error) {
    console.error('❌ Error updating files:', error.message);
  }
}

function markTaskInProgress(taskNumber) {
  try {
    let taskContent = fs.readFileSync(TASK_FILE, 'utf8');
    
    const taskRegex = new RegExp(`(Task ${taskNumber}:[^\\n]*\\n)(\\*\\*Status\\*\\*: \\[[^\\]]*\\][^\\n]*)`, 'g');
    
    taskContent = taskContent.replace(taskRegex, (match, taskLine, statusLine) => {
      return taskLine + '**Status**: [ ] 🔄 In Progress';
    });
    
    fs.writeFileSync(TASK_FILE, taskContent);
    
    console.log(`${colors.yellow}🔄 Task ${taskNumber} marked as in progress${colors.reset}`);
    
  } catch (error) {
    console.error('❌ Error updating task status:', error.message);
  }
}

function showTaskStatus() {
  try {
    const taskContent = fs.readFileSync(TASK_FILE, 'utf8');
    
    // Count completed tasks
    const completedTasks = (taskContent.match(/\[x\] Completed ✅/g) || []).length;
    const inProgressTasks = (taskContent.match(/🔄 In Progress/g) || []).length;
    const totalTasks = (taskContent.match(/Task \d+\.\d+:/g) || []).length;
    
    console.log(`\n${colors.blue}📊 Project Status${colors.reset}`);
    console.log('─'.repeat(40));
    console.log(`✅ Completed: ${colors.green}${completedTasks}${colors.reset}`);
    console.log(`🔄 In Progress: ${colors.yellow}${inProgressTasks}${colors.reset}`);
    console.log(`📋 Total Tasks: ${totalTasks}`);
    console.log(`📈 Progress: ${colors.blue}${Math.round((completedTasks/totalTasks)*100)}%${colors.reset}`);
    console.log('─'.repeat(40));
    
  } catch (error) {
    console.error('❌ Error reading task status:', error.message);
  }
}

// Parse command line arguments
const [action, taskNum, time] = process.argv.slice(2);

switch(action) {
  case 'complete':
    if (!taskNum || !time) {
      console.error('Usage: pnpm task:complete <task-number> <time>');
      console.error('Example: pnpm task:complete 1.1 25min');
      process.exit(1);
    }
    markTaskComplete(taskNum, time);
    break;
    
  case 'start':
    if (!taskNum) {
      console.error('Usage: pnpm task:start <task-number>');
      console.error('Example: pnpm task:start 1.1');
      process.exit(1);
    }
    markTaskInProgress(taskNum);
    break;
    
  case 'status':
    showTaskStatus();
    break;
    
  default:
    console.log('Available commands:');
    console.log('  pnpm task:complete <task-number> <time>  - Mark task as complete');
    console.log('  pnpm task:start <task-number>            - Mark task as in progress');
    console.log('  pnpm task:status                         - Show project status');
}
