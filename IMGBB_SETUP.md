# ImgBB Setup Guide - SAFE Migration

## ⚠️ IMPORTANT: Your Images Are SAFE!

This migration will **NOT delete** any of your existing images. They will stay on Catbox/Unsplash until you manually delete them. The script only:
1. Downloads copies of your images
2. Uploads copies to ImgBB
3. Updates URLs in Firebase

**Your original images remain untouched!**

---

## Step 1: Create ImgBB Account (2 minutes - FREE)

1. Go to https://imgbb.com
2. Click "Sign up" (top right)
3. Create a free account (no credit card needed)
4. Verify your email

## Step 2: Get API Key (1 minute)

1. Go to https://api.imgbb.com/
2. Click "Get API key"
3. Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0`)

## Step 3: Configure (30 seconds)

1. Open `.env` file in your project root
2. Add your ImgBB API key:

```env
VITE_IMGBB_API_KEY=paste_your_api_key_here
```

Save the file.

## Step 4: Run Migration (Automatic - SAFE)

```bash
npm run migrate:imgbb
```

### What happens:
- ✅ Creates a backup file (in case you need to restore)
- ✅ Downloads each image from current location
- ✅ Uploads to ImgBB
- ✅ Updates Firebase with new URLs
- ✅ **Original images stay on Catbox/Unsplash** (not deleted!)

### Migration time:
- ~1-2 seconds per image
- If you have 50 images = ~2-3 minutes total

### During migration you'll see:
```
🚀 Starting migration to ImgBB...
💾 Backup created: backup-before-imgbb-migration-1234567890.json
📦 Migrating product: p_tshirt_classic (Premium T-Shirt)
  🖼️  Main image: https://files.catbox.moe/abc123.jpg...
  ✅ Uploaded to: https://i.ibb.co/xyz789/image.jpg...
  💾 Updated Firebase
✅ Migration complete!
   Migrated: 45 products
   Skipped: 5 products
```

## Step 5: Test (1 minute)

```bash
npm run dev
```

1. Go to your website
2. Check that images load correctly
3. Go to admin panel
4. Try uploading a new image
5. Verify it uploads to ImgBB (URL starts with `https://i.ibb.co/`)

## Step 6: Deploy

After testing locally:

```bash
npm run build
```

Deploy to your hosting provider and add the environment variable there:
- **Vercel**: Settings → Environment Variables → Add `VITE_IMGBB_API_KEY`
- **Netlify**: Site settings → Environment variables → Add `VITE_IMGBB_API_KEY`

---

## Benefits After Migration

- ⚡ **Faster loading** - ImgBB uses CDN (faster than Catbox)
- 🌍 **Works in Bosnia** - No geo-restrictions
- 💰 **Still FREE** - Unlimited storage forever
- 📊 **Dashboard** - See your images at https://imgbb.com/my-images
- 🔒 **Reliable** - Professional hosting service

---

## Troubleshooting

### "VITE_IMGBB_API_KEY must be set" error

- Make sure `.env` file exists in project root
- Check that `VITE_IMGBB_API_KEY=your_key` is set correctly
- Restart your dev server after changing `.env`

### Upload fails with 400 Bad Request

- Check that your API key is correct
- Make sure you copied the full key (no spaces)
- Try generating a new API key at https://api.imgbb.com/

### Images not loading after migration

- Check browser console for errors
- Verify URLs in Firebase start with `https://i.ibb.co/`
- Check that images appear in your ImgBB dashboard

### Migration is slow

- This is normal! ImgBB has rate limits
- The script adds 1-second delays between uploads
- Don't interrupt the migration - let it finish

---

## Restore from Backup (if needed)

If something goes wrong, you can restore from the backup:

1. Find the backup file: `backup-before-imgbb-migration-XXXXX.json`
2. Use Firebase console to import the backup
3. Or contact me for help restoring

**But remember: Your original images are still on Catbox/Unsplash, so nothing is lost!**

---

## After Migration

### Optional: Clean up old images

Once you've confirmed everything works, you can:
- Delete old Catbox images (they're just taking up space)
- Remove old Unsplash URLs (if any)

But there's no rush - they don't cost anything!

### ImgBB Dashboard

Visit https://imgbb.com/my-images to:
- See all your uploaded images
- Check storage usage (unlimited!)
- Manage your images

---

## Questions?

- ImgBB is 100% free forever
- No hidden costs
- No credit card required
- Unlimited storage
- Works worldwide (including Bosnia)

**Ready? Just follow the 4 steps above!** 🚀
