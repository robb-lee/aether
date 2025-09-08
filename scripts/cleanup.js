#!/usr/bin/env node

/**
 * Cleanup Script for Aether Project
 * Removes temporary files, empty directories, and unused build artifacts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function log(message) {
  console.log(`🧹 ${message}`);
}

function error(message) {
  console.error(`❌ ${message}`);
}

function success(message) {
  console.log(`✅ ${message}`);
}

function cleanTurboCache() {
  log('Cleaning Turbo cache...');
  try {
    // Remove empty log files and cookies
    execSync('find .turbo -type f -empty -delete', { stdio: 'pipe' });
    
    // Clean old daemon logs (keep recent ones)
    execSync('find .turbo/daemon -name "*.log.*" -mtime +7 -delete', { stdio: 'pipe' });
    
    success('Turbo cache cleaned');
  } catch (err) {
    error(`Failed to clean Turbo cache: ${err.message}`);
  }
}

function cleanNodeModules() {
  log('Cleaning node_modules cache...');
  try {
    // Clean npm cache
    execSync('npm cache clean --force', { stdio: 'pipe' });
    
    // Clean pnpm cache
    execSync('pnpm store prune', { stdio: 'pipe' });
    
    success('Node modules cache cleaned');
  } catch (err) {
    error(`Failed to clean node modules cache: ${err.message}`);
  }
}

function cleanBuildArtifacts() {
  log('Cleaning build artifacts...');
  try {
    const patterns = [
      '.next',
      'dist',
      '*.tsbuildinfo',
      'coverage',
      '.nyc_output'
    ];
    
    patterns.forEach(pattern => {
      try {
        execSync(`find . -name "${pattern}" -type d -exec rm -rf {} +`, { stdio: 'pipe' });
      } catch {
        // Directory might not exist, that's fine
      }
      
      try {
        execSync(`find . -name "${pattern}" -type f -delete`, { stdio: 'pipe' });
      } catch {
        // File might not exist, that's fine
      }
    });
    
    success('Build artifacts cleaned');
  } catch (err) {
    error(`Failed to clean build artifacts: ${err.message}`);
  }
}

function cleanEmptyDirectories() {
  log('Removing empty directories...');
  try {
    // Find and remove empty directories (excluding .git and node_modules)
    execSync(`find . -type d -empty -not -path "./.git/*" -not -path "./node_modules/*" -delete`, { stdio: 'pipe' });
    
    success('Empty directories removed');
  } catch (err) {
    error(`Failed to remove empty directories: ${err.message}`);
  }
}

function cleanTempFiles() {
  log('Cleaning temporary files...');
  try {
    const patterns = [
      '*.tmp',
      '*.temp',
      '.DS_Store',
      'Thumbs.db',
      '*.swp',
      '*.swo',
      '*~'
    ];
    
    patterns.forEach(pattern => {
      try {
        execSync(`find . -name "${pattern}" -type f -delete`, { stdio: 'pipe' });
      } catch {
        // File might not exist, that's fine
      }
    });
    
    success('Temporary files cleaned');
  } catch (err) {
    error(`Failed to clean temporary files: ${err.message}`);
  }
}

function generateReport() {
  log('Generating cleanup report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    actions: [
      'Cleaned Turbo cache and empty log files',
      'Cleaned node_modules cache',
      'Removed build artifacts (.next, dist, coverage)',
      'Removed empty directories',
      'Cleaned temporary files (.DS_Store, *.tmp, etc.)'
    ],
    nextSteps: [
      'Run pnpm install if you encounter dependency issues',
      'Run pnpm build to regenerate build artifacts',
      'Check git status for any unintended changes'
    ]
  };
  
  fs.writeFileSync('cleanup-report.json', JSON.stringify(report, null, 2));
  success('Cleanup report generated: cleanup-report.json');
  
  return report;
}

function main() {
  console.log('🧹 Starting Aether Project Cleanup');
  console.log('=====================================');
  
  const startTime = Date.now();
  
  try {
    cleanTurboCache();
    cleanNodeModules();
    cleanBuildArtifacts();
    cleanEmptyDirectories();
    cleanTempFiles();
    
    const report = generateReport();
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\\n🎉 Cleanup completed successfully!');
    console.log(`⏱️  Total time: ${duration}s`);
    console.log('\\n📋 Actions taken:');
    report.actions.forEach(action => console.log(`   • ${action}`));
    
    console.log('\\n🔄 Next steps:');
    report.nextSteps.forEach(step => console.log(`   • ${step}`));
    
  } catch (err) {
    error(`Cleanup failed: ${err.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  cleanTurboCache,
  cleanNodeModules,
  cleanBuildArtifacts,
  cleanEmptyDirectories,
  cleanTempFiles,
  generateReport
};