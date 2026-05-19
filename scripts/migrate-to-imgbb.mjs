/**
 * Migration script: Move all product images to ImgBB
 * 
 * ⚠️ IMPORTANT: This script is SAFE and will NOT delete any images!
 * 
 * What it does:
 * 1. Fetches all products from Firebase Realtime Database
 * 2. Downloads images from current URLs (Catbox, Unsplash, etc.)
 * 3. Uploads them to ImgBB (keeps originals intact)
 * 4. Updates Firebase with new ImgBB URLs
 * 5. Creates a backup file before making any changes
 * 
 * Your original images stay on Catbox/Unsplash until you manually delete them.
 * 
 * Usage:
 *   node scripts/migrate-to-imgbb.mjs
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import fetch from 'node-fetch';
import FormData from 'form-data';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

const IMGBB_API_KEY = process.env.VITE_IMGBB_API_KEY;

if (!IMGBB_API_KEY) {
  console.error('❌ Error: VITE_IMGBB_API_KEY must be set in .env');
  console.error('   Get your API key from: https://api.imgbb.com/');
  process.exit(1);
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * Download an image and convert to base64
 */
async function downloadImageAsBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const buffer = await response.buffer();
    return buffer.toString('base64');
  } catch (error) {
    console.error(`  ❌ Failed to download: ${error.message}`);
    return null;
  }
}

/**
 * Upload a base64 image to ImgBB
 */
async function uploadToImgBB(base64Image) {
  try {
    const form = new FormData();
    form.append('image', base64Image);

    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data?.url) {
      throw new Error('No URL in response');
    }

    return data.data.url;
  } catch (error) {
    console.error(`  ❌ Failed to upload: ${error.message}`);
    return null;
  }
}

/**
 * Migrate a single product's images
 */
async function migrateProduct(productId, productData) {
  console.log(`\n📦 Migrating product: ${productId} (${productData.title || 'Untitled'})`);
  
  let updated = false;
  const updates = {};

  // Migrate main image
  if (productData.image && productData.image.startsWith('http')) {
    console.log(`  🖼️  Main image: ${productData.image.substring(0, 60)}...`);
    const base64 = await downloadImageAsBase64(productData.image);
    if (base64) {
      const newUrl = await uploadToImgBB(base64);
      if (newUrl) {
        updates.image = newUrl;
        updated = true;
        console.log(`  ✅ Uploaded to: ${newUrl.substring(0, 60)}...`);
      }
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Migrate gallery images
  if (productData.gallery && Array.isArray(productData.gallery)) {
    const newGallery = [];
    for (let i = 0; i < productData.gallery.length; i++) {
      const galleryUrl = productData.gallery[i];
      if (galleryUrl && galleryUrl.startsWith('http')) {
        console.log(`  🖼️  Gallery[${i}]: ${galleryUrl.substring(0, 60)}...`);
        const base64 = await downloadImageAsBase64(galleryUrl);
        if (base64) {
          const newUrl = await uploadToImgBB(base64);
          if (newUrl) {
            newGallery.push(newUrl);
            console.log(`  ✅ Uploaded to: ${newUrl.substring(0, 60)}...`);
          } else {
            newGallery.push(galleryUrl); // Keep original if upload fails
          }
        } else {
          newGallery.push(galleryUrl); // Keep original if download fails
        }
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        newGallery.push(galleryUrl);
      }
    }
    if (newGallery.length > 0) {
      updates.gallery = newGallery;
      updated = true;
    }
  }

  // Update Firebase if we migrated any images
  if (updated) {
    await set(ref(db, `products/${productId}`), {
      ...productData,
      ...updates,
      updatedAt: Date.now(),
    });
    console.log(`  💾 Updated Firebase`);
  } else {
    console.log(`  ⏭️  No images to migrate`);
  }

  return updated;
}

/**
 * Create a backup of current Firebase data
 */
async function createBackup(products) {
  const backupFile = `backup-before-imgbb-migration-${Date.now()}.json`;
  fs.writeFileSync(backupFile, JSON.stringify(products, null, 2));
  console.log(`\n💾 Backup created: ${backupFile}`);
  console.log(`   (You can restore from this file if needed)\n`);
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting migration to ImgBB...\n');
  console.log('⚠️  IMPORTANT: Your original images will NOT be deleted!');
  console.log('   They will stay on Catbox/Unsplash until you manually remove them.\n');

  // Fetch all products from Firebase
  const productsRef = ref(db, 'products');
  const snapshot = await get(productsRef);

  if (!snapshot.exists()) {
    console.log('❌ No products found in Firebase');
    return;
  }

  const products = snapshot.val();
  const productIds = Object.keys(products);
  
  console.log(`📊 Found ${productIds.length} products\n`);

  // Create backup before migration
  await createBackup(products);

  let migratedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const productId of productIds) {
    const productData = products[productId];
    try {
      const wasMigrated = await migrateProduct(productId, productData);
      
      if (wasMigrated) {
        migratedCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.error(`  ❌ Error migrating ${productId}:`, error.message);
      failedCount++;
    }
  }

  console.log('\n✅ Migration complete!');
  console.log(`   Migrated: ${migratedCount} products`);
  console.log(`   Skipped: ${skippedCount} products`);
  if (failedCount > 0) {
    console.log(`   Failed: ${failedCount} products`);
  }
  console.log('\n💡 Your original images are still safe on Catbox/Unsplash!');
  console.log('   You can delete them manually later if you want.\n');
}

// Run migration
migrate().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
