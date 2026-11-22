// マーケティング用の拡張データ（2026-11-22 ダッシュボード化で追加）
// data.js は extract-data.js の生成物のため直接編集しない。
// 柱・ステータスなどのマーケティング情報はこのファイルで管理し、app.js が読み込み時に統合する。

// 柱（pillar）の表示名
const pillarInfo = {
    "overseas": "海外キャリア",
    "ai-daily": "AIと働く日常",
    "building-kinapse": "Kinapseを作る",
    "clinical-kinapse-only": "臨床（Kinapse用）"
};

// ステータスの表示名
const statusInfo = {
    "draft": "下書き",
    "approved": "承認待ち",
    "posted": "投稿済み",
    "archived": "アーカイブ"
};

// 既存カテゴリーごとのマーケティング割り当て
// AIリテラシー50件 -> ai-daily・下書き、海外生活・日本比較50件 -> overseas・下書き、
// ビジネス戦略50件と学習と習慣50件 -> building-kinapse・アーカイブ（削除はしていない）
const categoryMarketing = {
    "AIリテラシー": {
        pillar: "ai-daily",
        status: "draft",
        account: "personal",
        source: "Obsidian Vault 30_output/SNS（2026-01-19生成）",
        nextAction: "下書き。柱とフックを確認して承認へ。",
        intent: "AIと働く日常の投稿（AIリテラシー）"
    },
    "海外生活・日本比較": {
        pillar: "overseas",
        status: "draft",
        account: "personal",
        source: "Obsidian Vault 30_output/SNS（2026-01-19生成）",
        nextAction: "下書き。柱とフックを確認して承認へ。",
        intent: "海外キャリアの投稿（海外生活・日本比較）"
    },
    "ビジネス戦略": {
        pillar: "building-kinapse",
        status: "archived",
        account: "personal",
        source: "Obsidian Vault 30_output/SNS（2026-01-19生成）",
        nextAction: "アーカイブ済み。再利用する場合は柱・文面を見直す。",
        intent: "Kinapseを作る投稿（ビジネス戦略）"
    },
    "学習と習慣": {
        pillar: "building-kinapse",
        status: "archived",
        account: "personal",
        source: "Obsidian Vault 30_output/SNS（2026-01-19生成）",
        nextAction: "アーカイブ済み。再利用する場合は柱・文面を見直す。",
        intent: "Kinapseを作る投稿（学習と習慣）"
    }
};

// 2026-11-22のThreads短文候補（既存200件は上書きしない。6件追加）
const newShortPosts = [
    {
        id: 1, category: "Threads短文候補",
        title: "AIがPTの代わりになるって、本気？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "AIがPTの代わりになるって、本気？",
        status: "draft", pillar: "ai-daily", hookType: "ツッコミ", account: "personal",
        source: "2026-11-22 Threads候補（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する。",
        intent: "AIがPTの代わりになるという主張へのツッコミを呼び、議論の量をはかる。"
    },
    {
        id: 2, category: "Threads短文候補",
        title: "セラピストにほしいAI機能、1つだけ挙げて？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "セラピストにほしいAI機能、1つだけ挙げて？",
        status: "draft", pillar: "ai-daily", hookType: "AI機能を聞く", account: "personal",
        source: "2026-11-22 Threads候補（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する。",
        intent: "セラピストがほしいAI機能を聞き出す。返信はKinapseの機能ニーズ調査になる。"
    },
    {
        id: 3, category: "Threads短文候補",
        title: "AIができない臨床判断、1つ挙げて？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "AIができない臨床判断、1つ挙げて？",
        status: "draft", pillar: "ai-daily", hookType: "知識引き出し", account: "personal",
        source: "2026-11-22 Threads候補（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する。",
        intent: "知識のある人が集まるかをはかる。AIにできない臨床判断を引き出す。"
    },
    {
        id: 4, category: "Threads短文候補",
        title: "AIに触診させたら、どうなる？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "AIに触診させたら、どうなる？",
        status: "draft", pillar: "ai-daily", hookType: "ツッコミ", account: "personal",
        source: "2026-11-22 Threads候補（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する。",
        intent: "AIの限界へのツッコミを呼び、議論の量をはかる。"
    },
    {
        id: 5, category: "Threads短文候補",
        title: "PT学生がAIに勝てることって何？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "PT学生がAIに勝てることって何？",
        status: "draft", pillar: "ai-daily", hookType: "知識引き出し", account: "personal",
        source: "2026-11-22 Threads候補（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する。",
        intent: "PT学生・若手PTがAIに勝てる点を聞き出し、知識のある人を集める。"
    },
    {
        id: 6, category: "Threads短文候補",
        title: "AIに何を任せたい？ノート？文献？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "AIに何を任せたい？ノート？文献？",
        status: "draft", pillar: "ai-daily", hookType: "AI機能を聞く", account: "personal",
        source: "2026-11-22 Threads候補（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する。",
        intent: "セラピストがAIに任せたい作業を聞き出す。返信はKinapseの機能ニーズ調査になる。"
    }
];

// 新カテゴリーの表示情報（data.js の categoryInfo に無ければ app.js が補う）
const newCategoryInfo = {
    "Threads短文候補": { color: "var(--gradient-1)", icon: "", slug: "threads-short" }
};
