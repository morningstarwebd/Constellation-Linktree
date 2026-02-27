const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, 'public', 'assets');

async function optimize() {
    // 1. Convert stars_bg.jpg → galaxy-background.webp
    const bgInput = path.join(assetsDir, 'stars_bg.jpg');
    const bgOutput = path.join(assetsDir, 'galaxy-background.webp');

    const bgInfo = await sharp(bgInput)
        .webp({ quality: 80, effort: 6 })
        .toFile(bgOutput);

    const bgOrigSize = fs.statSync(bgInput).size;
    console.log(`✅ galaxy-background.webp: ${(bgOrigSize / 1024).toFixed(0)}KB → ${(bgInfo.size / 1024).toFixed(0)}KB (${((1 - bgInfo.size / bgOrigSize) * 100).toFixed(0)}% smaller)`);

    // 2. Convert silhouette.png → person-silhouette.webp (preserve alpha)
    const fgInput = path.join(assetsDir, 'silhouette.png');
    const fgOutput = path.join(assetsDir, 'person-silhouette.webp');

    const fgInfo = await sharp(fgInput)
        .webp({ quality: 85, effort: 6, alphaQuality: 100 })
        .toFile(fgOutput);

    const fgOrigSize = fs.statSync(fgInput).size;
    console.log(`✅ person-silhouette.webp: ${(fgOrigSize / 1024).toFixed(0)}KB → ${(fgInfo.size / 1024).toFixed(0)}KB (${((1 - fgInfo.size / fgOrigSize) * 100).toFixed(0)}% smaller)`);

    console.log('\n🎉 Done! You can now delete the old files.');
}

optimize().catch(console.error);
