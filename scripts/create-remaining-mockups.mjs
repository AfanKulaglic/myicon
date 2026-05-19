import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

// Keyring mockup (1000x1000)
const keyringCanvas = createCanvas(1000, 1000);
const keyringCtx = keyringCanvas.getContext('2d');
keyringCtx.fillStyle = '#00FF00';
keyringCtx.fillRect(0, 0, 1000, 1000);
writeFileSync('public/mockups/keyring-front.png', keyringCanvas.toBuffer('image/png'));

// Ice scraper mockup (1000x1000)
const icescraperCanvas = createCanvas(1000, 1000);
const icescraperCtx = icescraperCanvas.getContext('2d');
icescraperCtx.fillStyle = '#00FF00';
icescraperCtx.fillRect(0, 0, 1000, 1000);
writeFileSync('public/mockups/icescraper-front.png', icescraperCanvas.toBuffer('image/png'));

// Cap front mockup (1000x1000)
const capCanvas = createCanvas(1000, 1000);
const capCtx = capCanvas.getContext('2d');
capCtx.fillStyle = '#00FF00';
capCtx.fillRect(0, 0, 1000, 1000);
writeFileSync('public/mockups/cap-front.png', capCanvas.toBuffer('image/png'));

console.log('✅ Created remaining green PNG mockups!');
