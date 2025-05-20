#!/usr/bin/env node

/**
 * vercel-build.js
 * Custom build script for Vercel deployments
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple colored logging functions
const log = {
  blue: (msg) => console.log(`\x1b[34m${msg}\x1b[0m`),
  green: (msg) => console.log(`\x1b[32m${msg}\x1b[0m`),
  red: (msg) => console.log(`\x1b[31m${msg}\x1b[0m`),
  yellow: (msg) => console.log(`\x1b[33m${msg}\x1b[0m`),
};

log.blue('🚀 Starting Neural Nexus custom Vercel build...');

// Required Babel plugins
const requiredPlugins = [
  '@babel/plugin-transform-react-jsx',
  '@babel/plugin-transform-private-methods',
  '@babel/plugin-transform-private-property-in-object',
  '@babel/plugin-transform-class-properties'
];

// Clean previous build to avoid issues
const cleanPrevBuild = () => {
  log.yellow('🧹 Cleaning previous build artifacts...');
  try {
    if (fs.existsSync(path.join(process.cwd(), '.next'))) {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
    log.green('✅ Previous build cleaned');
  } catch (error) {
    log.yellow('⚠️ Warning: Could not clean previous build: ' + error.message);
  }
};

// Function to create backup copy of middleware
const backupMiddleware = () => {
  log.blue('📄 Creating safe middleware backup...');
  
  const tsMiddlewarePath = path.join(process.cwd(), 'middleware.ts');
  const jsMiddlewarePath = path.join(process.cwd(), 'middleware.js');
  const backupPath = path.join(process.cwd(), '.middleware.backup');
  
  try {
    if (fs.existsSync(tsMiddlewarePath)) {
      fs.copyFileSync(tsMiddlewarePath, backupPath);
      log.green('✅ Middleware backup created');
    } else if (fs.existsSync(jsMiddlewarePath)) {
      fs.copyFileSync(jsMiddlewarePath, backupPath);
      log.green('✅ Middleware backup created');
    } else {
      log.yellow('⚠️ No middleware file found to backup');
    }
  } catch (error) {
    log.yellow('⚠️ Warning: Could not backup middleware: ' + error.message);
  }
};

// Function to ensure a minimal edge-friendly middleware exists
const ensureMinimalMiddleware = () => {
  log.blue('🔧 Ensuring minimal middleware exists...');
  
  const minimalMiddleware = `// Absolute bare minimum middleware with zero React dependencies
export const config = {
  matcher: ['/signin', '/signup', '/auth/callback']
};

export default function middleware(request) {
  // Create minimal response with headers
  return new Response(null, {
    status: 200,
    headers: {
      'x-edge-middleware': 'true',
      'x-client-side-rendering': 'true'
    }
  });
}`;

  const jsMiddlewarePath = path.join(process.cwd(), 'middleware.js');
  
  try {
    fs.writeFileSync(jsMiddlewarePath, minimalMiddleware, 'utf8');
    log.green('✅ Minimal middleware created');
  } catch (error) {
    log.yellow('⚠️ Warning: Could not create minimal middleware: ' + error.message);
  }
};

// Restore original middleware
const restoreMiddleware = () => {
  log.blue('🔄 Restoring original middleware...');
  
  const backupPath = path.join(process.cwd(), '.middleware.backup');
  const tsMiddlewarePath = path.join(process.cwd(), 'middleware.ts');
  const jsMiddlewarePath = path.join(process.cwd(), 'middleware.js');
  
  try {
    if (fs.existsSync(backupPath)) {
      if (fs.existsSync(tsMiddlewarePath)) {
        fs.copyFileSync(backupPath, tsMiddlewarePath);
      } else {
        fs.copyFileSync(backupPath, jsMiddlewarePath);
      }
      fs.unlinkSync(backupPath);
      log.green('✅ Original middleware restored');
    }
  } catch (error) {
    log.yellow('⚠️ Warning: Could not restore middleware: ' + error.message);
  }
};

try {
  // Clean previous build first
  cleanPrevBuild();
  
  // Backup and ensure minimal middleware
  backupMiddleware();
  ensureMinimalMiddleware();
  
  // Install required Babel plugins
  log.blue('📦 Installing required Babel plugins...');
  execSync(`npm install --no-save ${requiredPlugins.join(' ')}`, {
    stdio: 'inherit'
  });
  
  // Ensure edge runtime env variables are set
  log.blue('🔧 Setting up Edge runtime environment...');
  process.env.NEXT_RUNTIME = 'edge';
  process.env.NEXT_DISABLE_REACT_IN_MIDDLEWARE = 'true';
  
  // Set environment variables and run build
  log.blue('🔨 Building the application...');
  
  // Load Edge environment variables
  const edgeEnvPath = path.join(process.cwd(), '.env.edge');
  if (fs.existsSync(edgeEnvPath)) {
    log.blue('📄 Loading Edge environment configuration...');
    const edgeEnv = fs.readFileSync(edgeEnvPath, 'utf8')
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => line.trim())
      .join(' ');
    
    // Set Edge environment variables for the middleware build
    execSync(`${edgeEnv} NEXT_PUBLIC_ENABLE_TONCONNECT=false NEXT_PUBLIC_RUNTIME_JS_REACT=true npm run build`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        NEXT_RUNTIME: 'edge',
        NEXT_DISABLE_REACT_IN_MIDDLEWARE: 'true'
      }
    });
  } else {
    execSync('NEXT_PUBLIC_ENABLE_TONCONNECT=false NEXT_PUBLIC_RUNTIME_JS_REACT=true NEXT_RUNTIME=edge NEXT_DISABLE_REACT_IN_MIDDLEWARE=true npm run build', {
      stdio: 'inherit'
    });
  }
  
  // Restore original middleware
  restoreMiddleware();
  
  // Run middleware fix script
  log.blue('🔧 Processing middleware...');
  execSync('node ./scripts/fix-middleware.js', {
    stdio: 'inherit'
  });
  
  // Run the aggressive edge function purge
  log.blue('🔥 Aggressively purging React from Edge functions...');
  execSync('node ./scripts/purge-edge-modules.js', {
    stdio: 'inherit'
  });
  
  // Special post-build steps for Vercel
  if (fs.existsSync('/vercel/path0')) {
    log.blue('🧹 Running Vercel-specific post-build cleanup...');
    
    // Create vercel-edge-cleanup.sh if it doesn't exist
    const cleanupScriptPath = path.join(process.cwd(), 'vercel-edge-cleanup.sh');
    
    if (!fs.existsSync(cleanupScriptPath)) {
      // Basic shell script to clean Vercel namespaces
      const cleanupScript = `#!/bin/bash
echo "Running final Vercel Edge function cleanup"

# Clean namespace directories if they exist
VERCEL_OUTPUT="/vercel/output/functions"

if [ -d "$VERCEL_OUTPUT" ]; then
  echo "Found Vercel output directory"
  
  for func in "$VERCEL_OUTPUT"/*; do
    if [ -d "$func/__vc__ns__" ]; then
      echo "Processing namespace in $(basename "$func")"
      
      for ns in "$func/__vc__ns__"/*; do
        if [ -d "$ns" ]; then
          echo "Cleaning $(basename "$ns")"
          sed -i 's/["\\']react["\\']/null/g' "$ns/index.js" 2>/dev/null || true
          sed -i 's/React\\./REMOVED_REACT./g' "$ns/index.js" 2>/dev/null || true
        fi
      done
    fi
  done
  
  echo "Cleanup complete"
else
  echo "No Vercel output directory found"
fi`;

      fs.writeFileSync(cleanupScriptPath, cleanupScript, { mode: 0o755 });
      log.green('✅ Created Vercel cleanup script');
    }
    
    // Execute the cleanup script
    try {
      execSync(`chmod +x ${cleanupScriptPath} && ${cleanupScriptPath}`, {
        stdio: 'inherit'
      });
    } catch (error) {
      log.yellow('⚠️ Warning: Could not run Vercel cleanup: ' + error.message);
    }
  }
  
  log.green('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  log.red('❌ Build failed: ' + error.message);
  process.exit(1);
} 