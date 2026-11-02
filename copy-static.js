import fs from 'fs';
import path from 'path';

const distPath = path.resolve('dist');

// Copy assets/images and assets/models to dist/assets
if (fs.existsSync('assets')) {
  const target = path.join(distPath, 'assets');
  if (fs.existsSync('assets/images')) {
    const imagesTarget = path.join(target, 'images');
    fs.cpSync('assets/images', imagesTarget, { recursive: true, force: true });
  }
  if (fs.existsSync('assets/models')) {
    const modelsTarget = path.join(target, 'models');
    fs.cpSync('assets/models', modelsTarget, { recursive: true, force: true });
  }
}

console.log('Static assets synced to dist/ successfully.');
