#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Building for production with Convex URL...');

// Set environment variable for build
process.env.VITE_CONVEX_URL = 'https://graceful-mouse-263.convex.cloud';

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Production build completed successfully!');
  console.log('📝 Convex URL: https://graceful-mouse-263.convex.cloud');
  console.log('📁 Build files are in the "dist" folder');
  console.log('🚀 Ready for deployment!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

