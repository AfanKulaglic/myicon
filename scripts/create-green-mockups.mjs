import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { mkdirSync } from 'fs';

// Create directories
try { mkdirSync('public/mockups/flyer', { recursive: true }); } catch {}
try { mkdirSync('public/mockups/bcard', { recursive: true }); } catch {}
try { mkdirSync('public/mockups/poster', { recursive: true }); } catch {}
try { mkdirSync('public/mockups/brochure', { recursive: true }); } catch {}

// Flyer mockups (1000x1050)
const flyerCanvas = createCanvas(1000, 1050);
const flyerCtx = flyerCanvas.getContext('2d');
flyerCtx.fillStyle = '#00FF00';
flyerCtx.fillRect(0, 0, 1000, 1050);
writeFileSync('public/mockups/flyer-front.png', flyerCanvas.toBuffer('image/png'));
writeFileSync('public/mockups/flyer-back.png', flyerCanvas.toBuffer('image/png'));

// Business card mockups (1000x800)
const bcardCanvas = createCanvas(1000, 800);
const bcardCtx = bcardCanvas.getContext('2d');
bcardCtx.fillStyle = '#00FF00';
bcardCtx.fillRect(0, 0, 1000, 800);
writeFileSync('public/mockups/bcard-front.png', bcardCanvas.toBuffer('image/png'));
writeFileSync('public/mockups/bcard-back.png', bcardCanvas.toBuffer('image/png'));

// Poster mockup (1000x1300)
const posterCanvas = createCanvas(1000, 1300);
const posterCtx = posterCanvas.getContext('2d');
posterCtx.fillStyle = '#00FF00';
posterCtx.fillRect(0, 0, 1000, 1300);
writeFileSync('public/mockups/poster-front.png', posterCanvas.toBuffer('image/png'));

// Brochure mockup (1000x1050)
const brochureCanvas = createCanvas(1000, 1050);
const brochureCtx = brochureCanvas.getContext('2d');
brochureCtx.fillStyle = '#00FF00';
brochureCtx.fillRect(0, 0, 1000, 1050);
writeFileSync('public/mockups/brochure-front.png', brochureCanvas.toBuffer('image/png'));

// Mousepad mockup (1000x1000)
const mousepadCanvas = createCanvas(1000, 1000);
const mousepadCtx = mousepadCanvas.getContext('2d');
mousepadCtx.fillStyle = '#00FF00';
mousepadCtx.fillRect(0, 0, 1000, 1000);
writeFileSync('public/mockups/mousepad.png', mousepadCanvas.toBuffer('image/png'));

// Umbrella mockup (1000x1000)
const umbrellaCanvas = createCanvas(1000, 1000);
const umbrellaCtx = umbrellaCanvas.getContext('2d');
umbrellaCtx.fillStyle = '#00FF00';
umbrellaCtx.fillRect(0, 0, 1000, 1000);
writeFileSync('public/mockups/umbrella.png', umbrellaCanvas.toBuffer('image/png'));

console.log('✅ Created all green PNG mockups!');
