import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔨 Building with redirects...');

// Run the build
execSync('npm run build', { stdio: 'inherit' });

// Copy _redirects file to dist folder
const sourceFile = path.join('public', '_redirects');
const destFile = path.join('dist', '_redirects');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log('✅ _redirects file copied to dist/');
} else {
  console.log('⚠️  _redirects file not found in public/');
}

console.log('🎉 Build complete with redirects!');

