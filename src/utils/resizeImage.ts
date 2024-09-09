import sharp from "sharp";

async function resizeImageBuffer(imageBuffer: string, size: number) {
  return sharp(imageBuffer).resize(size, size).toBuffer();
}

export { resizeImageBuffer };
