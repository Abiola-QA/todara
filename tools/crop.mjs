// Splits a tall screenshot into segments for review. Usage: node tools/crop.mjs <in.png> <segmentHeight> [outPrefix]
import sharp from 'sharp';
const [input, seg = '1400', prefix = input.replace(/\.png$/, '')] = process.argv.slice(2);
const meta = await sharp(input).metadata();
const h = Number(seg);
const outs = [];
for (let y = 0, i = 0; y < meta.height; y += h, i++) {
  const out = `${prefix}-part${i}.png`;
  await sharp(input)
    .extract({ left: 0, top: y, width: meta.width, height: Math.min(h, meta.height - y) })
    .toFile(out);
  outs.push(out);
}
console.log(outs.join('\n'));
