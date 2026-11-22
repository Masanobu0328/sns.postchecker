// アプリケーションの状態管理
const app = {
    currentCategory: 'all',
    currentPillar: 'all',
    currentStatus: 'all',
    currentHook: 'all',
    searchQuery: '',
    allPosts: [],
    filteredPosts: [],

    init() {
        this.loadPosts();
        this.setupEventListeners();
        this.hideLoading();
    },

    loadPosts() {
        // データを統合してフラットな配列に変換
        this.allPosts = [];
        let globalId = 1;

        // 新カテゴリーの表示情報を補う（marketing.js）
        if (typeof newCategoryInfo !== 'undefined') {
            Object.keys(newCategoryInfo).forEach(cat => {
                if (!categoryInfo[cat]) categoryInfo[cat] = newCategoryInfo[cat];
            });
        }

        Object.keys(postsData).forEach(category => {
            postsData[category].forEach(post => {
                // マーケティング拡張は marketing.js で管理（data.js は生成物のため直接編集しない）
                const marketing = (typeof categoryMarketing !== 'undefined' && categoryMarketing[category]) || {};
                const enriched = {
                    status: 'draft',
                    pillar: null,
                    hookType: null,
                    account: 'personal',
                    source: '',
                    postedAt: null,
                    postUrl: null,
                    result48h: null,
                    nextAction: '',
                    intent: '',
                    ...marketing,
                    ...post,
                    // data.js に拡張フィールドが無い場合は marketing.js の値を残す
                    status: post.status || marketing.status || 'draft',
                    pillar: post.pillar || marketing.pillar || null,
                    hookType: post.hookType || marketing.hookType || null,
                    account: post.account || marketing.account || 'personal',
                    source: post.source || marketing.source || '',
                    postedAt: post.postedAt || null,
                    postUrl: post.postUrl || null,
                    result48h: post.result48h || null,
                    nextAction: post.nextAction || marketing.nextAction || '',
                    intent: post.intent || marketing.intent || ''
                };
                const prediction = this.generatePrediction(enriched);
                this.allPosts.push({
                    ...enriched,
                    globalId: globalId++,
                    category: category,
                    categorySlug: categoryInfo[category].slug,
                    engagementScore: prediction.score,
                    scoreLevel: prediction.level,
                    predictionReasons: prediction.reasons,
                    improvements: prediction.improvements
                });
            });
        });

        // 2026-11-22のThreads短文候補6件を追加（既存200件は上書きしない）
        if (typeof newShortPosts !== 'undefined') {
            newShortPosts.forEach(post => {
                const prediction = this.generatePrediction(post);
                this.allPosts.push({
                    ...post,
                    globalId: globalId++,
                    categorySlug: (categoryInfo[post.category] || {}).slug || 'threads-short',
                    engagementScore: prediction.score,
                    scoreLevel: prediction.level,
                    predictionReasons: prediction.reasons,
                    improvements: prediction.improvements
                });
            });
        }

        this.filteredPosts = [...this.allPosts];
        this.updateDashboard();
        this.updateStats();
        this.renderPosts();
    },

    // 表示用に整形: ハッシュタグと「**文字数**: N文字」の行を除く（data.js の原文は残す）
    cleanDisplay(content) {
        return (content || '')
            .replace(/\*\*文字数\*\*:?\s*\d+文字/g, '')
            .replace(/#[^\s#]+/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    },

    pillarLabel(post) {
        return (typeof pillarInfo !== 'undefined' && pillarInfo[post.pillar]) || post.pillar || '未分類';
    },

    statusLabel(post) {
        return (typeof statusInfo !== 'undefined' && statusInfo[post.status]) || post.status || '下書き';
    },

    generatePrediction(post) {
        let score = 40; // ベーススコア（エキスパート基準）
        const reasons = [];
        const improvements = [];

        const lines = post.content.split('\n').filter(l => l.trim());
        const hook = lines[0] || '';
        const cta = lines[lines.length - 1] || '';

        // 1. フックの衝撃度 (MAX 20)
        let hookScore = 0;
        if (hook.length > 0) {
            if (/\d+/.test(hook)) hookScore += 8; // 数字による具体性
            if (hook.includes('！') || hook.includes('？')) hookScore += 5; // 感情/疑問
            if (hook.includes('「') && hook.includes('」')) hookScore += 7; // カギカッコによる台詞/強調
        }
        if (hookScore >= 15) {
            reasons.push('強いフック：冒頭の一行で読者の注意を引く具体的要素がある');
        } else {
            improvements.push('冒頭の改善：数字や具体的なエピソードを一行目に配置してスクロールを止める工夫を');
        }
        score += hookScore;

        // 2. 明快さと読みやすさ (MAX 20)
        let clarityScore = 0;
        if (post.content.length < 140) clarityScore += 10; // 文字数（短さは正義）
        if (post.content.includes('・')) clarityScore += 10; // 箇条書きによる構造化

        if (clarityScore >= 15) {
            reasons.push('構造の明快さ：箇条書きや適切な文字数で情報の消化を助けている');
        } else {
            improvements.push('可読性の向上：箇条書きを活用し、一目で全体像がわかる構造に');
        }
        score += clarityScore;

        // 3. 提供価値と独自の洞察 (MAX 20)
        let valueScore = 0;
        const keywords = ['結論', '理由', 'コツ', '法則', '戦略', '本質', 'AI'];
        keywords.forEach(kw => {
            if (post.content.includes(kw)) valueScore += 3;
        });
        valueScore = Math.min(20, valueScore);

        if (valueScore >= 12) {
            reasons.push('提供価値：独自の知見や明快な結論が提示されている');
        } else {
            improvements.push('価値の追加：その投稿を読むことで読者が得られる「独自の学び」を強調して');
        }
        score += valueScore;

        // 4. エンゲージメント誘発 (MAX 15)
        let ctaScore = 0;
        if (cta.includes('？')) ctaScore += 15;

        if (ctaScore > 0) {
            reasons.push('高い対話性：末尾の問いかけが自然で、返信のハードルを下げる工夫がある');
        } else {
            improvements.push('CTAの強化：最後に具体的な問いかけを置き、読者のアウトプットを促して');
        }
        score += ctaScore;

        // 5. インパクト/共有性 (MAX 25)
        let impactScore = 5;
        if (post.persona.length > 20) impactScore += 10; // ターゲットが明確
        if (post.title.length < 40) impactScore += 10; // タイトルがキャッチー
        score += impactScore;

        // スコアを0-100に正規化
        score = Math.min(100, Math.max(0, score));

        // エキスパート基準の判定
        let level = 'low';
        if (score >= 85) level = 'high'; // 85点以上がエキスパート
        else if (score >= 60) level = 'medium';

        return {
            score,
            level,
            reasons: reasons.length > 0 ? reasons : ['基本要素をさらに研ぎ澄ます余地があります'],
            improvements: improvements.length > 0 ? improvements : ['現状でも非常に質が高いですが、時代に合わせて微調整を推奨します']
        };
    },

    setupEventListeners() {
        // 検索
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            clearSearch.style.display = this.searchQuery ? 'flex' : 'none';
            this.filterPosts();
        });

        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            clearSearch.style.display = 'none';
            this.filterPosts();
        });

        // 柱（pillar）フィルター
        document.querySelectorAll('.chip[data-pillar]').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.chip[data-pillar]').forEach(c => c.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentPillar = e.currentTarget.dataset.pillar;
                this.filterPosts();
            });
        });

        // ステータス / フック型フィルター
        const statusSelect = document.getElementById('statusFilter');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                this.currentStatus = e.target.value;
                this.filterPosts();
            });
        }
        const hookSelect = document.getElementById('hookFilter');
        if (hookSelect) {
            hookSelect.addEventListener('change', (e) => {
                this.currentHook = e.target.value;
                this.filterPosts();
            });
        }

        // モーダル
        const modal = document.getElementById('postModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');

        modalOverlay.addEventListener('click', () => this.closeModal());
        modalClose.addEventListener('click', () => this.closeModal());

        // モーダルコンテンツのクリックでモーダルが閉じないように
        document.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    },

    filterPosts() {
        this.filteredPosts = this.allPosts.filter(post => {
            const matchesPillar = this.currentPillar === 'all' || post.pillar === this.currentPillar;
            // ステータス「すべて」はアーカイブを除く。アーカイブは「アーカイブ」を選んだときだけ表示する
            const matchesStatus = this.currentStatus === 'all'
                ? post.status !== 'archived'
                : post.status === this.currentStatus;
            const matchesHook = this.currentHook === 'all' || post.hookType === this.currentHook;
            const matchesSearch = !this.searchQuery ||
                post.title.toLowerCase().includes(this.searchQuery) ||
                this.cleanDisplay(post.content).toLowerCase().includes(this.searchQuery) ||
                post.persona.toLowerCase().includes(this.searchQuery);

            return matchesPillar && matchesStatus && matchesHook && matchesSearch;
        });

        this.updateStats();
        this.renderPosts();
    },

    updateDashboard() {
        const counts = { draft: 0, approved: 0, posted: 0, archived: 0 };
        this.allPosts.forEach(post => { if (counts[post.status] !== undefined) counts[post.status]++; });
        const needsJudgement = this.allPosts.filter(post =>
            post.status === 'posted' && !post.result48h).length;
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('countDraft', counts.draft);
        set('countApproved', counts.approved);
        set('countPosted', counts.posted);
        set('countNeedsJudgement', needsJudgement);
        set('countArchived', counts.archived);

        // 次のテスト枠: 下書きの先頭3件（Threads短文候補を優先）
        const drafts = this.allPosts.filter(post => post.status === 'draft');
        const next = [...drafts].sort((a, b) =>
            (a.category === 'Threads短文候補' ? 0 : 1) - (b.category === 'Threads短文候補' ? 0 : 1)
        ).slice(0, 3);
        const nextEl = document.getElementById('nextTests');
        if (nextEl) {
            nextEl.innerHTML = next.length ? next.map((post, i) =>
                `<li><span class="next-rank">${i + 1}</span> ${this.cleanDisplay(post.content).split('\n')[0]}`
                + ` <span class="next-meta">${this.pillarLabel(post)}${post.hookType ? ' / ' + post.hookType : ''}</span></li>`
            ).join('') : '<li>下書きがありません</li>';
        }

        // 柱別の内訳（アーカイブを除く）
        const pillarCounts = {};
        this.allPosts.filter(post => post.status !== 'archived').forEach(post => {
            pillarCounts[post.pillar] = (pillarCounts[post.pillar] || 0) + 1;
        });
        const pillarEl = document.getElementById('pillarBreakdown');
        if (pillarEl) {
            pillarEl.innerHTML = Object.keys(pillarCounts).map(pillar =>
                `<span class="pillar-stat"><span class="pillar-name">${this.pillarLabel({ pillar })}</span> ${pillarCounts[pillar]}件</span>`
            ).join('') || 'なし';
        }
    },

    updateStats() {
        document.getElementById('totalPosts').textContent = this.filteredPosts.length;
    },

    renderPosts() {
        const container = document.getElementById('postsContainer');

        if (this.filteredPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <h3>投稿が見つかりませんでした</h3>
                    <p>検索条件を変更してみてください</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredPosts.map(post => `
            <article class="post-card" data-id="${post.globalId}">
                <div class="post-header-new">
                    <span class="engagement-score score-${post.scoreLevel}">予測 ${post.engagementScore}点</span>
                    <span class="post-category-badge">${this.pillarLabel(post)}</span>
                    <span class="post-status-badge status-${post.status}">${this.statusLabel(post)}</span>
                    ${post.hookType ? `<span class="post-hook-badge">${post.hookType}</span>` : ''}
                </div>
                <h2 class="post-title-large">${post.title}</h2>
                <p class="post-preview">${this.getPreview(post.content)}</p>
            </article>
        `).join('');

        // カードクリックイベント
        container.querySelectorAll('.post-card').forEach(card => {
            card.addEventListener('click', () => {
                const postId = parseInt(card.dataset.id);
                this.openModal(postId);
            });
        });
    },

    getPreview(content) {
        // 最初の2行のみ表示（省略記号付き）
        const cleanContent = this.cleanDisplay(content).replace(/\*\*/g, '').trim();
        const lines = cleanContent.split('\n');

        if (lines.length > 2) {
            return lines.slice(0, 2).join('\n') + '...';
        }
        return cleanContent;
    },

    openModal(postId) {
        const post = this.allPosts.find(p => p.globalId === postId);
        if (!post) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="modal-header">
                <span class="modal-category">${post.category}</span>
                <h1 class="modal-title">${post.title}</h1>
            </div>
            
            <div class="prediction-section">
                <h3 class="section-title">投稿予測（実測ではない）</h3>
                <div class="score-display">
                    <span class="score-number score-${post.scoreLevel}">${post.engagementScore}点</span>
                    <span class="score-label">伸びる確率（予測）: ${post.scoreLevel === 'high' ? '高' : post.scoreLevel === 'medium' ? '中' : '低'}</span>
                </div>
                <p class="prediction-note">このスコアはフック・文字数などからのヒューリスティック予測です。実測の反応ではありません。</p>
                <div class="prediction-details">
                    <h4>予測理由</h4>
                    <ul>
                        ${post.predictionReasons.map(reason => `<li>${reason}</li>`).join('')}
                    </ul>
                    <h4>改善提案</h4>
                    <ul>
                        ${post.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="thread-preview-section">
                <div class="preview-label">投稿プレビュー</div>
                <div class="thread-preview">
                    <div class="thread-header">
                        <div class="thread-avatar">M</div>
                        <div class="thread-user-info">
                            <div class="thread-username">Masa</div>
                            <div class="thread-handle">@aus_physio_masa.therapist</div>
                        </div>
                    </div>
                    <div class="thread-content">${this.cleanDisplay(post.content)}</div>
                    <div class="thread-actions">
                        <span class="thread-action">いいね</span>
                        <span class="thread-action">返信</span>
                        <span class="thread-action">再投稿</span>
                    </div>
                </div>
                <button class="copy-btn" onclick="app.copyToClipboard(\`${this.escapeForAttribute(this.cleanDisplay(post.content))}\`)">
                    投稿文をコピー
                </button>
            </div>
            
            <div class="modal-section">
                <h3 class="section-title">マーケティング</h3>
                <div class="section-content">
                    <p class="persona-text"><strong>狙い:</strong> ${post.intent || this.pillarLabel(post) + 'の投稿'}</p>
                    <p class="persona-text"><strong>柱:</strong> ${this.pillarLabel(post)}${post.hookType ? ' / フック: ' + post.hookType : ''}</p>
                    <p class="persona-text"><strong>ステータス:</strong> ${this.statusLabel(post)}${post.postedAt ? '（投稿日: ' + post.postedAt + '）' : ''}</p>
                    <p class="persona-text"><strong>参照元:</strong> ${post.source || '未記録'}</p>
                    <p class="persona-text"><strong>48時間の結果:</strong> ${post.result48h ? `Views ${post.result48h.views} / いいね ${post.result48h.likes} / 返信 ${post.result48h.replies} / ターゲット返信 ${post.result48h.targetReplies} / ターゲットフォロー ${post.result48h.targetFollows} / 判定: ${post.result48h.verdict}` : '未記録（投稿から48時間後に判定する）'}</p>
                    <p class="persona-text"><strong>次にやること:</strong> ${post.nextAction || '未定'}</p>
                    ${post.postUrl ? `<p class="persona-text"><a href="${post.postUrl}" target="_blank" rel="noopener">投稿を開く</a></p>` : ''}
                </div>
            </div>

            <div class="modal-section">
                <h3 class="section-title">ターゲット（ペルソナ）</h3>
                <div class="section-content">
                    <p class="persona-text">${post.persona}</p>
                </div>
            </div>
        `;

        document.getElementById('postModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        document.getElementById('postModal').classList.remove('active');
        document.body.style.overflow = '';
    },

    escapeForAttribute(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$')
            .replace(/\n/g, '\\n');
    },

    async copyToClipboard(text) {
        // エスケープされた文字を元に戻す
        const cleanText = text
            .replace(/\\n/g, '\n')
            .replace(/\\\$/g, '$')
            .replace(/\\`/g, '`')
            .replace(/\\\\/g, '\\');

        try {
            await navigator.clipboard.writeText(cleanText);
            this.showToast();
        } catch (err) {
            // フォールバック: テキストエリアを使用
            const textarea = document.createElement('textarea');
            textarea.value = cleanText;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast();
        }
    },

    showToast() {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    },

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 500);
    }
};

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// PWA対応: サービスワーカー登録（オプション）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 将来的にオフライン対応する場合はここでサービスワーカーを登録
    });
}
