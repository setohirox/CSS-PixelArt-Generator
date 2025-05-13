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
    const result = document.getElementById("result");
    result.innerHTML = data.html +
        `<p><a href="${data.cssFile}" download>CSSをダウンロード</a></p>`;
});
