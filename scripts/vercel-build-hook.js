#!/usr/bin/env node

/**
 * vercel-build-hook.js
 * Standalone script to run before and after Vercel builds
 * This helps ensure Edge functions don't include React
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Simple logging with color
const log = {
  info: (msg) => console.log(`\x1b[34m${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m${msg}\x1b[0m`)
};

// Check if we're running in Vercel
const isVercel = process.env.VERCEL === '1' || fs.existsSync('/vercel/path0');

// Only process the middleware if we're in Vercel
if (isVercel) {
  log.info('🚀 Running Vercel build hook...');
  
  // If the script is called with "pre" argument, run pre-build tasks
  if (process.argv[2] === 'pre') {
    log.info('📦 Running pre-build tasks...');
    
    // Create ultra-minimal middleware.js
    const minimalMiddleware = `// Ultra-minimal middleware with zero dependencies
export const config = {
  matcher: ['/signin', '/signup', '/auth/callback']
};

export default function middleware(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'x-edge-middleware': 'true',
      'x-client-side-rendering': 'true'
    }
  });
}`;

    // Backup any existing middleware
    const tsMiddlewarePath = path.join(process.cwd(), 'middleware.ts');
    const jsMiddlewarePath = path.join(process.cwd(), 'middleware.js');
    const backupPath = path.join(process.cwd(), '.middleware.backup');
    
    try {
      if (fs.existsSync(tsMiddlewarePath)) {
        log.info('📄 Backing up middleware.ts');
        fs.copyFileSync(tsMiddlewarePath, backupPath);
      } else if (fs.existsSync(jsMiddlewarePath)) {
        log.info('📄 Backing up middleware.js');
        fs.copyFileSync(jsMiddlewarePath, backupPath);
      }
      
      // Write the minimal middleware.js
      log.info('📝 Creating minimal middleware.js');
      fs.writeFileSync(jsMiddlewarePath, minimalMiddleware, 'utf8');
      log.success('✅ Pre-build tasks completed');
    } catch (error) {
      log.error(`❌ Error in pre-build: ${error.message}`);
    }
  }
  
  // If the script is called with "post" argument, run post-build tasks
  if (process.argv[2] === 'post') {
    log.info('📦 Running post-build tasks...');
    
    // Paths to check for namespace directories
    const possibleVercelPaths = [
      '/vercel/output/functions',
      path.join(process.cwd(), '.vercel', 'output', 'functions')
    ];
    
    let functionsDir = null;
    for (const vercelPath of possibleVercelPaths) {
      if (fs.existsSync(vercelPath)) {
        functionsDir = vercelPath;
        log.success(`✅ Found functions directory at ${functionsDir}`);
        break;
      }
    }
    
    if (functionsDir) {
      try {
        // Process each function directory
        const functionEntries = fs.readdirSync(functionsDir, { withFileTypes: true });
        
        for (const entry of functionEntries) {
          if (entry.isDirectory()) {
            const functionDir = path.join(functionsDir, entry.name);
            log.info(`🔍 Processing function: ${entry.name}`);
            
            // Check for namespace directories
            const namespaceDir = path.join(functionDir, '__vc__ns__');
            if (fs.existsSync(namespaceDir)) {
              log.info(`Found namespaces in ${entry.name}`);
              
              // Process each namespace
              const namespaceEntries = fs.readdirSync(namespaceDir, { withFileTypes: true });
              for (const nsEntry of namespaceEntries) {
                if (nsEntry.isDirectory()) {
                  const nsDir = path.join(namespaceDir, nsEntry.name);
                  log.info(`Cleaning namespace: ${nsEntry.name}`);
                  
                  // Clean index.js file
                  const indexPath = path.join(nsDir, 'index.js');
                  if (fs.existsSync(indexPath)) {
                    let content = fs.readFileSync(indexPath, 'utf8');
                    
                    // Aggressive replacements to remove React
                    content = content.replace(/"react"/g, '"__REMOVED_react__"');
                    content = content.replace(/'react'/g, "'__REMOVED_react__'");
                    content = content.replace(/React\./g, '__REMOVED_React__.');
                    content = content.replace(/\brequire\s*\(\s*['"]react['"]\s*\)/g, 'null /* react removed */');
                    
                    fs.writeFileSync(indexPath, content, 'utf8');
                    log.success(`✅ Cleaned ${indexPath}`);
                  }
                }
              }
            }
          }
        }
        
        log.success('✅ Post-build tasks completed');
      } catch (error) {
        log.error(`❌ Error in post-build: ${error.message}`);
      }
    } else {
      log.warning('⚠️ Could not find Vercel functions directory');
    }
    
    // Restore the original middleware
    const backupPath = path.join(process.cwd(), '.middleware.backup');
    if (fs.existsSync(backupPath)) {
      log.info('🔄 Restoring original middleware');
      
      const tsMiddlewarePath = path.join(process.cwd(), 'middleware.ts');
      const jsMiddlewarePath = path.join(process.cwd(), 'middleware.js');
      
      if (fs.existsSync(tsMiddlewarePath)) {
        fs.copyFileSync(backupPath, tsMiddlewarePath);
      } else {
        fs.copyFileSync(backupPath, jsMiddlewarePath);
      }
      
      fs.unlinkSync(backupPath);
      log.success('✅ Original middleware restored');
    }
  }
} else {
  log.info('Not running in Vercel environment, skipping build hook');
} 