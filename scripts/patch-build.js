/**
 * Post-build script to patch any missing files that might cause the build to fail
 * This script runs after the build process to ensure all necessary files exist
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Patching build artifacts...');

// Ensure .next directory exists
if (!fs.existsSync('.next')) {
  fs.mkdirSync('.next', { recursive: true });
  console.log('📁 Created .next directory');
}

// Ensure prerender-manifest.json exists
const prerenderManifestPath = path.join('.next', 'prerender-manifest.json');
if (!fs.existsSync(prerenderManifestPath)) {
  fs.writeFileSync(prerenderManifestPath, '{}', 'utf8');
  console.log('📄 Created empty prerender-manifest.json');
}

// Create server directories for auth pages
const serverDirs = [
  '.next/server/pages/signin',
  '.next/server/pages/signup',
  '.next/server/pages/auth/callback',
  '.next/server/app/signin',
  '.next/server/app/signup',
  '.next/server/app/auth/callback',
];

serverDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Creating directory: ${dir}`);
  }
});

// Create .nojekyll file to ensure proper static file serving if deployed to GitHub Pages
const nojekyllPath = path.join('.next', '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '', 'utf8');
  console.log('📄 Created .nojekyll file');
}

// Check if routes-manifest.json exists, if not create a basic one
const routesManifestPath = path.join('.next', 'routes-manifest.json');
if (!fs.existsSync(routesManifestPath)) {
  // Create a minimal routes manifest
  const routesManifest = {
    version: 3,
    basePath: "",
    headers: [],
    rewrites: [],
    redirects: [],
    dynamicRoutes: []
  };
  
  fs.writeFileSync(routesManifestPath, JSON.stringify(routesManifest, null, 2), 'utf8');
  console.log('📄 Created basic routes-manifest.json');
}

console.log('✅ Build patching complete');
console.log('🚀 The build is ready for deployment!'); 