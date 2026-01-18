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
                this.allPosts.push({
                    ...post,
                    globalId: globalId++,
                    category: category,
                    categorySlug: categoryInfo[category].slug
                });
            });
        });

        this.filteredPosts = [...this.allPosts];
        this.updateStats();
        this.renderPosts();
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
                <div class="post-header">
                    <div class="post-avatar">M</div>
                    <div class="post-header-info">
                        <div class="post-username">Masa</div>
                        <div class="post-meta-line">
                            <span class="post-category">${post.category}</span>
                            <span>·</span>
                            <span class="post-number">#${post.id}</span>
                        </div>
                    </div>
                </div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-preview">${this.getPreview(post.content)}</p>
                <div class="post-meta">
                    <span class="meta-tag">ターゲット設定済</span>
                </div>
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
        // 全文を表示
        return content.replace(/\*\*/g, '').trim();
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
            </div>
            
            <div class="modal-section">
                <h3 class="section-title">ターゲット（ペルソナ）</h3>
                <div class="section-content">
                    <p class="persona-text">${post.persona}</p>
                </div>
            </div>
            
            <div class="modal-section">
                <h3 class="section-title">投稿文（編集用）</h3>
                <div class="section-content">
                    <p class="post-text">${post.content}</p>
                    <button class="copy-btn" onclick="app.copyToClipboard(\`${this.escapeForAttribute(post.content)}\`)">
                        投稿文をコピー
                    </button>
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
