#!/usr/bin/env node

/**
 * Bundle Size Analyzer
 * Analyzes the production build and reports bundle sizes
 */

import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const DIST_DIR = './dist/assets';
const SIZE_LIMITS = {
  js: 500 * 1024, // 500 KB
  css: 100 * 1024, // 100 KB
  total: 2 * 1024 * 1024, // 2 MB
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getFileType(filename) {
  if (filename.endsWith('.js')) return 'js';
  if (filename.endsWith('.css')) return 'css';
  if (filename.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) return 'image';
  if (filename.match(/\.(woff|woff2|ttf|otf|eot)$/)) return 'font';
  return 'other';
}

async function analyzeDirectory(dir) {
  const files = await readdir(dir);
  const results = {
    js: [],
    css: [],
    image: [],
    font: [],
    other: [],
    total: 0,
  };

  for (const file of files) {
    const filePath = join(dir, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      const subResults = await analyzeDirectory(filePath);
      results.total += subResults.total;
      Object.keys(subResults).forEach(key => {
        if (Array.isArray(results[key])) {
          results[key].push(...subResults[key]);
        }
      });
    } else {
      const type = getFileType(file);
      results[type].push({ name: file, size: stats.size });
      results.total += stats.size;
    }
  }

  return results;
}

async function main() {
  console.log('🔍 Analyzing production bundle...\n');

  try {
    const results = await analyzeDirectory(DIST_DIR);

    // Sort by size (largest first)
    Object.keys(results).forEach(key => {
      if (Array.isArray(results[key])) {
        results[key].sort((a, b) => b.size - a.size);
      }
    });

    // Calculate totals by type
    const totals = {
      js: results.js.reduce((sum, f) => sum + f.size, 0),
      css: results.css.reduce((sum, f) => sum + f.size, 0),
      image: results.image.reduce((sum, f) => sum + f.size, 0),
      font: results.font.reduce((sum, f) => sum + f.size, 0),
      other: results.other.reduce((sum, f) => sum + f.size, 0),
    };

    // Print JavaScript files
    console.log('📦 JavaScript Files:');
    console.log('─'.repeat(80));
    results.js.forEach(file => {
      const status = file.size > SIZE_LIMITS.js ? '⚠️' : '✅';
      console.log(`${status} ${file.name.padEnd(50)} ${formatBytes(file.size).padStart(10)}`);
    });
    console.log(`   ${'TOTAL'.padEnd(50)} ${formatBytes(totals.js).padStart(10)}`);
    console.log();

    // Print CSS files
    console.log('🎨 CSS Files:');
    console.log('─'.repeat(80));
    results.css.forEach(file => {
      const status = file.size > SIZE_LIMITS.css ? '⚠️' : '✅';
      console.log(`${status} ${file.name.padEnd(50)} ${formatBytes(file.size).padStart(10)}`);
    });
    console.log(`   ${'TOTAL'.padEnd(50)} ${formatBytes(totals.css).padStart(10)}`);
    console.log();

    // Print summary
    console.log('📊 Summary:');
    console.log('─'.repeat(80));
    console.log(`JavaScript:  ${formatBytes(totals.js).padStart(10)} (${results.js.length} files)`);
    console.log(`CSS:         ${formatBytes(totals.css).padStart(10)} (${results.css.length} files)`);
    console.log(`Images:      ${formatBytes(totals.image).padStart(10)} (${results.image.length} files)`);
    console.log(`Fonts:       ${formatBytes(totals.font).padStart(10)} (${results.font.length} files)`);
    console.log(`Other:       ${formatBytes(totals.other).padStart(10)} (${results.other.length} files)`);
    console.log('─'.repeat(80));
    const totalStatus = results.total > SIZE_LIMITS.total ? '⚠️' : '✅';
    console.log(`${totalStatus} TOTAL:      ${formatBytes(results.total).padStart(10)}`);
    console.log();

    // Print warnings
    const warnings = [];
    if (totals.js > SIZE_LIMITS.js) {
      warnings.push(`⚠️  JavaScript bundle is large (${formatBytes(totals.js)} > ${formatBytes(SIZE_LIMITS.js)})`);
    }
    if (totals.css > SIZE_LIMITS.css) {
      warnings.push(`⚠️  CSS bundle is large (${formatBytes(totals.css)} > ${formatBytes(SIZE_LIMITS.css)})`);
    }
    if (results.total > SIZE_LIMITS.total) {
      warnings.push(`⚠️  Total bundle is large (${formatBytes(results.total)} > ${formatBytes(SIZE_LIMITS.total)})`);
    }

    if (warnings.length > 0) {
      console.log('⚠️  Warnings:');
      warnings.forEach(w => console.log(`   ${w}`));
      console.log();
      console.log('💡 Tips:');
      console.log('   - Enable code splitting for large dependencies');
      console.log('   - Lazy load routes and components');
      console.log('   - Remove unused dependencies');
      console.log('   - Use dynamic imports for heavy libraries');
    } else {
      console.log('✅ All bundle sizes are within recommended limits!');
    }

    console.log();
    console.log('🎯 Performance Tips:');
    console.log('   - Keep initial JS bundle < 200 KB for fast mobile load');
    console.log('   - Lazy load routes and heavy components');
    console.log('   - Use code splitting for vendor libraries');
    console.log('   - Compress images and use WebP format');
    console.log('   - Enable Brotli compression on server');

  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);
    console.log('\n💡 Make sure to run "npm run build" first!');
    process.exit(1);
  }
}

main();
