# 🚀 ImgBB Migration - Quick Start

## ⚠️ YOUR IMAGES ARE SAFE!
This migration **DOES NOT DELETE** your original images. They stay on Catbox/Unsplash!

---

## 4 Simple Steps:

### 1️⃣ Get ImgBB API Key (2 minutes)
1. Go to https://imgbb.com and sign up (FREE)
2. Go to https://api.imgbb.com/ and get your API key
3. Copy the key

### 2️⃣ Configure (30 seconds)
Edit `.env` file:
```env
VITE_IMGBB_API_KEY=paste_your_key_here
```

### 3️⃣ Migrate (Automatic)
```bash
npm run migrate:imgbb
```

**What happens:**
- ✅ Creates backup file (safe!)
- ✅ Copies images to ImgBB
- ✅ Updates Firebase URLs
- ✅ Original images stay on Catbox (not deleted!)

**Time:** ~1-2 seconds per image

### 4️⃣ Test
```bash
npm run dev
```

Check that images load correctly!

---

## Why ImgBB?

- ✅ **FREE unlimited storage** forever
- ✅ **Faster than Catbox** (CDN delivery)
- ✅ **Works in Bosnia** (and worldwide)
- ✅ **No credit card** required
- ✅ **Professional hosting**

---

## Need Help?

Read `IMGBB_SETUP.md` for detailed instructions.

**Your images are safe - the migration only copies them!** 🎉
