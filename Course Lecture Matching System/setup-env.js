#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .env file with Convex production URL
const envContent = `# Convex Production URL
VITE_CONVEX_URL=https://graceful-mouse-263.convex.cloud

# Development URL (for local development)
# VITE_CONVEX_URL=https://elated-hare-431.convex.cloud
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created successfully!');
  console.log('📝 Production Convex URL: https://graceful-mouse-263.convex.cloud');
  console.log('🚀 Your app is now configured for production deployment');
} catch (error) {
  console.error('❌ Error creating environment file:', error.message);
  console.log('\n📋 Manual setup instructions:');
  console.log('1. Create a .env file in your project root');
  console.log('2. Add this line: VITE_CONVEX_URL=https://graceful-mouse-263.convex.cloud');
  console.log('3. Restart your development server');
}
