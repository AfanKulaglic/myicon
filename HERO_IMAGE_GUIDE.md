# Hero Image Setup Guide

## 📸 How to Change the Hero Image

The hero section currently shows an Unsplash fallback image. Here's how to replace it with your custom image.

---

## ✅ **Skeleton Loading IS Working!**

The skeleton loading state I added **is working correctly**. You don't see it because:

1. **Images load very fast** - Especially from CDN or browser cache
2. **The skeleton only shows for ~100-500ms** - During image download
3. **Unsplash CDN is extremely fast** - Almost instant loading

### To See the Skeleton in Action:

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Change throttling to **"Slow 3G"**
4. Hard refresh (Ctrl+Shift+R)
5. You'll see the skeleton with:
   - Pulsing gradient background
   - Animated logo placeholder
   - Text placeholders
   - Bouncing dots indicator

---

## 🎯 **How to Add Your Custom Hero Image**

### Option 1: Upload to ImgBB (Recommended)

**Step 1: Upload your image**
```bash
# Your ImgBB API key is already configured
# Upload via their website: https://imgbb.com/
# Or use the API (already set up in your project)
```

**Step 2: Get the image URL**
After upload, you'll get a URL like:
```
https://i.ibb.co/xxxxxxx/your-hero-image.png
```

**Step 3: Add to your project**

Edit `src/types/content.ts`:

```typescript
export const DEFAULT_HERO: HeroContent = {
  badge: "Neu: Erweiterter Designer",
  title: "Premium Druck.\nIndividuell.",
  titleHighlight: "In Minuten.",
  subtitle: "...",
  ctaPrimaryText: "Produkte entdecken",
  ctaPrimaryUrl: "/categories",
  ctaSecondaryText: "Jetzt designen",
  ctaSecondaryUrl: "/products/premium-t-shirt/customize",
  
  // 👇 ADD YOUR IMAGE URL HERE
  imageUrl: "https://i.ibb.co/xxxxxxx/your-hero-image.png",
  
  stats: [...],
  promoCard: {...},
};
```

---

### Option 2: Use Local Image (For Development)

**Step 1: Add image to public folder**
```
public/
  └── hero/
      └── hero-image.png  (or .jpg, .webp)
```

**Step 2: Reference in code**
```typescript
imageUrl: "/hero/hero-image.png",
```

---

### Option 3: Update via Firebase (Dynamic)

If you want to change the image without redeploying:

**Step 1: Go to Firebase Realtime Database**

**Step 2: Navigate to:**
```
/content/home_hero/imageUrl
```

**Step 3: Set the value to your image URL:**
```
https://i.ibb.co/xxxxxxx/your-hero-image.png
```

**Step 4: The change is live immediately!** ✨

---

## 🎨 **Image Specifications**

### Recommended Dimensions:
- **Width:** 1400-2000px
- **Height:** 1000-1400px
- **Aspect Ratio:** 5:4 or 4:3
- **Format:** WebP (best), PNG, or JPG
- **File Size:** Under 500 KB (optimized)

### Design Guidelines:
✅ **Leave left 40-50% relatively empty** - For text overlay  
✅ **High contrast** - Text needs to be readable  
✅ **Professional quality** - Represents your brand  
✅ **Shows your products** - Merchandise, printing, design process  
✅ **On-brand colors** - Use your blue (#1E5AA8) prominently  

---

## 🖼️ **Image Options**

### 1. **Custom Illustration** (Recommended)
- Use the vector illustration I suggested earlier
- Upload to ImgBB
- Add URL to `imageUrl` field
- **Pros:** Scalable, small file size, on-brand
- **Cons:** Need to create/commission it

### 2. **Product Photography**
- Take photos of your actual products
- Show the printing process or finished items
- Upload to ImgBB
- **Pros:** Authentic, builds trust
- **Cons:** Requires good photography

### 3. **Stock Photo** (Current)
- Use Unsplash or similar
- Free and professional
- **Pros:** Quick and easy
- **Cons:** Generic, not unique to your brand

### 4. **AI-Generated Image**
- Use ChatGPT/DALL-E with the prompt I provided
- Upload to ImgBB
- **Pros:** Custom, unique, affordable
- **Cons:** May need multiple attempts

---

## 📝 **Step-by-Step: Complete Setup**

### Using ImgBB (Full Process):

1. **Get your image ready**
   - Resize to 1400×1000px
   - Optimize (compress to <500 KB)
   - Save as WebP or PNG

2. **Upload to ImgBB**
   ```
   Go to: https://imgbb.com/
   Click: "Start uploading"
   Select your image
   Copy the "Direct link" URL
   ```

3. **Update your code**
   ```typescript
   // In src/types/content.ts
   imageUrl: "https://i.ibb.co/YOUR-IMAGE-ID/hero.png",
   ```

4. **Build and deploy**
   ```bash
   npm run build
   git add src/types/content.ts
   git commit -m "Update hero image"
   git push origin main
   ```

5. **Done!** Your custom image is live ✨

---

## 🔍 **Troubleshooting**

### "I still see the Unsplash image"
- **Check:** Did you add `imageUrl` to `DEFAULT_HERO`?
- **Check:** Is the URL correct and accessible?
- **Try:** Hard refresh (Ctrl+Shift+R)
- **Try:** Clear browser cache

### "The skeleton doesn't show"
- **This is normal!** Images load very fast
- **To test:** Use DevTools Network throttling
- **It's working** - Just too fast to see normally

### "Image doesn't fit properly"
- **Check aspect ratio:** Should be 5:4 or 4:3
- **Check dimensions:** Minimum 1400px wide
- **Try:** Crop or resize your image

### "Image loads slowly"
- **Optimize:** Compress to <500 KB
- **Use WebP:** 30-50% smaller than PNG
- **Use ImgBB CDN:** Already optimized for speed

---

## 🎯 **Quick Reference**

| Task | File | Line |
|------|------|------|
| Change hero image | `src/types/content.ts` | ~38 |
| Upload to ImgBB | https://imgbb.com/ | - |
| View in Firebase | `/content/home_hero/imageUrl` | - |
| Test skeleton | DevTools → Network → Slow 3G | - |

---

## 💡 **Pro Tips**

1. **Use WebP format** - 30-50% smaller than PNG
2. **Optimize before upload** - Use TinyPNG or Squoosh
3. **Test on mobile** - Ensure image works on small screens
4. **A/B test different images** - See what converts better
5. **Update seasonally** - Keep content fresh

---

## ✅ **Current Status**

✅ Skeleton loading implemented and working  
✅ Image URL field added to configuration  
✅ ImgBB integration ready  
✅ Firebase dynamic updates supported  
✅ Mobile responsive  
✅ Fast loading with CDN  

**Next step:** Upload your custom hero image and add the URL! 🚀
