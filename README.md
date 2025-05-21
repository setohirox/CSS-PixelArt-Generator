# 画像CSS変換ツール

画像をCSSのピクセルアートに変換するWebアプリケーションです。linear-gradientを使用して、画像ファイルを使用せずにWebアプリケーションでピクセルアートを表現できます。

## 機能

- 画像をCSSピクセルアートに変換
- 出力サイズの調整（32x32から512x512まで）
- ピクセル情報のリアルタイムプレビュー
- HTMLとCSSコードのワンクリックコピー
- 生成されたCSSファイルのダウンロード

## デモ

1. 画像ファイルをアップロード
2. 希望の出力サイズを選択
3. 「生成」ボタンをクリックして変換
4. プレビューにマウスを重ねるとピクセル情報を確認
5. 生成されたコードをコピーまたはCSSファイルをダウンロード

## インストール

1. リポジトリをクローン:
```bash
git clone https://github.com/yourusername/css-pixelart-generator.git
cd css-pixelart-generator
```

2. 依存関係をインストール:
```bash
npm install
```

3. サーバーを起動:
```bash
npm start
```

4. ブラウザで `http://localhost:3000` にアクセス

## 使用方法

1. ファイル入力欄をクリックして画像を選択
2. ドロップダウンメニューから希望の出力サイズを選択
3. 「生成」ボタンをクリックして変換を開始
4. プレビューに変換された画像が表示されます
5. プレビューにマウスを重ねると各ピクセルのCSSコードを確認
6. コピーボタンを使用してHTMLまたはCSSコードをコピー
7. 「Download CSS」をクリックして生成されたCSSファイルを保存

## 技術詳細

- フロントエンド: HTML, CSS, JavaScript
- バックエンド: Node.js
- 画像処理: Canvas API
- 出力: CSS linear-gradient

## ブラウザ対応

- Chrome（推奨）
- Firefox
- Safari
- Edge

## ライセンス

MITライセンス - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add some amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. プルリクエストを作成