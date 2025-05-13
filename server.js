const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/generate", upload.single("image"), async (req, res) => {
    const size = parseInt(req.body.size);
    const filePath = req.file.path;
    const cssLines = [];

    try {
        const { data, info } = await sharp(filePath)
            .resize(size, size)
            .raw()
            .toBuffer({ resolveWithObject: true });

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 3;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const color = `rgb(${r},${g},${b})`;
                cssLines.push(`linear-gradient(${color} ${y}px, ${color} ${y + 1}px) ${x}px ${y}px`);
            }
        }

        const css = `
.pixel-art {
  width: ${size}px;
  height: ${size}px;
  background-image: ${cssLines.join(",\n    ")};
  background-size: 1px 1px;
  background-repeat: no-repeat;
}
    `.trim();

        const filename = `pixel-art-${Date.now()}.css`;
        const outputPath = path.join(__dirname, "output", filename);
        fs.writeFileSync(outputPath, css);

        res.json({
            html: `<div class="pixel-art"></div>`,
            cssFile: `/download/${filename}`
        });

        fs.unlinkSync(filePath); // 一時ファイル削除
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing image");
    }
});

app.use("/download", express.static("output"));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
