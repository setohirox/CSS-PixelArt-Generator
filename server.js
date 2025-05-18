const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static("public"));

app.post("/generate", upload.single("image"), async (req, res) => {
  const size = parseInt(req.body.size);
  const allowedSizes = [32, 64, 128, 256, 512];
  if (!allowedSizes.includes(size)) {
    return res.status(400).send("Invalid size");
  }

  try {
    const { data, info } = await sharp(req.file.buffer)
      .resize(size, size)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    const cssLines = [];
    const pixels = [];
    const getIndex = (x, y) => (y * size + x) * channels;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = getIndex(x, y);
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = channels === 4 ? data[i + 3] / 255 : 1;
        const color = a < 1
          ? `rgba(${r},${g},${b},${a.toFixed(2)})`
          : `rgb(${r},${g},${b})`;

        cssLines.push(`linear-gradient(${color} ${y}px, ${color} ${y + 1}px) ${x}px ${y}px`);
        pixels.push({ x, y, r, g, b, a });
      }
    }

    const css = `
.pixel-art {
  width: ${size}px;
  height: ${size}px;
  background:
    ${cssLines.join(",\n    ")};
  background-size: 1px 1px;
  background-repeat: no-repeat;
}`.trim();

    res.json({
      html: ``,
      css,
      pixels,
      size,
    });
  } catch (err) {
    console.error("処理エラー:", err);
    res.status(500).send("Error processing image");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
