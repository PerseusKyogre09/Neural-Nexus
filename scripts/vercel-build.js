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
  red: (msg) => console.log(`\x1b[31m${msg}\x1b[0m`)
};

log.blue('🚀 Starting Neural Nexus custom Vercel build...');

// Required Babel plugins
const requiredPlugins = [
  '@babel/plugin-transform-react-jsx',
  '@babel/plugin-transform-private-methods',
  '@babel/plugin-transform-private-property-in-object',
  '@babel/plugin-transform-class-properties'
];

try {
  // Install required Babel plugins
  log.blue('📦 Installing required Babel plugins...');
  execSync(`npm install --no-save ${requiredPlugins.join(' ')}`, {
    stdio: 'inherit'
  });
  
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
      stdio: 'inherit'
    });
  } else {
    execSync('NEXT_PUBLIC_ENABLE_TONCONNECT=false NEXT_PUBLIC_RUNTIME_JS_REACT=true npm run build', {
      stdio: 'inherit'
    });
  }
  
  // Run middleware fix script
  log.blue('🔧 Processing middleware...');
  execSync('node ./scripts/fix-middleware.js', {
    stdio: 'inherit'
  });
  
  log.green('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  log.red('❌ Build failed: ' + error.message);
  process.exit(1);
} 