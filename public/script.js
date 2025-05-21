document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const loading = document.getElementById("loading");
  loading.style.display = "block"; // Show loading

  const res = await fetch("/generate", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    loading.style.display = "none";
    return alert("Failed to process image");
  }

  const data = await res.json();

  // Apply CSS
  const styleTag = document.createElement("style");
  styleTag.textContent = data.css;
  document.head.appendChild(styleTag);

  // CSS download link Blob
  const blob = new Blob([data.css], { type: "text/css" });
  const blobUrl = URL.createObjectURL(blob);

  const result = document.getElementById("result");

  // HTML code (display only)
  const htmlCode = `<div class="pixel-art"></div>`;

  result.innerHTML = `
    <h3>HTML Code</h3>
    <pre><code id="html-code">${htmlCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
      <button class="copy-button" data-target="html-code">Copy</button>
    </pre>

    <h3>CSS Code</h3>
    <pre><code id="css-code">${data.css.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
      <button class="copy-button" data-target="css-code">Copy</button>
    </pre>

    <p><a href="${blobUrl}" download="pixel-art.css">Download CSS</a></p>
  `;

  // Copy process
  document.querySelectorAll(".copy-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const text = document.getElementById(targetId).innerText;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      });
    });
  });

  // canvas drawing
  const canvas = document.getElementById("preview");
  const ctx = canvas.getContext("2d");
  canvas.width = data.size;
  canvas.height = data.size;

  const tooltip = document.getElementById("css-tooltip");

  // Generate image data
  const imageData = ctx.createImageData(data.size, data.size);
  for (let i = 0; i < data.pixels.length; i++) {
    const { r, g, b, a } = data.pixels[i];
    const idx = i * 4;
    imageData.data[idx] = r;
    imageData.data[idx + 1] = g;
    imageData.data[idx + 2] = b;
    imageData.data[idx + 3] = Math.round(a * 255);
  }

  ctx.putImageData(imageData, 0, 0);

  let hoverX = -1;
  let hoverY = -1;

  function redrawCanvas() {
    ctx.putImageData(imageData, 0, 0);
    if (hoverX >= 0 && hoverY >= 0) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.strokeRect(hoverX, hoverY, 1, 1);
    }
  }

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const index = y * data.size + x;
    const pixel = data.pixels[index];

    if (pixel) {
      hoverX = x;
      hoverY = y;
      redrawCanvas();

      const { r, g, b, a } = pixel;
      const color = a < 1 ? `rgba(${r},${g},${b},${a.toFixed(2)})` : `rgb(${r},${g},${b})`;
      tooltip.textContent = `linear-gradient(${color} ${y}px, ${color} ${y + 1}px) ${x}px ${y}px;`;
    }
  });

  canvas.addEventListener("mouseleave", () => {
    hoverX = -1;
    hoverY = -1;
    redrawCanvas();
    tooltip.textContent = "";
  });

  loading.style.display = "none"; // Hide loading
});
