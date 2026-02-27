const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

async function extractStars() {
    try {
        const bgPath = path.join(__dirname, 'public', 'assets', 'stars_bg.jpg');
        console.log('Loading background image from:', bgPath);
        const img = await Jimp.read(bgPath);

        const width = img.bitmap.width;
        const height = img.bitmap.height;

        console.log(`Image dimensions: ${width}x${height}`);

        const stars = [];
        // We only want to sample a portion of the pixels to keep the JSON size manageable
        const step = 4;

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                // Only look at the top 75% of the image to avoid the mountains
                if (y > height * 0.75) continue;

                const idx = (width * y + x) << 2;
                const r = img.bitmap.data[idx];
                const g = img.bitmap.data[idx + 1];
                const b = img.bitmap.data[idx + 2];

                // Calculate brightness
                const brightness = (r + g + b) / 3;

                // If it's a star (bright and blueish/white)
                if (brightness > 180 && b >= r * 0.9) {
                    const nx = (x / width) - 0.5;
                    const ny = -(y / height) + 0.5;

                    const size = brightness > 230 ? 2.5 : (brightness > 200 ? 1.5 : 1.0);

                    // Determine if this star is part of the central Milky Way band
                    // The Milky Way in this image is characterized by a bright, hazy band across the upper/middle area
                    // We can approximate this by looking at the neighborhood brightness or simply by the overall brightness
                    // If the background (non-star) in this area is bright, it's likely in the Milky Way

                    // Simplified approach: the user's drawing highlights the main band. 
                    // Since the user wants a group of stars to pulse differently, let's flag the brightest 
                    // stars as "milky way" stars that should pulse more distinctly.
                    // Or better yet, flag stars in areas with higher background brightness.

                    let bgBrightness = 0;
                    let count = 0;
                    // Sample a slightly wider area around the star to check background
                    for (let dy = -10; dy <= 10; dy += 5) {
                        for (let dx = -10; dx <= 10; dx += 5) {
                            if (x + dx >= 0 && x + dx < width && y + dy >= 0 && y + dy < height) {
                                const idx2 = (width * (y + dy) + (x + dx)) << 2;
                                bgBrightness += (img.bitmap.data[idx2] + img.bitmap.data[idx2 + 1] + img.bitmap.data[idx2 + 2]) / 3;
                                count++;
                            }
                        }
                    }
                    bgBrightness = bgBrightness / count;

                    // If the background around the star is relatively bright, it's in the Milky Way band
                    const isMilkyWay = bgBrightness > 50;

                    stars.push({
                        x: nx,
                        y: ny,
                        b: brightness / 255,
                        s: size,
                        mw: isMilkyWay ? 1 : 0 // Flag for the shader
                    });
                }
            }
        }

        // Sort by brightness descending and take top N stars
        stars.sort((a, b) => b.b - a.b);
        const topStars = stars.slice(0, 1500); // More stars

        console.log(`Saving top ${topStars.length} stars to JSON.`);

        // Count how many are flagged as Milky Way
        const mwCount = topStars.filter(s => s.mw === 1).length;
        console.log(`Found ${mwCount} stars in the Milky Way area.`);

        const outputPath = path.join(__dirname, 'src', 'data', 'starmap.json');
        fs.writeFileSync(outputPath, JSON.stringify(topStars));

        console.log('Done!');

    } catch (err) {
        console.error('Error extracting stars:', err);
    }
}

extractStars();
