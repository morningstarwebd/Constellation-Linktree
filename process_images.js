const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

async function processImages() {
    try {
        const silhouettePath = path.join(__dirname, 'WhatsApp Image 2026-02-27 at 3.18.20 AM.jpeg');
        const bgPath = path.join(__dirname, 'WhatsApp Image 2026-02-27 at 3.18.21 AM.jpeg');

        // Process silhouette
        console.log('Processing silhouette...');
        const img = await Jimp.read(silhouettePath);

        // Make background transparent. The silhouette is very dark, the background is light.
        img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // If the pixel is mostly light/grey/white, make it transparent
            if (red > 80 && green > 80 && blue > 80) {
                this.bitmap.data[idx + 3] = 0; // alpha to 0 (transparent)
            } else {
                // Option to make the silhouette completely black for a clean look, 
                // to match the original image. Let's keep the dark pixels as they are.
            }
        });

        const assetsDir = path.join(__dirname, 'public', 'assets');
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        await img.writeAsync(path.join(assetsDir, 'silhouette.png'));
        console.log('Saved silhouette.png');

        // Copy background
        fs.copyFileSync(bgPath, path.join(assetsDir, 'stars_bg.jpg'));
        console.log('Saved stars_bg.jpg');

    } catch (err) {
        console.error('Error:', err);
    }
}

processImages();
