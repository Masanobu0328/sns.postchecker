# SNS投稿ライブラリ

Obsidian VaultのSNS投稿候補を美しく整理し、いつでも閲覧・検索できるモバイル最適化Webサイトです。

![SNS投稿ライブラリ](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## デモ

Threads風のクリーンなデザインで、実際の投稿イメージを確認しながらコンテンツを管理できます。

## 特徴

- **Threads風デザイン**: 実際のSNS投稿と同じ見た目でプレビュー
- **モバイルファースト**: スマホでの閲覧に完全最適化
- **全文表示**: メインフィードで投稿の全文を確認可能
- **高速検索**: キーワードで即座に投稿を検索
- **カテゴリーフィルター**: AI、ビジネス、学習で絞り込み
- **ワンタップコピー**: 投稿文を簡単にコピー
- **150件の投稿**: すべての投稿候補を一元管理

## 使い方

### サイトを開く

1. `index.html`をブラウザで開く
2. または`start.html`からアクセス

### 投稿を探す

1. **検索**: 上部の検索バーにキーワードを入力
2. **フィルター**: カテゴリーチップをタップして絞り込み
3. **閲覧**: 投稿カードで全文を確認

### 投稿をコピー

1. 投稿カードをタップしてモーダルを開く
2. 「投稿プレビュー」で実際の見た目を確認
3. 「投稿文をコピー」ボタンをタップ
4. SNSアプリに貼り付けて使用

## データ更新

Markdownファイルを更新した後、以下のコマンドでデータを再生成:

```bash
cd sns-posts
node extract-data.js
```

## ファイル構成

```
sns-posts/
├── index.html          # メインHTML
├── style.css           # Threads風スタイルシート
├── app.js              # アプリケーションロジック
├── data.js             # 投稿データ（自動生成）
├── extract-data.js     # データ抽出スクリプト
├── start.html          # ランディングページ
├── README.md           # このファイル
└── .gitignore          # Git除外設定
```

## カスタマイズ

### カラーテーマの変更

`style.css`の`:root`セクションで色を変更できます:

```css
:root {
    --bg-primary: #ffffff;      /* 背景色 */
    --text-primary: #000000;    /* テキスト色 */
    --accent: #0095f6;          /* アクセントカラー */
}
```

### カテゴリーの追加

1. `extract-data.js`の`markdownFiles`に新しいカテゴリーを追加
2. `categoryInfo`に表示情報を追加
3. `node extract-data.js`を実行

## 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: モダンなスタイリング、Threads風デザイン
- **Vanilla JavaScript**: フレームワーク不要の軽量実装
- **Node.js**: データ抽出スクリプト

## 統計

- **総投稿数**: 150件
- **カテゴリー**: 3つ（AIリテラシー、ビジネス戦略、学習と習慣）
- **各カテゴリー**: 50件ずつ

## デプロイ

### GitHub Pages

1. リポジトリの Settings > Pages に移動
2. Source を `main` ブランチに設定
3. `https://masanobu0328.github.io/sns.postchecker/` でアクセス可能

### ローカル

```bash
# シンプルなHTTPサーバーで起動
npx serve .
```

## ライセンス

MIT License

## 作成者

Masa

---

作成日: 2026-01-19
