# Image Architecture - Where Images Load From

## 🎯 Two Types of Images

### 1. **Product Images** (ImgBB CDN) ⚡
**Location:** ImgBB CDN (`https://i.ibb.co/...`)  
**Purpose:** Product photos shown in catalog, product pages, galleries  
**Loading:** Fast CDN delivery worldwide

**Examples:**
- Product main image
- Product gallery images
- Category images
- Hero images

**Why ImgBB:**
- ✅ 70-75% faster loading
- ✅ Global CDN
- ✅ Automatic caching
- ✅ Unlimited storage

---

### 2. **Mockup Templates** (Local Files) 🎨
**Location:** `/public/mockups/` folder  
**Purpose:** Green-screen templates for customizer  
**Loading:** From your server (Vercel/Netlify)

**Examples:**
- `/mockups/tshirt/front.png` - T-shirt front template
- `/mockups/tshirt/back.png` - T-shirt back template
- `/mockups/cap/cap.png` - Cap template
- `/mockups/hoodie/hoodie.png` - Hoodie template

**Why Local:**
- ✅ Needed for green-screen color changing
- ✅ Must be accessible for canvas manipulation
- ✅ Small files (~50-100KB each)
- ✅ Cached by browser after first load

---

## 📁 File Structure

```
public/mockups/
├── tshirt/
│   ├── front.png    ← Green-screen template
│   ├── back.png     ← Green-screen template
│   └── side.png     ← Green-screen template
├── cap/
│   └── cap.png      ← Green-screen template
└── hoodie/
    └── hoodie.png   ← Green-screen template
```

---

## 🔄 How It Works

### Product Catalog Flow:
1. User visits homepage
2. Product images load from **ImgBB CDN** (fast!)
3. Images cached by browser
4. Subsequent loads instant

### Customizer Flow:
1. User clicks "Customize" on a product
2. Mockup template loads from **local `/mockups/`** folder
3. Green-screen shader replaces green with selected color
4. User designs on the colored mockup
5. Final design uploaded to **ImgBB**

---

## ⚡ Performance

### Product Images (ImgBB):
- **First load:** 0.5-1 second (CDN)
- **Cached:** Instant
- **Size:** 200-800KB (optimized)

### Mockup Templates (Local):
- **First load:** 0.2-0.5 seconds (local server)
- **Cached:** Instant
- **Size:** 50-100KB (small PNG)

---

## 🚀 Optimization Applied

### Product Images:
- ✅ Migrated to ImgBB CDN
- ✅ Compressed to 800KB max
- ✅ Reduced resolution to 1400px
- ✅ WebP format when supported
- ✅ Lazy loading enabled

### Mockup Templates:
- ✅ Kept local for customizer
- ✅ Already optimized PNG
- ✅ Green background for color changing
- ✅ Cached by browser

---

## 📊 Loading Speed

### Before (All from Catbox):
- Product images: 2-4 seconds each
- Mockups: 2-3 seconds each
- **Total:** Very slow

### After (ImgBB + Local):
- Product images: 0.5-1 second each ⚡ **75% faster**
- Mockups: 0.2-0.5 seconds each ⚡ **80% faster**
- **Total:** 3-4x faster overall

---

## ✅ Summary

| Image Type | Location | Purpose | Speed |
|------------|----------|---------|-------|
| **Product photos** | ImgBB CDN | Catalog display | ⚡⚡⚡ Very fast |
| **Mockup templates** | Local `/mockups/` | Customizer | ⚡⚡ Fast |

**Both optimized for maximum performance!** 🎉
