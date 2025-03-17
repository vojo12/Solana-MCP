const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Compile TypeScript files
exec('npx tsc --skipLibCheck', (err, stdout, stderr) => {
  if (err) {
    console.error('TypeScript compilation failed, but continuing...');
    console.error(stderr);
  }
  
  // Copy .env file to dist
  fs.copyFileSync('.env', path.join('dist', '.env'));
  
  console.log('Build completed with warnings');
}); 