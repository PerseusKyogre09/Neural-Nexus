// This script adds React imports to all JSX files in the .next/server directory
// to fix the "React is not defined" error during build

const fs = require('fs');
const path = require('path');

// Function to add React import to file content if it's missing
function addReactImport(content) {
  // Check if the file already has a React import
  if (content.includes('import React') || content.includes('var React')) {
    return content;
  }
  
  // Add React import at the beginning of the file
  return 'var React = require("react");\n' + content;
}

// Function to recursively process all files in a directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(filePath);
    } else if (filePath.endsWith('.js')) {
      // Process JavaScript files
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const updatedContent = addReactImport(content);
        
        // Only write if content was changed
        if (content !== updatedContent) {
          console.log(`Adding React import to: ${filePath}`);
          fs.writeFileSync(filePath, updatedContent);
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
  });
}

// Main function
function main() {
  const serverDir = path.join(process.cwd(), '.next', 'server');
  
  if (!fs.existsSync(serverDir)) {
    console.error('Server directory not found. Make sure to run this script after the build.');
    process.exit(1);
  }
  
  console.log('Adding React imports to server files...');
  processDirectory(serverDir);
  console.log('Done!');
}

main(); 