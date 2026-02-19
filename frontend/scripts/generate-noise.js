const sharp = require('sharp');
const path = require('path');

async function generateNoiseTexture() {
  const size = 128;
  const pixels = [];

  // Generate random noise pixels
  for (let i = 0; i < size * size; i++) {
    const value = Math.floor(Math.random() * 40) + 200; // Light gray range
    pixels.push(value, value, value, 20); // RGBA with low alpha
  }

  await sharp(Buffer.from(pixels), {
    raw: {
      width: size,
      height: size,
      channels: 4,
    },
  })
    .png()
    .toFile(path.join(__dirname, '../public/textures/noise.png'));

  console.log('✅ Noise texture generated successfully');
}

generateNoiseTexture().catch(console.error);
