// マーケティング用の拡張データ（2026-11-22 ダッシュボード化で追加、2026-11-22 UIリデザインv2で拡張、2026-11-22 過去Threads実績を追加）
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
// impressions: インプレッション数 / views: Views / likes / replies: 返信数 / reposts: 再投稿数
// targetReplies: ターゲット（日本のPT・PT学生）からの返信数
// targetFollows: 投稿がきっかけのターゲットフォロー数
// followersBefore / followersAfter: 投稿前後のフォロワー数 / followerDelta: 増減（算出値）
function emptyResult48h() {
    return {
        impressions: null, views: null, likes: null, replies: null, reposts: null,
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

// 過去のThreads実績（2026-11-22取得。個人アカウント @aus_physio_masa.therapist）
// 出典：threads-cli の top-posts（期間 2025-01-01〜2026-11-22、指標 impression_count、タイムゾーン Australia/Brisbane）。
// 数字は取得時点（2026-11-22）の累計で、投稿から48時間後の値ではない。投稿別の Views は取得していないため views は null。
// replies は直接返信数（direct_reply_count）。targetReplies / targetFollows はこの集計からは判定できないため null のまま。
// 投稿の全文はここには載せない。title / content はトピックの短い題名のみ。
// ライブラリの既存200件との照合：キーフレーズ（1000万円の壁、日本は住むのに最高な国、AIを過信、日本のPTの給料が上がらない理由は？、
// 日本の一番の資産は「人」、医療費、コンビニで働く海外の方、医療制度の違い）では一致なし。
// 「日本は便利すぎる」は既存200件に同名の題名が1件あるが、内容は24時間営業・店休日の話で投稿（2026-01-26）とは角度が違い、
// 投稿コード・投稿日の一致もないため一致とみなさない。よって既存200件への紐づけは0件で、ここに10件を新規追加する。
const pastThreadsPosts = [
    {
        id: 1, category: "Threads過去実績",
        title: "1000万円の壁 — オーストラリアでPTになるのを諦めた理由",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "1000万円の壁 — オーストラリアでPTになるのを諦めた理由",
        status: "posted", pillar: "overseas", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2026-03-16", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DV74aU3AcoX",
        result48h: { impressions: 9064, views: null, likes: 35, replies: 7, reposts: 0, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    },
    {
        id: 2, category: "Threads過去実績",
        title: "日本のPTの給料が上がらない理由は？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "日本のPTの給料が上がらない理由は？",
        status: "posted", pillar: "overseas", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2026-01-11", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DTWLzZHE9jz",
        result48h: { impressions: 8794, views: null, likes: 7, replies: 19, reposts: 0, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    },
    {
        id: 3, category: "Threads過去実績",
        title: "日本は住むのに最高な国",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "日本は住むのに最高な国",
        status: "posted", pillar: "overseas", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2026-01-09", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DTR9_TIDPco",
        result48h: { impressions: 7224, views: null, likes: 134, replies: 29, reposts: 2, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    },
    {
        id: 4, category: "Threads過去実績",
        title: "日本とオーストラリアの医療制度の違い",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "日本とオーストラリアの医療制度の違い",
        status: "posted", pillar: "overseas", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2025-12-12", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DSJq39tgcPe",
        result48h: { impressions: 5432, views: null, likes: 31, replies: 16, reposts: 2, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    },
    {
        id: 5, category: "Threads過去実績",
        title: "日本とオーストラリアの医療制度の違い（先行版）",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "日本とオーストラリアの医療制度の違い（先行版）",
        status: "posted", pillar: "overseas", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2025-09-16", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DOpk5baAQwk",
        result48h: { impressions: 4801, views: null, likes: 14, replies: 8, reposts: 0, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    },
    {
        id: 6, category: "Threads過去実績",
        title: "日本の一番の資産は「人」",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "日本の一番の資産は「人」",
        status: "posted", pillar: "overseas", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2026-01-06", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DTJtgsggd0T",
        result48h: { impressions: 4566, views: null, likes: 40, replies: 1, reposts: 0, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    },
    {
        id: 7, category: "Threads過去実績",
        title: "医療費、日本と豪州どっちが高い？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "医療費、日本と豪州どっちが高い？",
        status: "posted", pillar: "overseas", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2025-09-22", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DO5TciTAuPu",
        result48h: { impressions: 3992, views: null, likes: 15, replies: 10, reposts: 1, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    },
    {
        id: 8, category: "Threads過去実績",
        title: "コンビニで働く海外の方への尊敬",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "コンビニで働く海外の方への尊敬",
        status: "posted", pillar: "overseas", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2026-01-18", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DTom0I7DnBB",
        result48h: { impressions: 3041, views: null, likes: 45, replies: 5, reposts: 0, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    },
    {
        id: 9, category: "Threads過去実績",
        title: "AIを過信している人、多くない？",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "AIを過信している人、多くない？",
        status: "posted", pillar: "ai-daily", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2026-01-04", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DTEmwbagUE9",
        result48h: { impressions: 2412, views: null, likes: 84, replies: 33, reposts: 0, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    },
    {
        id: 10, category: "Threads過去実績",
        title: "日本は便利すぎる",
        persona: "日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。",
        content: "日本は便利すぎる",
        status: "posted", pillar: "overseas", hookType: null, account: "personal",
        source: "Threads top-posts 2025-01-01〜2026-11-22（impression_count）",
        postedAt: "2026-01-26", postUrl: "https://www.threads.com/@aus_physio_masa.therapist/post/DT8xorXE27X",
        result48h: { impressions: 2230, views: null, likes: 53, replies: 14, reposts: 1, targetReplies: null, targetFollows: null, followersBefore: null, followersAfter: null, followerDelta: null, verdict: null },
        nextAction: "実測あり。ターゲット返信・フォローの内訳は過去データからは判定できないため未記録のままにする。",
        intent: "過去に投稿した実績。数字は2026-11-22取得時の累計で、48時間後の値ではない。"
    }
];

// アカウントのベースライン（2026-11-22取得。個人アカウント @aus_physio_masa.therapist）
// 出典：threads-cli の insights-overview（指標 Views）と profile-threads（1ページ目）。
// 28日・90日ウィンドウの返信0件は、その期間に新規投稿がなかったため。過去の投稿への返信（上位10件の直接返信数）は pastThreadsPosts を参照。
// フォロワー数は出典が2つある：アカウントのフォロワー数（2026-11-22時点）は250、Insightsのフォロワー推移は235。数字を合わせず、両方を出典つきで載せる。
const accountBaseline = {
    account: "personal",
    handle: "@aus_physio_masa.therapist",
    retrievedAt: "2026-11-22",
    timezone: "Australia/Brisbane",
    lastPostAt: "2026-03-27",
    lastPostNote: "最新投稿は2026-03-27（AI歩行分析アプリ、いいね6件）。その後は2026-03-19、2026-03-16と続き、2026-03-27以降の新規投稿はない（2026-11-22時点のプロフィール1ページ目で確認）。",
    followersToday: 250,
    followersNote: "アカウントのフォロワー数（2026-11-22時点）は250。Insightsのフォロワー推移は235（28日：235→235、90日：234→235）のため、出典の違う数字として両方を載せる。",
    windows: {
        "28d": {
            label: "直近28日", from: "2026-10-25", to: "2026-11-22", metric: "Views",
            views: 120, viewsFollowers: 1, viewsNonFollowers: 119, viewsChangePct: -29.8,
            likes: 1, replies: 0, quotes: 0, reposts: 0, netFollowers: 0,
            traffic: [
                { source: "THREADS_SERP", label: "検索", pct: 67.5, count: 81 },
                { source: "THREADS_PROFILE", label: "プロフィール", pct: 25.8, count: 31 },
                { source: "THREADS_PERMALINK", label: "投稿リンク", pct: 4.2, count: 5 }
            ],
            followersStart: 235, followersEnd: 235, followersLastTrendDate: "2026-11-19"
        },
        "90d": {
            label: "直近90日", from: "2026-08-24", to: "2026-11-22", metric: "Views",
            views: 705, viewsFollowers: 20, viewsNonFollowers: 685, viewsChangePct: -43.0,
            likes: 7, replies: 0, quotes: 0, reposts: 0, netFollowers: 1,
            traffic: [
                { source: "THREADS_SERP", label: "検索", pct: 53.8, count: 379 },
                { source: "THREADS_PROFILE", label: "プロフィール", pct: 35.2, count: 248 },
                { source: "THREADS_PERMALINK", label: "投稿リンク", pct: 9.1, count: 64 }
            ],
            followersStart: 234, followersEnd: 235, followersLastTrendDate: null
        }
    },
    note: "28日・90日ウィンドウの返信0件は、その期間に新規投稿がなかったためで、過去の投稿への返信が0件だったという意味ではない。"
};


 // 今週のテスト投稿 7本（2026-11-23 Mon 〜 2026-11-29 Sun、20:30 Brisbane / 19:30 Japan、1日1本）
// 投稿ルール（docs/POSTING_RULES.md）に従う。1文1行、質問は敬語、意見はカジュアルな文体。
// 「何だと思う？」は使わない。「教えてください」は入れない。
// 投稿自体はこのPRでは行わない。Threadsにスケジュール機能はないため、毎回その場で承認を得て即投稿する。
// 曜日は date -d で確認済み（2026-11-23 月 〜 2026-11-29 日）。
const testWeekPosts = [
    {
        id: 1, category: "今週のテスト投稿",
        title: 'セラピストが職場を選ぶなら、何で決めますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'セラピストが職場を選ぶなら、何で決めますか？\n年収、働き方、人、分野。\n私は絶対、人派です。',
        status: "draft", pillar: "overseas", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        testWeek: "2026-11-23", scheduledDate: "2026-11-23", scheduledTime: "20:30",
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '職場選びで何を大事にしてるかがわかる。強い意見（絶対、人派です）で反論を呼ぶ。'
    },
    {
        id: 2, category: "今週のテスト投稿",
        title: '働かなくていいぐらいお金があっても、セラピストやりますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '働かなくていいぐらいお金があっても、セラピストやりますか？\n私は週2、3くらいはやりたいです。',
        status: "draft", pillar: "overseas", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        testWeek: "2026-11-23", scheduledDate: "2026-11-24", scheduledTime: "20:30",
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: 'セラピストを続ける理由がお金かどうかがわかる。週2、3という具体的な数字でリアルに。'
    },
    {
        id: 3, category: "今週のテスト投稿",
        title: 'AIが導入されたら、未来の理学療法ってどうなると思いますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'AIが導入されたら、未来の理学療法ってどうなると思いますか？\nメガネをかけるだけで、動作分析をやってくれるようになるといいな。',
        status: "draft", pillar: "ai-daily", hookType: "未来を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        testWeek: "2026-11-23", scheduledDate: "2026-11-25", scheduledTime: "20:30",
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: 'セラピストがAIに期待する具体的な使い方がわかる。'
    },
    {
        id: 4, category: "今週のテスト投稿",
        title: 'セラピストの仕事は、AIによってどう変わると思いますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'セラピストの仕事は、AIによってどう変わると思いますか？\n客観的な評価は、人間よりAIの方ができそう。',
        status: "draft", pillar: "ai-daily", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        testWeek: "2026-11-23", scheduledDate: "2026-11-26", scheduledTime: "20:30",
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: 'AIで変わる仕事の具体像がわかる。「考える時間が増える」など抽象的な意見は書かない。'
    },
    {
        id: 5, category: "今週のテスト投稿",
        title: '今の理学療法の学生さんって、AI使って勉強してるのかな？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '今の理学療法の学生さんって、AI使って勉強してるのかな？',
        status: "draft", pillar: "ai-daily", hookType: "実態を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        testWeek: "2026-11-23", scheduledDate: "2026-11-27", scheduledTime: "20:30",
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '学生がAIをどう使って勉強してるかがわかる。2文目は不要のため削除。「教えてください」は入れない。'
    },
    {
        id: 6, category: "今週のテスト投稿",
        title: 'PTの勉強って、知識と考える力、どっちが大事ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'PTの勉強って、知識と考える力、どっちが大事ですか？',
        status: "draft", pillar: "building-kinapse", hookType: "二択で聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        testWeek: "2026-11-23", scheduledDate: "2026-11-28", scheduledTime: "20:30",
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '勉強のやり方の価値観がわかる。どっちも大事なため意見は書かない。「暗記」から「知識」に言い換えた。'
    },
    {
        id: 7, category: "今週のテスト投稿",
        title: 'セラピストにとって、技術とコミュニケーション、どっちが大事ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'セラピストにとって、技術とコミュニケーション、どっちが大事ですか？\n私は圧倒的に、コミュニケーションだと思う。',
        status: "draft", pillar: "building-kinapse", hookType: "二択で聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        testWeek: "2026-11-23", scheduledDate: "2026-11-29", scheduledTime: "20:30",
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '技術とコミュニケーションのバランス感がわかる。6番（知識と考える力）と被らないよう、知識→技術に変えた。'
    }
];

 // 改訂候補（2026-11-22改訂の残り22本）
// 今週のテスト投稿7本と重複するものは除く。
// 2026-11-22の最終修正を全23本に適用：1文1行、質問は敬語・意見はカジュアル、「何だと思う？」と「教えてください」は使わない、
// 論点チェック（それを聞いて何がわかるの？）を通らないものは落とすか言い換える、どっちも大事な二択には意見を書かない、重複テーマは片方を別テーマに変える。
const revisedCandidates = [
    {
        id: 1, category: "投稿候補（改訂）",
        title: '日本のPTが海外で働くのに、一番の壁って何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '日本のPTが海外で働くのに、一番の壁って何ですか？',
        status: "draft", pillar: "overseas", hookType: "実態を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '海外就職の壁がわかる。「教えてください」は削除。'
    },
    {
        id: 2, category: "投稿候補（改訂）",
        title: '海外で働くセラピストと、日本で働くセラピスト。違いって何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '海外で働くセラピストと、日本で働くセラピスト。\n違いって何ですか？',
        status: "draft", pillar: "overseas", hookType: "実態を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '日豪の働き方の違いがわかる。「教えてください」は削除。'
    },
    {
        id: 3, category: "投稿候補（改訂）",
        title: '日本の理学療法士と、海外の理学療法士の違いは何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '日本の理学療法士と、海外の理学療法士の違いは何ですか？\n私は、働き方の自由さだと思う。',
        status: "draft", pillar: "overseas", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '働き方の自由さという意見つき。タイトルと本文の「教えてください」を統一・削除。'
    },
    {
        id: 4, category: "投稿候補（改訂）",
        title: 'セラピストが海外で働くとき、一番大事なのって何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'セラピストが海外で働くとき、一番大事なのって何ですか？\n英語？技術？人？\n私は絶対、人だと思う。',
        status: "draft", pillar: "overseas", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '海外で働くときに大事なものがわかる。意見を「絶対」に強めた。'
    },
    {
        id: 5, category: "投稿候補（改訂）",
        title: '日本のPTが海外就職を考えるとき、何から調べますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '日本のPTが海外就職を考えるとき、何から調べますか？',
        status: "draft", pillar: "overseas", hookType: "実態を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '海外就職の調べ方がわかる。「教えてください」は削除。'
    },
    {
        id: 6, category: "投稿候補（改訂）",
        title: '海外のセラピストの働き方で、日本でも取り入れたいものって何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '海外のセラピストの働き方で、日本でも取り入れたいものって何ですか？',
        status: "draft", pillar: "overseas", hookType: "実態を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '海外の働き方で取り入れたいものがわかる。「教えてください」は削除。'
    },
    {
        id: 7, category: "投稿候補（改訂）",
        title: 'セラピストとして海外で働くなら、給料と休み、どっちを取りますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'セラピストとして海外で働くなら、給料と休み、どっちを取りますか？\n私は圧倒的に、休みだと思う。',
        status: "draft", pillar: "overseas", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '給料と休みの二択。意見を「圧倒的に」に強めた。'
    },
    {
        id: 8, category: "投稿候補（改訂）",
        title: 'セラピストとしてAIを使うとしたら、どんな使い方がありますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'セラピストとしてAIを使うとしたら、どんな使い方がありますか？\n私はまず、文献調べに使いたい。',
        status: "draft", pillar: "ai-daily", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: 'AIの使い方がわかる。意見をカジュアルな文体に直した。'
    },
    {
        id: 9, category: "投稿候補（改訂）",
        title: 'AIに文献を調べてもらうのと、自分で読むの、どっちがいいですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'AIに文献を調べてもらうのと、自分で読むの、どっちがいいですか？',
        status: "draft", pillar: "ai-daily", hookType: "二択で聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '文献調べと自分で読むの二択。どっちも大事なため意見は書かない。'
    },
    {
        id: 10, category: "投稿候補（改訂）",
        title: 'セラピストの仕事で、AIに任せていいことって何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'セラピストの仕事で、AIに任せていいことって何ですか？\n私は、ノートの下書きから任せたいです。',
        status: "draft", pillar: "ai-daily", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: 'AIに任せていい仕事がわかる。意見をカジュアルな文体に直した。'
    },
    {
        id: 11, category: "投稿候補（改訂）",
        title: 'AIがあっても、教科書は必要だと思いますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'AIがあっても、教科書は必要だと思いますか？\n私は絶対、必要だと思います。',
        status: "draft", pillar: "ai-daily", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '教科書の必要性がわかる。意見を「絶対」に強めた。'
    },
    {
        id: 12, category: "投稿候補（改訂）",
        title: '臨床の「なぜ」を、AIに聞くのと先輩に聞くの、どっちに聞いてますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '臨床の「なぜ」を、AIに聞くのと先輩に聞くの、どっちに聞いてますか？\n私は、先輩に聞く派です。',
        status: "draft", pillar: "ai-daily", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '臨床の「なぜ」の聞き先がわかる。意見をカジュアルな文体に直した。'
    },
    {
        id: 13, category: "投稿候補（改訂）",
        title: 'AIが普及した10年後のPTって、どんな姿になってると思いますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'AIが普及した10年後のPTって、どんな姿になってると思いますか？\n私は、考える力がもっと大事になると思う。',
        status: "draft", pillar: "ai-daily", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '10年後のPT像がわかる。20番と重複するため、20番を別テーマに変えた。'
    },
    {
        id: 14, category: "投稿候補（改訂）",
        title: 'セラピストとして、AIに聞く前に自分で考えることって何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'セラピストとして、AIに聞く前に自分で考えることって何ですか？\n私は圧倒的に、仮説を立てることだと思います。',
        status: "draft", pillar: "ai-daily", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: 'AIに聞く前に自分で考えることがわかる。意見を「圧倒的に」に強めた。'
    },
    {
        id: 15, category: "投稿候補（改訂）",
        title: '論文を読んで、臨床でどうやって使ってますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '論文を読んで、臨床でどうやって使ってますか？',
        status: "draft", pillar: "building-kinapse", hookType: "実態を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '論文の読み方・使い方がわかる。2つ目の問いと「教えてください」を削除し、1問に絞った。'
    },
    {
        id: 16, category: "投稿候補（改訂）",
        title: '先輩に質問するとき、どうやって聞いてますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '先輩に質問するとき、どうやって聞いてますか？',
        status: "draft", pillar: "building-kinapse", hookType: "実態を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '先輩への聞き方がわかる。13番（AI vs 先輩の聞き先）と重複するため、聞き方にテーマを変えた。「教えてください」は削除。'
    },
    {
        id: 17, category: "投稿候補（改訂）",
        title: '教科書以外で、臨床の勉強に使ってるものって何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '教科書以外で、臨床の勉強に使ってるものって何ですか？',
        status: "draft", pillar: "building-kinapse", hookType: "実態を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '教科書以外の勉強の道具がわかる。12番（教科書は必要か）と重複するため、テーマを変えた。'
    },
    {
        id: 18, category: "投稿候補（改訂）",
        title: '理学療法士って、肉体労働ですか、知的労働ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '理学療法士って、肉体労働ですか、知的労働ですか？',
        status: "draft", pillar: "building-kinapse", hookType: "二択で聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '肉体労働と知的労働の二択。どっちも大事なため意見は書かない。'
    },
    {
        id: 19, category: "投稿候補（改訂）",
        title: '10年後、セラピストに残ってほしい仕事って何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '10年後、セラピストに残ってほしい仕事って何ですか？',
        status: "draft", pillar: "building-kinapse", hookType: "実態を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '10年後に残ってほしい仕事がわかる。14番（10年後のPT像）と重複するため、テーマを変えた。「教えてください」は削除。'
    },
    {
        id: 20, category: "投稿候補（改訂）",
        title: '臨床の経験を、AIに残す方法って何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '臨床の経験を、AIに残す方法って何ですか？\n私は、思考の過程を残すことだと思います。',
        status: "draft", pillar: "building-kinapse", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '思考の過程を残すという意見つき。「何だと思う？」は使わず「何ですか？」に言い換えた。'
    },
    {
        id: 21, category: "投稿候補（改訂）",
        title: 'セラピストの臨床の思考を、AIに残すって必要だと思いますか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: 'セラピストの臨床の思考を、AIに残すって必要だと思いますか？\n私は絶対、必要だと思います。',
        status: "draft", pillar: "building-kinapse", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: '臨床の思考をAIに残す必要性がわかる。意見を「絶対」に強めた。'
    },
    {
        id: 22, category: "投稿候補（改訂）",
        title: '臨床の思考を次の世代に残す方法って、何ですか？',
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: '臨床の思考を次の世代に残す方法って、何ですか？\n私は、ノートに残すことだと思います。',
        status: "draft", pillar: "building-kinapse", hookType: "意見を聞く", account: "personal",
        source: "2026-11-22 投稿ルール改訂（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: 'ノートに残すという意見つき。「何だと思う？」は使わず「何ですか？」に言い換えた。'
    }
];

// 2026-11-24 今後の投稿アイデア（2本、未承認・未投稿）
const futurePostIdeas = [
    {
        id: 1, category: "今後の投稿アイデア",
        title: "先輩に聞く vs AIに聞く",
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: "先輩に聞くのと、AIに聞くの、どっちがいいと思いますか？",
        status: "draft", pillar: "building-kinapse", hookType: "実態を聞く", account: "personal",
        source: "2026-11-24 Itoiのアイデア（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "文言を決めてから承認。承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: "先輩に聞くかAIに聞くか。2026-11-24にItoiが議題として浮かべた。意見は未定（先輩派かAI派か、Itoiの本音を入れる）。"
    },
    {
        id: 2, category: "今後の投稿アイデア",
        title: "理学療法士の皆さん、AIってどうやって使ってますか？",
        persona: '日本の理学療法士（整形外科・20代）およびPT学生。AIに関心があり、海外キャリアも意識している。',
        content: "理学療法士の皆さん、AIってどうやって使ってますか？\n普段の使い方を教えてください。",
        status: "draft", pillar: "ai-daily", hookType: "実態を聞く", account: "personal",
        source: "2026-11-24 Itoiのアイデア（Museとの検討）",
        postedAt: null, postUrl: null, result48h: null,
        nextAction: "文言を決めてから承認。承認されたらThreadsに即投稿（Threadsにスケジュール機能はない）。48時間後に判定する.",
        intent: "PTのAIの普段の使い方を聞く。返信がKinapseの機能ニーズ調査になる。"
    }
];

// 新カテゴリーの表示情報（data.js の categoryInfo に無ければ app.js が補う）
const newCategoryInfo = {
    "Threads短文候補": { color: "var(--gradient-1)", icon: "", slug: "threads-short" },
    "Kinapse 解剖リール01": { color: "var(--gradient-1)", icon: "", slug: "kinapse-reel01" },
    "Threads過去実績": { color: "var(--gradient-1)", icon: "", slug: "threads-past" },
    "今週のテスト投稿": { color: "var(--gradient-1)", icon: "", slug: "test-week" },
    "投稿候補（改訂）": { color: "var(--gradient-1)", icon: "", slug: "revised-candidates" },
    "今後の投稿アイデア": { color: "var(--gradient-1)", icon: "", slug: "future-ideas" }
};
