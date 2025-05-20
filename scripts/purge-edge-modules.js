#!/usr/bin/env node

/**
 * purge-edge-modules.js
 * Aggressive script to remove all React-related dependencies from Edge functions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Log with color
const log = {
  info: (msg) => console.log(`\x1b[34m${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m${msg}\x1b[0m`)
};

log.info('🔥 Starting aggressive Edge Function cleanup...');

// Find the Vercel deployment directory if it exists
const findVercelBuildDir = () => {
  // Check current directory structure - Vercel output
  const vercelOutputFunctionsPath = path.join(process.cwd(), '.vercel', 'output', 'functions');
  if (fs.existsSync(vercelOutputFunctionsPath)) {
    log.success(`✅ Found Vercel functions directory at ${vercelOutputFunctionsPath}`);
    return vercelOutputFunctionsPath;
  }
  
  // Check Vercel deployment directory structure
  const vercelPath = path.join(process.cwd(), '.vercel');
  if (fs.existsSync(vercelPath)) {
    log.info(`Found .vercel directory, checking for functions...`);
    
    // Search for any functions directory
    const findFunctionsDir = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'functions') {
            return fullPath;
          } else {
            const result = findFunctionsDir(fullPath);
            if (result) return result;
          }
        }
      }
      return null;
    };
    
    const functionsDir = findFunctionsDir(vercelPath);
    if (functionsDir) {
      log.success(`✅ Found Vercel functions directory at ${functionsDir}`);
      return functionsDir;
    }
  }
  
  // Direct check for Vercel's internal paths during deployment
  const vercelBuildOutput = '/vercel/output/functions';
  if (fs.existsSync(vercelBuildOutput)) {
    log.success(`✅ Found Vercel functions directory at ${vercelBuildOutput}`);
    return vercelBuildOutput;
  }
  
  log.warning('⚠️ No Vercel functions directory found, using Next.js build directory');
  return null;
};

// File patterns to check/clean
const FUNCTION_PATTERNS = [
  'middleware',
  'index'
];

// Modules to remove
const BANNED_MODULES = [
  'react',
  'react-dom',
  '@babel/plugin-transform-react-jsx',
  '@babel/core',
  'babel',
  'jsx',
  'react-server',
  'react-refresh'
];

// Search for specific named exports/imports
const BANNED_EXPORTS = [
  'createElement',
  'Component',
  'PureComponent',
  'React',
  'Fragment',
  'useState',
  'useEffect',
  'useContext',
  'useMemo',
  'useCallback',
  'useRef'
];

// Clean a single file with very aggressive replacement
const cleanFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return false;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let didChange = false;
    
    // Check if file contains any banned module references
    const containsBannedModule = BANNED_MODULES.some(m => 
      content.includes(`"${m}"`) || 
      content.includes(`'${m}'`) || 
      content.includes(`require("${m}")`) ||
      content.includes(`require('${m}')`) ||
      content.includes(`from "${m}"`) ||
      content.includes(`from '${m}'`)
    );
    
    // Additional check for just "react" string
    const containsReactString = 
      content.includes(' react') || 
      content.includes('react ') || 
      content.includes('"react"') || 
      content.includes('\'react\'') ||
      content.includes('React.');
    
    if (containsBannedModule || containsReactString) {
      log.warning(`⚠️ Found banned module references in ${filePath}`);
      
      // Remove import statements with banned modules
      BANNED_MODULES.forEach(module => {
        // Remove require statements
        content = content.replace(new RegExp(`(?:const|let|var)\\s+.*?\\s*=\\s*require\\(['"]${module}['"]\\)[^;]*;`, 'g'), '');
        
        // Remove import statements
        content = content.replace(new RegExp(`import\\s+.*?\\s+from\\s+['"]${module}['"][^;]*;`, 'g'), '');
        content = content.replace(new RegExp(`import\\s+['"]${module}['"][^;]*;`, 'g'), '');
        
        // Remove any remaining references to this module
        content = content.replace(new RegExp(`(['"])${module}\\1`, 'g'), `$1removed-${module}$1`);
      });
      
      // Remove specific React export references
      BANNED_EXPORTS.forEach(exportName => {
        // Remove named imports
        content = content.replace(new RegExp(`\\b${exportName}\\b`, 'g'), `__REMOVED_${exportName}__`);
      });

      // Extra aggressive replacements for React
      content = content.replace(/React\./g, '__REMOVED_React__.');
      content = content.replace(/"react"/g, '"__REMOVED_react__"');
      content = content.replace(/'react'/g, '\'__REMOVED_react__\'');
      content = content.replace(/\brequire\s*\(\s*(?:"|')react(?:"|')\s*\)/g, 'null /* react removed */');
      
      didChange = content !== original;
      
      if (didChange) {
        fs.writeFileSync(filePath, content, 'utf8');
        log.success(`✅ Cleaned banned modules from ${filePath}`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    log.error(`❌ Error cleaning file ${filePath}: ${error.message}`);
    return false;
  }
};

// Clean a directory recursively
const cleanDirectory = (dirPath, filePattern) => {
  if (!fs.existsSync(dirPath)) return 0;
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let count = 0;
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      count += cleanDirectory(fullPath, filePattern);
    } else if (entry.name.endsWith('.js') && (filePattern === '' || entry.name.includes(filePattern))) {
      if (cleanFile(fullPath)) count++;
    }
  }
  
  return count;
};

// Find edge runtime in .next build
const processNextBuild = () => {
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    log.error('❌ .next directory not found, build first!');
    return;
  }
  
  log.info('🔍 Processing Next.js build...');
  
  // Clean middleware
  const middlewarePath = path.join(nextDir, 'server', 'middleware.js');
  if (fs.existsSync(middlewarePath)) {
    cleanFile(middlewarePath);
  }
  
  // Clean edge chunks
  const edgeChunksDir = path.join(nextDir, 'server', 'edge-chunks');
  if (fs.existsSync(edgeChunksDir)) {
    const count = cleanDirectory(edgeChunksDir, '');
    log.success(`✅ Cleaned ${count} edge chunks`);
  }
  
  // Clean edge entries
  const edgeRuntimePath = path.join(nextDir, 'server', 'edge-runtime-webpack.js');
  if (fs.existsSync(edgeRuntimePath)) {
    cleanFile(edgeRuntimePath);
  }
};

// Special handling for Vercel namespace directories
const processVercelNamespaces = (dirPath) => {
  const nsDir = path.join(dirPath, '__vc__ns__');
  if (fs.existsSync(nsDir)) {
    log.info(`🔍 Found Vercel namespaces directory at ${nsDir}`);
    
    // List all namespace directories
    const namespaceDirs = fs.readdirSync(nsDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    if (namespaceDirs.length === 0) {
      log.warning(`⚠️ No namespace directories found in ${nsDir}`);
      return 0;
    }
    
    log.info(`Found ${namespaceDirs.length} namespace directories: ${namespaceDirs.join(', ')}`);
    
    let totalCleaned = 0;
    // Process each namespace
    for (const ns of namespaceDirs) {
      const namespacePath = path.join(nsDir, ns);
      
      // Check for index.js file
      const indexPath = path.join(namespacePath, 'index.js');
      if (fs.existsSync(indexPath)) {
        if (cleanFile(indexPath)) totalCleaned++;
      }
      
      // Clean any other JS files in the namespace
      totalCleaned += cleanDirectory(namespacePath, '');
    }
    
    if (totalCleaned > 0) {
      log.success(`✅ Cleaned ${totalCleaned} files in namespace directories`);
    } else {
      log.warning(`⚠️ No files were cleaned in namespace directories`);
    }
    
    return totalCleaned;
  }
  
  return 0;
};

// Process Vercel build output
const processVercelBuild = (vercelFunctionsPath) => {
  log.info('🔍 Processing Vercel build output...');
  
  // Find edge function folders
  const edgeDirs = fs.readdirSync(vercelFunctionsPath).filter(name => {
    const dirPath = path.join(vercelFunctionsPath, name);
    return fs.statSync(dirPath).isDirectory() && 
           (fs.existsSync(path.join(dirPath, '.vc-config.json')) || 
            fs.existsSync(path.join(dirPath, '__vc__ns__')));
  });
  
  if (edgeDirs.length === 0) {
    log.warning('⚠️ No edge functions found in Vercel output');
    return;
  }
  
  log.info(`Found ${edgeDirs.length} edge functions: ${edgeDirs.join(', ')}`);
  
  // Process each edge function
  let totalCleaned = 0;
  for (const dir of edgeDirs) {
    const dirPath = path.join(vercelFunctionsPath, dir);
    
    // Process main edge function chunks
    const count = FUNCTION_PATTERNS.reduce((acc, pattern) => {
      return acc + cleanDirectory(dirPath, pattern);
    }, 0);
    
    // Clean namespace directories (very important for Vercel)
    const nsCount = processVercelNamespaces(dirPath);
    
    totalCleaned += count + nsCount;
    
    log.success(`✅ Processed ${dir}: cleaned ${count + nsCount} files`);
  }
  
  log.success(`✅ Total cleaned files in Vercel build: ${totalCleaned}`);
};

// Main execution
try {
  // Try to process Next.js build first
  processNextBuild();
  
  // Then try to process Vercel build output if available
  const vercelFunctionsPath = findVercelBuildDir();
  if (vercelFunctionsPath) {
    processVercelBuild(vercelFunctionsPath);
  }
  
  // Create a script to run at the end of build in Vercel
  if (fs.existsSync('/vercel/path0')) {
    log.info('🔧 Creating post-build script for Vercel...');
    
    // Create a cleanup script that will run during deployment
    const vercelCleanupScript = `
#!/bin/bash
echo "Running post-build cleanup for Edge functions"
FUNCTIONS_DIR="/vercel/output/functions"

if [ -d "$FUNCTIONS_DIR" ]; then
  echo "Found functions directory at $FUNCTIONS_DIR"
  
  # Process each function directory
  for func_dir in "$FUNCTIONS_DIR"/*; do
    if [ -d "$func_dir" ]; then
      echo "Processing function: $(basename "$func_dir")"
      
      # Check for and clean namespace directories
      NS_DIR="$func_dir/__vc__ns__"
      if [ -d "$NS_DIR" ]; then
        echo "Found namespaces directory at $NS_DIR"
        
        # Process each namespace
        for ns_dir in "$NS_DIR"/*; do
          if [ -d "$ns_dir" ]; then
            echo "Processing namespace: $(basename "$ns_dir")"
            
            # Clean index.js file
            INDEX_FILE="$ns_dir/index.js"
            if [ -f "$INDEX_FILE" ]; then
              echo "Cleaning $INDEX_FILE"
              # Remove React references
              sed -i 's/["'\\'']react["'\\'']/"__REMOVED_react__"/g' "$INDEX_FILE"
              sed -i 's/\\bReact\\./__REMOVED_React__./g' "$INDEX_FILE"
              sed -i 's/require(["'\\'']react["'\\''])/null \\/* react removed *\\//g' "$INDEX_FILE"
            fi
          fi
        done
      fi
    fi
  done
  
  echo "Edge function cleanup complete!"
else
  echo "No functions directory found at $FUNCTIONS_DIR"
fi
`;
    
    // Write the cleanup script
    const vercelCleanupPath = path.join(process.cwd(), 'vercel-edge-cleanup.sh');
    fs.writeFileSync(vercelCleanupPath, vercelCleanupScript, { mode: 0o755 });
    log.success(`✅ Created Vercel cleanup script: ${vercelCleanupPath}`);
    
    // Execute it
    try {
      log.info('🔨 Running cleanup script...');
      execSync(`bash ${vercelCleanupPath}`, { stdio: 'inherit' });
    } catch (err) {
      log.error(`❌ Error running cleanup script: ${err.message}`);
    }
  }
  
  log.success('✅ Edge function cleanup complete!');
} catch (error) {
  log.error(`❌ Error during cleanup: ${error.message}`);
  process.exit(1);
} 