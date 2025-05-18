document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const res = await fetch("/generate", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) return alert("画像処理に失敗しました");

  const data = await res.json();

  // CSS適用
  const styleTag = document.createElement("style");
  styleTag.textContent = data.css;
  document.head.appendChild(styleTag);

  // CSSダウンロードリンク用 Blob
  const blob = new Blob([data.css], { type: "text/css" });
  const blobUrl = URL.createObjectURL(blob);

  const result = document.getElementById("result");

  // HTMLコード（表示専用）
  const htmlCode = `<div class="pixel-art"></div>`;

  result.innerHTML = `
    <h3>HTMLコード</h3>
    <pre><code id="html-code">${htmlCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
      <button class="copy-button" data-target="html-code">コピー</button>
    </pre>

    <h3>CSSコード</h3>
    <pre><code id="css-code">${data.css.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
      <button class="copy-button" data-target="css-code">コピー</button>
    </pre>

    <p><a href="${blobUrl}" download="pixel-art.css">CSSをダウンロード</a></p>
  `;

  // コピー処理
  document.querySelectorAll(".copy-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const text = document.getElementById(targetId).innerText;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "コピー済み";
        setTimeout(() => (btn.textContent = "コピー"), 1500);
      });
    });
  });

  // canvas 描画
  const canvas = document.getElementById("preview");
  const ctx = canvas.getContext("2d");
  canvas.width = data.size;
  canvas.height = data.size;

  const tooltip = document.getElementById("css-tooltip");

  // イメージデータ生成
  const imageData = ctx.createImageData(data.size, data.size);
  for (let i = 0; i < data.pixels.length; i++) {
    const { r, g, b, a } = data.pixels[i];
    const idx = i * 4;
    imageData.data[idx] = r;
    imageData.data[idx + 1] = g;
    imageData.data[idx + 2] = b;
    imageData.data[idx + 3] = Math.round(a * 255);
  }

  // 描画用バッファを保持
  ctx.putImageData(imageData, 0, 0);

  // ピクセル位置
  let hoverX = -1;
  let hoverY = -1;

  // 再描画（ハイライト含む）
  function redrawCanvas() {
    ctx.putImageData(imageData, 0, 0);

    if (hoverX >= 0 && hoverY >= 0) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.strokeRect(hoverX, hoverY, 1, 1);
    }
  }

  // マウス移動時
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

  // マウスが外れた時
  canvas.addEventListener("mouseleave", () => {
    hoverX = -1;
    hoverY = -1;
    redrawCanvas();
    tooltip.textContent = "";
  });
});
