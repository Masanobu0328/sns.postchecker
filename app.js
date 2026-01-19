// アプリケーションの状態管理
const app = {
    currentCategory: 'all',
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

        Object.keys(postsData).forEach(category => {
            postsData[category].forEach(post => {
                const prediction = this.generatePrediction(post);
                this.allPosts.push({
                    ...post,
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

        this.filteredPosts = [...this.allPosts];
        this.updateStats();
        this.renderPosts();
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

        // カテゴリーフィルター
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.filterPosts();
            });
        });

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
            const matchesCategory = this.currentCategory === 'all' || post.category === this.currentCategory;
            const matchesSearch = !this.searchQuery ||
                post.title.toLowerCase().includes(this.searchQuery) ||
                post.content.toLowerCase().includes(this.searchQuery) ||
                post.persona.toLowerCase().includes(this.searchQuery);

            return matchesCategory && matchesSearch;
        });

        this.updateStats();
        this.renderPosts();
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
                    <span class="engagement-score score-${post.scoreLevel}">${post.engagementScore}点</span>
                    <span class="post-category-badge">${post.category}</span>
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
        const cleanContent = content.replace(/\*\*/g, '').trim();
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
                <h3 class="section-title">投稿予測</h3>
                <div class="score-display">
                    <span class="score-number score-${post.scoreLevel}">${post.engagementScore}点</span>
                    <span class="score-label">伸びる確率: ${post.scoreLevel === 'high' ? '高' : post.scoreLevel === 'medium' ? '中' : '低'}</span>
                </div>
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
                            <div class="thread-handle">@masa</div>
                        </div>
                    </div>
                    <div class="thread-content">${post.content}</div>
                    <div class="thread-actions">
                        <span class="thread-action">いいね</span>
                        <span class="thread-action">返信</span>
                        <span class="thread-action">再投稿</span>
                    </div>
                </div>
                <button class="copy-btn" onclick="app.copyToClipboard(\`${this.escapeForAttribute(post.content)}\`)">
                    投稿文をコピー
                </button>
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
