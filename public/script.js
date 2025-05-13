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

  // 動的にCSSを挿入
  const styleTag = document.createElement("style");
  styleTag.textContent = data.css;
  document.head.appendChild(styleTag);

  // CSSダウンロード用のBlobを作成
  const blob = new Blob([data.css], { type: "text/css" });
  const blobUrl = URL.createObjectURL(blob);

  const result = document.getElementById("result");
  result.innerHTML = `
    <h3>描画結果</h3>
    ${data.html}
    <h3>HTMLコード</h3>
    <pre><code>&lt;div class="pixel-art"&gt;&lt;/div&gt;</code></pre>
    <p><a href="${blobUrl}" download="pixel-art.css">CSSをダウンロード</a></p>
  `;
});
