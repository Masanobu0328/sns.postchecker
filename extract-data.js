// Markdownファイルから投稿データを抽出するスクリプト
// Node.jsで実行してdata.jsを生成する

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Markdownファイルのパス
const markdownFiles = {
    'AIリテラシー': 'c:/Users/masan/Documents/Obsidian Vault/30_output/SNS/OUT_SNS_AIリテラシー.md',
    'ビジネス戦略': 'c:/Users/masan/Documents/Obsidian Vault/30_output/SNS/OUT_SNS_ビジネス戦略.md',
    '学習と習慣': 'c:/Users/masan/Documents/Obsidian Vault/30_output/SNS/OUT_SNS_学習と習慣.md'
};

// Markdownから投稿を抽出
function extractPosts(markdown) {
    const posts = [];

    // <details>タグで囲まれた各投稿を抽出
    const detailsRegex = /<details>([\s\S]*?)<\/details>/g;
    let match;
    let postNumber = 1;

    while ((match = detailsRegex.exec(markdown)) !== null) {
        const detailsContent = match[1];

        // summaryからタイトルを抽出
        const summaryMatch = detailsContent.match(/<summary>(.*?)<\/summary>/);
        if (!summaryMatch) continue;

        const summaryText = summaryMatch[1].trim();
        // 番号とタイトルを分離
        const titleMatch = summaryText.match(/^\d+\.\s*(.+)$/);
        const title = titleMatch ? titleMatch[1] : summaryText;

        // ターゲット（ペルソナ）を抽出
        const personaMatch = detailsContent.match(/\*\*ターゲット（ペルソナ）\*\*：\s*\n(.+?)(?=\n\n)/s);
        const persona = personaMatch ? personaMatch[1].trim() : '';

        // 投稿文を抽出
        const contentMatch = detailsContent.match(/\*\*投稿文\*\*：\s*\n([\s\S]*?)(?=\n\*\*思考|$)/);
        const content = contentMatch ? contentMatch[1].trim() : '';

        if (title && content) {
            posts.push({
                id: postNumber++,
                title: title,
                persona: persona,
                content: content
            });
        }
    }

    return posts;
}

// 全カテゴリーのデータを読み込み
const postsData = {};

Object.keys(markdownFiles).forEach(category => {
    const filePath = markdownFiles[category];

    try {
        const markdown = fs.readFileSync(filePath, 'utf-8');
        postsData[category] = extractPosts(markdown);
        console.log(`✓ ${category}: ${postsData[category].length}件の投稿を抽出`);
    } catch (error) {
        console.error(`✗ ${category}の読み込みエラー:`, error.message);
        postsData[category] = [];
    }
});

// カテゴリー情報
const categoryInfo = {
    "AIリテラシー": {
        color: "var(--gradient-1)",
        icon: "",
        slug: "ai"
    },
    "ビジネス戦略": {
        color: "var(--gradient-2)",
        icon: "",
        slug: "business"
    },
    "学習と習慣": {
        color: "var(--gradient-3)",
        icon: "",
        slug: "learning"
    }
};

// JavaScriptファイルとして出力
const output = `// SNS投稿データ
// ${new Date().toISOString()}に自動生成

const postsData = ${JSON.stringify(postsData, null, 4)};

// カテゴリー情報
const categoryInfo = ${JSON.stringify(categoryInfo, null, 4)};
`;

const outputPath = path.join(__dirname, 'data.js');
fs.writeFileSync(outputPath, output, 'utf-8');

console.log(`\n✓ data.jsを生成しました: ${outputPath}`);
console.log(`総投稿数: ${Object.values(postsData).reduce((sum, posts) => sum + posts.length, 0)}件`);
