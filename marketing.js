// マーケティング用の拡張データ（2026-11-22 ダッシュボード化で追加、2026-11-22 UIリデザインv2で拡張）
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

// アカウントの表示名
const accountInfo = {
    "personal": "個人アカウント",
    "kinapse": "Kinapseアカウント"
};

// 48時間後の実績フィールド（すべて未記録の場合は null）
// impressions: インプレッション数 / views: Views / likes / replies: 返信数
// targetReplies: ターゲット（日本のPT・PT学生）からの返信数
// targetFollows: 投稿がきっかけのターゲットフォロー数
// followersBefore / followersAfter: 投稿前後のフォロワー数 / followerDelta: 増減（算出値）
function emptyResult48h() {
    return {
        impressions: null, views: null, likes: null, replies: null,
        targetReplies: null, targetFollows: null,
        followersBefore: null, followersAfter: null, followerDelta: null,
        verdict: null
    };
}

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
// 個人アカウント用（@aus_physio_masa.therapist）
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

// Kinapse用 Threads下書き（臨床系。Kinapseアカウント作成後に投稿する）
// 出典：Drive「Kinapse 解剖リール01 Threads下書き｜2026-11-15.md」
// （解剖リール01「膝が内側に入る＝中殿筋が弱い？」のThreads下書き5案のうち案1・案2・案3を原文のまま収録。
//  案4・案5は同ファイル内にあり、未収録。上腕二頭筋のリール02の下書きはこのファイルには無かったため、ここには入れていない。
//  臨床の主張はファイルの原文の範囲のみで、新しい主張は作っていない。）
const kinapsePosts = [
    {
        id: 1, category: "Kinapse 解剖リール01",
        title: "「膝が内側に入る＝中殿筋が弱い」って、よく聞く。",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。臨床の「なぜ」を出典つきで知りたい層。",
        content: "「膝が内側に入る＝中殿筋が弱い」って、よく聞く。\n\nでも、22本の論文をまとめたレビューでは、健康な人で筋力の弱さと膝の入り方の関係は、はっきりしなかった。\n関係なしの研究が多くて、逆の結果もあった。\n\n中殿筋が関わらないって話じゃない。\n弱さ＝原因、とは言えないってこと。\n\n（Cashman ら 2026、系統的レビュー）",
        status: "draft", pillar: "clinical-kinapse-only", hookType: "数字で常識をひっくり返す", account: "kinapse",
        source: "Kinapse 解剖リール01 Threads下書き｜2026-11-15.md（Drive）案2。Cashman ら 2026、系統的レビュー（22本）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "Kinapseアカウント作成後に投稿。投稿前にPTの目で言い過ぎがないか確認する。",
        intent: "数字で常識をひっくり返す。22本のレビューで「弱さ＝原因とは言えない」を示す。"
    },
    {
        id: 2, category: "Kinapse 解剖リール01",
        title: "膝が内側に入る人を見て、「中殿筋が弱いね」で終わってない？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。臨床の「なぜ」を出典つきで知りたい層。",
        content: "膝が内側に入る人を見て、「中殿筋が弱いね」で終わってない？",
        status: "draft", pillar: "clinical-kinapse-only", hookType: "核心の1行・問いかけ", account: "kinapse",
        source: "Kinapse 解剖リール01 Threads下書き｜2026-11-15.md（Drive）案1",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "Kinapseアカウント作成後に投稿。投稿前にPTの目で言い過ぎがないか確認する。",
        intent: "核心の1行の問いかけで、評価の深掘りを促す。"
    },
    {
        id: 3, category: "Kinapse 解剖リール01",
        title: "膝が内側に入るとき、筋力だけ見てない？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。臨床の「なぜ」を出典つきで知りたい層。",
        content: "膝が内側に入るとき、筋力だけ見てない？\n\n見るのは3つ。\n・骨盤が傾いてないか、太ももが内に入ってないか\n・足先の向き、踵が浮いてないか\n・体幹が横に流れてないか\n\n正面から見た「膝の入り方」は、太ももの捻れだけでも変わって見える。\n次の評価で、ちょっと意識してみて。",
        status: "draft", pillar: "clinical-kinapse-only", hookType: "保存されるチェックリスト", account: "kinapse",
        source: "Kinapse 解剖リール01 Threads下書き｜2026-11-15.md（Drive）案3",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "Kinapseアカウント作成後に投稿。投稿前にPTの目で言い過ぎがないか確認する。",
        intent: "保存されるチェックリスト型。評価で見る3つのポイントを示す。"
    }
];

// 新カテゴリーの表示情報（data.js の categoryInfo に無ければ app.js が補う）
const newCategoryInfo = {
    "Threads短文候補": { color: "var(--gradient-1)", icon: "", slug: "threads-short" },
    "Kinapse 解剖リール01": { color: "var(--gradient-1)", icon: "", slug: "kinapse-reel01" }
};
