#!/usr/bin/env node

/**
 * fix-middleware.js
 * Script to ensure middleware doesn't include React references
 */

const fs = require('fs');
const path = require('path');

// Log with color
const log = {
  info: (msg) => console.log(`\x1b[34m${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m${msg}\x1b[0m`)
};

log.info('🔧 Processing middleware bundle...');

// Find middleware files
const nextDir = path.join(process.cwd(), '.next');
const middlewarePath = path.join(nextDir, 'server', 'middleware.js');
const middlewareManifestPath = path.join(nextDir, 'server', 'middleware-manifest.json');

// Patterns to remove from middleware
const reactImportPatterns = [
  // Remove React imports
  /import\s+(?:\*\s+as\s+)?React(?:,\s*\{[^}]*\})?\s+from\s+['"]react['"]/g,
  /import\s+\{[^}]*\}\s+from\s+['"]react['"]/g,
  /const\s+React\s*=\s*require\(['"]react['"]\)/g,
  /var\s+React\s*=\s*require\(['"]react['"]\)/g,
  
  // Remove specific React references
  /(?:React\.createElement|React\.Component|React\.PureComponent|React\.Fragment)/g,
  
  // Remove JSX pragma
  /\/\*\*\s*\*\s*@jsx\s+React.createElement\s*\*\//g,
];

try {
  // Check if middleware file exists
  if (fs.existsSync(middlewarePath)) {
    log.info('Found middleware file, checking for issues...');
    
    // Read middleware manifest to analyze imports
    if (fs.existsSync(middlewareManifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(middlewareManifestPath, 'utf8'));
      
      // Log the middleware configuration for debugging
      log.info(`Middleware configuration: ${JSON.stringify(manifest, null, 2)}`);
    }
    
    // Basic verification that middleware doesn't rely on React
    let content = fs.readFileSync(middlewarePath, 'utf8');
    let foundReactReferences = false;
    
    if (content.includes('React') || content.includes('react')) {
      log.error('⚠️ Found React references in middleware. Removing them...');
      foundReactReferences = true;
      
      // Remove React imports and references
      reactImportPatterns.forEach(pattern => {
        content = content.replace(pattern, '');
      });
      
      // Write cleaned content back
      fs.writeFileSync(middlewarePath, content, 'utf8');
      log.success('✅ Removed React references from middleware.');
    } else {
      log.success('✅ No explicit React references found in middleware.');
    }
    
    // Also check the edge-runtime-webpack file
    const edgeRuntimePath = path.join(nextDir, 'server', 'edge-runtime-webpack.js');
    if (fs.existsSync(edgeRuntimePath)) {
      log.info('Checking edge-runtime-webpack.js...');
      let edgeContent = fs.readFileSync(edgeRuntimePath, 'utf8');
      
      // Check for React imports
      if (edgeContent.includes('React') || edgeContent.includes('react')) {
        log.error('⚠️ Found React references in edge-runtime. Removing them...');
        
        // Remove React imports and references
        reactImportPatterns.forEach(pattern => {
          edgeContent = edgeContent.replace(pattern, '');
        });
        
        // Write cleaned content back
        fs.writeFileSync(edgeRuntimePath, edgeContent, 'utf8');
        log.success('✅ Removed React references from edge-runtime.');
      }
    }
    
    // Process all middleware chunks
    const edgeChunksDir = path.join(nextDir, 'server', 'edge-chunks');
    if (fs.existsSync(edgeChunksDir)) {
      log.info('Processing edge chunks...');
      
      const chunkFiles = fs.readdirSync(edgeChunksDir);
      let chunksFixed = 0;
      
      chunkFiles.forEach(file => {
        const chunkPath = path.join(edgeChunksDir, file);
        let chunkContent = fs.readFileSync(chunkPath, 'utf8');
        
        if (chunkContent.includes('React') || chunkContent.includes('react')) {
          // Remove React imports and references
          reactImportPatterns.forEach(pattern => {
            chunkContent = chunkContent.replace(pattern, '');
          });
          
          // Write cleaned content back
          fs.writeFileSync(chunkPath, chunkContent, 'utf8');
          chunksFixed++;
        }
      });
      
      if (chunksFixed > 0) {
        log.success(`✅ Removed React references from ${chunksFixed} edge chunks.`);
      } else {
        log.info('No React references found in edge chunks.');
      }
    }
  } else {
    log.info('No middleware file found, skipping...');
  }
  
  log.success('✅ Middleware processing complete');
} catch (error) {
  log.error(`❌ Error processing middleware: ${error.message}`);
  process.exit(1);
} 