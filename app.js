// アプリケーションの状態管理（2026-11-22 UIリデザインv2）
// 左サイドバーで画面を切り替える。投稿はすべて1つの配列で持ち、
// 各ビューは「どの投稿を見せるか」の絞り込み条件だけが違う。
const app = {
    currentView: 'dashboard',
    currentPillar: 'all',
    currentStatus: 'all',
    currentHook: 'all',
    searchQuery: '',
    allPosts: [],
    filteredPosts: [],

    viewTitles: {
        dashboard: ['ダッシュボード', 'マーケティングの状況をひと目で見る'],
        candidates: ['投稿候補', '出していない下書きの一覧'],
        personal: ['個人アカウント', '@aus_physio_masa.therapist'],
        kinapse: ['Kinapse用', 'Kinapseアカウント（作成前）専用'],
        results: ['実績・分析', '投稿したものの結果を追う'],
        archive: ['アーカイブ', '投稿候補から外したもの']
    },

    // ビューごとの絞り込み条件（検索・柱・ステータス・フックはこの上でさらに絞る）
    viewPredicate(post) {
        switch (this.currentView) {
            case 'candidates': return post.status === 'draft';
            case 'personal': return post.account === 'personal' && post.status !== 'archived';
            case 'kinapse': return post.account === 'kinapse';
            case 'archive': return post.status === 'archived';
            case 'results': return post.status === 'posted';
            default: return true;
        }
    },

    // init() は絶対にローディング画面を残したまま終わらない。
    // loadPosts / setupEventListeners / switchView のどこかで例外が出ても、
    // finally で必ず hideLoading() し、エラーがあれば画面に理由を出す。
    // （2026-11-22 の障害：旧 app.js と新 index.html の組み合わせで
    //  loadPosts が例外を吐き、hideLoading() に到達せず固まった）
    init() {
        try {
            this.loadPosts();
            this.setupEventListeners();
            this.switchView('dashboard');
            window.__snsReady = true;
        } catch (err) {
            console.error('SNS投稿ライブラリの起動に失敗しました', err);
            this.showLoadError(err);
        } finally {
            this.hideLoading();
        }
    },

    // 起動失敗を画面に表示する（ローディングの下に隠れないよう、overlay を消してから出す）
    showLoadError(err) {
        const el = document.getElementById('loadError');
        if (el) {
            el.hidden = false;
            const detail = el.querySelector('[data-error-detail]');
            if (detail && err) detail.textContent = String(err && err.message ? err.message : err);
        }
    },

    loadPosts() {
        this.allPosts = [];
        let globalId = 1;

        if (typeof newCategoryInfo !== 'undefined') {
            Object.keys(newCategoryInfo).forEach(cat => {
                if (!categoryInfo[cat]) categoryInfo[cat] = newCategoryInfo[cat];
            });
        }

        const enrich = (post, marketing) => {
            const result48h = this.normalizeResult(post.result48h);
            return {
                status: 'draft', pillar: null, hookType: null, account: 'personal',
                source: '', postedAt: null, postUrl: null, result48h,
                nextAction: '', intent: '',
                ...marketing,
                ...post,
                status: post.status || marketing.status || 'draft',
                pillar: post.pillar || marketing.pillar || null,
                hookType: post.hookType || marketing.hookType || null,
                account: post.account || marketing.account || 'personal',
                source: post.source || marketing.source || '',
                postedAt: post.postedAt || null,
                postUrl: post.postUrl || null,
                result48h,
                nextAction: post.nextAction || marketing.nextAction || '',
                intent: post.intent || marketing.intent || ''
            };
        };

        Object.keys(postsData).forEach(category => {
            postsData[category].forEach(post => {
                // 1件のデータが壊れていても全体を止めない。壊れた投稿だけ飛ばす。
                try {
                    const marketing = (typeof categoryMarketing !== 'undefined' && categoryMarketing[category]) || {};
                    const enriched = enrich(post, marketing);
                    const prediction = this.generatePrediction(enriched);
                    this.allPosts.push({
                        ...enriched, globalId: globalId++, category,
                        categorySlug: (categoryInfo[category] || {}).slug || 'uncategorized',
                        engagementScore: prediction.score, scoreLevel: prediction.level,
                        predictionReasons: prediction.reasons, improvements: prediction.improvements
                    });
                } catch (e) {
                    console.warn('投稿データの読み込みをスキップしました', category, post && post.id, e);
                    this.skippedPosts = (this.skippedPosts || 0) + 1;
                }
            });
        });

        // 2026-11-22のThreads短文候補6件（個人アカウント用）
        if (typeof newShortPosts !== 'undefined') {
            newShortPosts.forEach(post => {
                const enriched = enrich(post, {});
                const prediction = this.generatePrediction(enriched);
                this.allPosts.push({
                    ...enriched, globalId: globalId++,
                    categorySlug: (categoryInfo[post.category] || {}).slug || 'threads-short',
                    engagementScore: prediction.score, scoreLevel: prediction.level,
                    predictionReasons: prediction.reasons, improvements: prediction.improvements
                });
            });
        }

        // Kinapse用 Threads下書き（解剖リール01。Driveの原文のまま）
        if (typeof kinapsePosts !== 'undefined') {
            kinapsePosts.forEach(post => {
                const enriched = enrich(post, {});
                const prediction = this.generatePrediction(enriched);
                this.allPosts.push({
                    ...enriched, globalId: globalId++,
                    categorySlug: (categoryInfo[post.category] || {}).slug || 'kinapse-reel01',
                    engagementScore: prediction.score, scoreLevel: prediction.level,
                    predictionReasons: prediction.reasons, improvements: prediction.improvements
                });
            });
        }

        // 過去のThreads実績10件（2026-11-22取得の実測。ライブラリ209件とは別枠で、ここにだけ追加する）
        if (typeof pastThreadsPosts !== 'undefined') {
            pastThreadsPosts.forEach(post => {
                const enriched = enrich(post, {});
                const prediction = this.generatePrediction(enriched);
                this.allPosts.push({
                    ...enriched, globalId: globalId++,
                    categorySlug: (categoryInfo[post.category] || {}).slug || 'threads-past',
                    engagementScore: prediction.score, scoreLevel: prediction.level,
                    predictionReasons: prediction.reasons, improvements: prediction.improvements
                });
            });
        }

        this.filteredPosts = [...this.allPosts];
        this.updateDashboard();
        this.updateNavCounts();
        this.updateStats();
    },

    // 実績フィールドを正規化する。未記録はすべて null のまま（数字は作らない）
    normalizeResult(result) {
        const fields = ['impressions', 'views', 'likes', 'replies', 'reposts', 'targetReplies',
            'targetFollows', 'followersBefore', 'followersAfter', 'followerDelta', 'verdict'];
        if (!result) {
            const empty = {};
            fields.forEach(f => { empty[f] = null; });
            return empty;
        }
        const out = {};
        fields.forEach(f => { out[f] = (result[f] === undefined ? null : result[f]); });
        if (out.followerDelta === null && out.followersBefore !== null && out.followersAfter !== null) {
            out.followerDelta = out.followersAfter - out.followersBefore;
        }
        return out;
    },

    hasResult(post) {
        const r = post.result48h || {};
        return ['impressions', 'views', 'likes', 'replies', 'targetReplies', 'targetFollows']
            .some(k => r[k] !== null && r[k] !== undefined);
    },

    fmtNum(v) {
        return (v === null || v === undefined) ? '未記録' : Number(v).toLocaleString('ja-JP');
    },

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

    accountLabel(post) {
        return (typeof accountInfo !== 'undefined' && accountInfo[post.account]) || post.account || '個人アカウント';
    },

    generatePrediction(post) {
        let score = 40;
        const reasons = [];
        const improvements = [];
        // persona / title / content のいずれかが欠けていても落ちない
        const content = post.content || '';
        const persona = post.persona || '';
        const title = post.title || '';
        const lines = content.split('\n').filter(l => l.trim());
        const hook = lines[0] || '';
        const cta = lines[lines.length - 1] || '';

        let hookScore = 0;
        if (hook.length > 0) {
            if (/\d+/.test(hook)) hookScore += 8;
            if (hook.includes('！') || hook.includes('？')) hookScore += 5;
            if (hook.includes('「') && hook.includes('」')) hookScore += 7;
        }
        if (hookScore >= 15) reasons.push('強いフック：冒頭の一行で読者の注意を引く具体的要素がある');
        else improvements.push('冒頭の改善：数字や具体的なエピソードを一行目に配置してスクロールを止める工夫を');
        score += hookScore;

        let clarityScore = 0;
        if (content.length < 140) clarityScore += 10;
        if (content.includes('・')) clarityScore += 10;
        if (clarityScore >= 15) reasons.push('構造の明快さ：箇条書きや適切な文字数で情報の消化を助けている');
        else improvements.push('可読性の向上：箇条書きや短い文で読みやすくして');
        score += clarityScore;

        const valueKeywords = ['結論', '理由', '方法', 'ポイント', 'コツ', '注意', '具体的', '数字', 'データ'];
        let valueScore = 0;
        valueKeywords.forEach(kw => { if (content.includes(kw)) valueScore += 3; });
        valueScore = Math.min(20, valueScore);
        if (valueScore >= 12) reasons.push('提供価値：独自の知見や明快な結論が提示されている');
        else improvements.push('価値の追加：その投稿を読むことで読者が得られる「独自の学び」を強調して');
        score += valueScore;

        let ctaScore = 0;
        if (cta.includes('？')) ctaScore += 15;
        if (ctaScore > 0) reasons.push('高い対話性：末尾の問いかけが自然で、返信のハードルを下げる工夫がある');
        else improvements.push('CTAの強化：最後に具体的な問いかけを置き、読者のアウトプットを促して');
        score += ctaScore;

        let impactScore = 5;
        if (persona.length > 20) impactScore += 10;
        if (title.length < 40) impactScore += 10;
        score += impactScore;

        score = Math.min(100, Math.max(0, score));
        let level = 'low';
        if (score >= 85) level = 'high';
        else if (score >= 60) level = 'medium';
        return {
            score, level,
            reasons: reasons.length > 0 ? reasons : ['基本要素をさらに研ぎ澄ます余地があります'],
            improvements: improvements.length > 0 ? improvements : ['現状でも非常に質が高いですが、時代に合わせて微調整を推奨します']
        };
    },

    setupEventListeners() {
        // サイドバーの画面切り替え
        document.querySelectorAll('.nav-item[data-view]').forEach(item => {
            item.addEventListener('click', () => this.switchView(item.dataset.view));
        });

        // スマホ用メニューボタン：サイドバーのナビを折りたたむ／開く
        const menuBtn = document.getElementById('menuBtn');
        const sidebar = document.getElementById('sidebar');
        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                const collapsed = sidebar.classList.toggle('nav-collapsed');
                menuBtn.setAttribute('aria-expanded', String(!collapsed));
                if (!collapsed) window.scrollTo(0, 0);
            });
        }

        // 各ビュー内の検索・フィルター（ビューごとに独立）
        document.querySelectorAll('.view').forEach(view => {
            const searchInput = view.querySelector('[data-search]');
            const clearBtn = view.querySelector('[data-clear]');
            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    this.searchQuery = searchInput.value.toLowerCase();
                    if (clearBtn) clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
                    this.filterPosts();
                });
            }
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    this.searchQuery = '';
                    clearBtn.style.display = 'none';
                    this.filterPosts();
                });
            }
            const pillarSelect = view.querySelector('[data-pillar]');
            if (pillarSelect) {
                pillarSelect.addEventListener('change', () => {
                    this.currentPillar = pillarSelect.value;
                    this.filterPosts();
                });
            }
            const statusSelect = view.querySelector('[data-status]');
            if (statusSelect) {
                statusSelect.addEventListener('change', () => {
                    this.currentStatus = statusSelect.value;
                    this.filterPosts();
                });
            }
            const hookSelect = view.querySelector('[data-hook]');
            if (hookSelect) {
                hookSelect.addEventListener('change', () => {
                    this.currentHook = hookSelect.value;
                    this.filterPosts();
                });
            }
        });

        // モーダル（要素が無くても落ちない）
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        if (modalOverlay) modalOverlay.addEventListener('click', () => this.closeModal());
        if (modalClose) modalClose.addEventListener('click', () => this.closeModal());
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) modalContent.addEventListener('click', e => e.stopPropagation());
    },

    switchView(view) {
        this.currentView = view;
        // フィルターはビューごとにリセット（前の画面の絞り込みを持ち越さない）
        this.currentPillar = 'all';
        this.currentStatus = 'all';
        this.currentHook = 'all';
        this.searchQuery = '';
        document.querySelectorAll('.view [data-search]').forEach(el => { el.value = ''; });
        document.querySelectorAll('.view [data-clear]').forEach(el => { el.style.display = 'none'; });
        document.querySelectorAll('.view [data-pillar]').forEach(el => { el.value = 'all'; });
        document.querySelectorAll('.view [data-status]').forEach(el => { el.value = 'all'; });
        document.querySelectorAll('.view [data-hook]').forEach(el => { el.value = 'all'; });

        document.querySelectorAll('.nav-item[data-view]').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });
        // スマホでは画面を選んだらナビを折りたたみ、本文をすぐ見せる
        if (window.innerWidth <= 768) {
            const sidebarEl = document.getElementById('sidebar');
            const menuBtnEl = document.getElementById('menuBtn');
            if (sidebarEl) sidebarEl.classList.add('nav-collapsed');
            if (menuBtnEl) menuBtnEl.setAttribute('aria-expanded', 'false');
        }
        document.querySelectorAll('.view').forEach(section => {
            section.classList.toggle('active', section.id === 'view-' + view);
        });
        const [title, subtitle] = this.viewTitles[view] || ['ダッシュボード', ''];
        document.getElementById('pageTitle').textContent = title;
        document.getElementById('pageSubtitle').textContent = subtitle;

        if (view === 'dashboard') this.updateDashboard();
        if (view === 'results') this.renderResults();
        this.filterPosts();
        window.scrollTo(0, 0);
    },

    filterPosts() {
        this.filteredPosts = this.allPosts.filter(post => {
            if (!this.viewPredicate(post)) return false;
            const matchesPillar = this.currentPillar === 'all' || post.pillar === this.currentPillar;
            const matchesStatus = this.currentView === 'archive'
                ? true
                : this.currentStatus === 'all'
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

    updateNavCounts() {
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('navCountCandidates', this.allPosts.filter(p => p.status === 'draft').length);
        set('navCountPersonal', this.allPosts.filter(p => p.account === 'personal' && p.status !== 'archived').length);
        set('navCountKinapse', this.allPosts.filter(p => p.account === 'kinapse').length);
        set('navCountArchive', this.allPosts.filter(p => p.status === 'archived').length);
    },

    updateDashboard() {
        const counts = { draft: 0, approved: 0, posted: 0, archived: 0 };
        this.allPosts.forEach(post => { if (counts[post.status] !== undefined) counts[post.status]++; });
        const needsJudgement = this.allPosts.filter(post => post.status === 'posted' && !this.hasResult(post)).length;
        const posted = this.allPosts.filter(post => post.status === 'posted');
        const recorded = posted.filter(post => this.hasResult(post));

        const grid = document.getElementById('dashboardCounts');
        if (grid) {
            grid.innerHTML = [
                [counts.draft, '下書き', 'まだ出していない投稿'],
                [counts.approved, '承認待ち', '承認されて出番を待つもの'],
                [counts.posted, '投稿済み', recorded.length + '件の結果を記録済み'],
                [needsJudgement, '要判定', '投稿済みで48時間の結果が未記録']
            ].map(([v, label, sub]) =>
                `<div class="stat-card"><span class="stat-value">${v}</span><span class="stat-caption">${label}</span><span class="stat-sub">${sub}</span></div>`
            ).join('');
        }

        const drafts = this.allPosts.filter(post => post.status === 'draft');
        const next = [...drafts].sort((a, b) =>
            (a.category === 'Threads短文候補' ? 0 : 1) - (b.category === 'Threads短文候補' ? 0 : 1)
        ).slice(0, 3);
        const nextEl = document.getElementById('nextTests');
        if (nextEl) {
            nextEl.innerHTML = next.length ? next.map((post, i) =>
                `<li><span class="next-rank">${i + 1}</span> ${this.cleanDisplay(post.content).split('\n')[0]}` +
                `<span class="next-meta">${this.pillarLabel(post)}${post.hookType ? ' / ' + post.hookType : ''}</span></li>`
            ).join('') : '<li>下書きがありません</li>';
        }

        const pillarCounts = {};
        this.allPosts.filter(post => post.status !== 'archived').forEach(post => {
            pillarCounts[post.pillar] = (pillarCounts[post.pillar] || 0) + 1;
        });
        const pillarEl = document.getElementById('pillarBreakdown');
        if (pillarEl) {
            pillarEl.innerHTML = Object.keys(pillarCounts).map(pillar =>
                `<span class="pillar-stat">${this.pillarLabel({ pillar })} ${pillarCounts[pillar]}件</span>`
            ).join('') || 'なし';
        }
        const splitEl = document.getElementById('accountSplit');
        if (splitEl) {
            const personal = this.allPosts.filter(p => p.account === 'personal' && p.status !== 'archived').length;
            const kinapse = this.allPosts.filter(p => p.account === 'kinapse').length;
            splitEl.innerHTML =
                `<div class="account-split-item"><strong>${personal}件</strong>個人アカウント（@aus_physio_masa.therapist）</div>` +
                `<div class="account-split-item"><strong>${kinapse}件</strong>Kinapse用（アカウント作成前）</div>`;
        }

        const dashResults = document.getElementById('dashboardResults');
        if (dashResults) {
            dashResults.innerHTML = posted.length === 0
                ? '<p class="note" style="margin-top:0">まだ投稿したものがありません。最初の投稿を出したら、ここにインプレッションや返信の合計が出ます。</p>'
                : `<p class="note" style="margin-top:0">投稿済み ${posted.length}件のうち、結果を記録済み ${recorded.length}件。詳しくは「実績・分析」で確認できます。</p>`;
        }
    },

    // 実績・分析ビュー：数字は実測だけ。未記録は「未記録」と明記し、作らない
    // 過去10件の数字は2026-11-22取得時の累計（impression_count等）で、48時間後の値ではない
    renderResults() {
        const posted = this.allPosts.filter(post => post.status === 'posted');
        const recorded = posted.filter(post => this.hasResult(post));
        const sum = (key) => recorded.reduce((acc, p) => acc + (p.result48h[key] || 0), 0);
        const hasTargetData = recorded.some(p => p.result48h.targetReplies !== null || p.result48h.targetFollows !== null);
        const hits = hasTargetData
            ? recorded.filter(p => (p.result48h.targetReplies || 0) >= 5 || (p.result48h.targetFollows || 0) >= 3).length
            : null;
        const hasPast = posted.some(p => p.category === 'Threads過去実績');

        const summaryEl = document.getElementById('resultsSummary');
        if (summaryEl) {
            const card = (value, label, sub) =>
                `<div class="stat-card"><span class="stat-value">${value}</span><span class="stat-caption">${label}</span><span class="stat-sub">${sub}</span></div>`;
            summaryEl.innerHTML = recorded.length === 0
                ? card(posted.length, '投稿済み', '結果を記録した投稿はまだありません') +
                  card('—', 'インプレッション合計', '未記録') +
                  card('—', 'ターゲット返信合計', '未記録') +
                  card('—', 'フォロワー増減', '未記録')
                : card(sum('impressions').toLocaleString('ja-JP'), 'インプレッション合計', '記録済み ' + recorded.length + '件（2026-11-22取得時の累計）') +
                  card(sum('likes').toLocaleString('ja-JP'), 'いいね合計', '記録済み ' + recorded.length + '件') +
                  card(sum('replies').toLocaleString('ja-JP'), '返信合計', 'ターゲット返信は未記録') +
                  card(hits === null ? '—' : hits + ' / ' + recorded.length, 'ヒット', hits === null ? 'ターゲット返信・フォローは未記録のため未判定' : 'ターゲット返信5件以上 or ターゲットフォロー3人以上');
        }

        this.renderBaseline();

        const listEl = document.getElementById('resultsList');
        if (listEl) {
            if (posted.length === 0) {
                listEl.innerHTML = `<div class="empty-state"><h3>まだ投稿済みのものがありません</h3><p>投稿したら、ここにインプレッション・返信・ターゲット返信・フォロワーの増減が並びます。<br>結果は投稿から48時間後に記録してください。</p></div>`;
            } else {
                listEl.innerHTML = (hasPast
                    ? `<p class="note" style="margin-top:0">下の10件は2026-11-22取得時の累計（impression_count等）で、投稿から48時間後の値ではありません。投稿別のViews、ターゲット返信・フォローは未記録です。</p>`
                    : '') +
                    `<div class="results-table-wrap"><table class="results-table"><thead><tr>
                    <th>投稿</th><th>投稿日</th><th class="num">インプレッション</th><th class="num">いいね</th><th class="num">返信</th>
                    <th class="num">再投稿</th><th class="num">ターゲット返信</th><th>判定</th>
                </tr></thead><tbody>` + posted.map(post => {
                    const r = post.result48h;
                    const link = post.postUrl
                        ? ` <a href="${post.postUrl}" target="_blank" rel="noopener">Threadsで開く</a>`
                        : '';
                    return `<tr>
                        <td><a href="#" data-open-post="${post.globalId}">${this.cleanDisplay(post.content).split('\n')[0]}</a>${link}</td>
                        <td>${post.postedAt || '未記録'}</td>
                        <td class="num">${this.fmtNum(r.impressions)}</td>
                        <td class="num">${this.fmtNum(r.likes)}</td>
                        <td class="num">${this.fmtNum(r.replies)}</td>
                        <td class="num">${this.fmtNum(r.reposts)}</td>
                        <td class="num">${this.fmtNum(r.targetReplies)}</td>
                        <td>${r.verdict || '未判定'}</td>
                    </tr>`;
                }).join('') + `</tbody></table></div>`;
                listEl.querySelectorAll('[data-open-post]').forEach(link => {
                    link.addEventListener('click', e => {
                        e.preventDefault();
                        this.openModal(parseInt(link.dataset.openPost, 10));
                    });
                });
            }
        }
    },

    // アカウントのベースライン（28日・90日のInsights概要と最終投稿日）。数字は実測だけ
    renderBaseline() {
        const el = document.getElementById('resultsBaseline');
        if (!el) return;
        if (typeof accountBaseline === 'undefined') { el.innerHTML = ''; return; }
        const b = accountBaseline;
        const w28 = b.windows['28d'];
        const w90 = b.windows['90d'];
        const winCard = (w) =>
            `<div class="account-split-item"><strong>${w.label}（${w.from}〜${w.to}、${w.metric}）</strong><br>` +
            `Views ${w.views.toLocaleString('ja-JP')}（フォロワー ${w.viewsFollowers} / フォロワー以外 ${w.viewsNonFollowers}、前期間比 ${w.viewsChangePct}%） / ` +
            `いいね ${w.likes} / 返信 ${w.replies} / 引用 ${w.quotes} / 再投稿 ${w.reposts} / フォロワー純増 ${w.netFollowers >= 0 ? '+' : ''}${w.netFollowers}<br>` +
            `流入：${w.traffic.map(t => `${t.label} ${t.pct}%（${t.count}）`).join('、')}<br>` +
            `フォロワー ${w.followersStart} → ${w.followersEnd}` +
            (w.followersLastTrendDate ? `（最終推移日 ${w.followersLastTrendDate}）` : '') +
            `</div>`;
        el.innerHTML = `<div class="card" style="margin-top:16px"><div class="card-head"><h3>アカウントのベースライン（${b.retrievedAt}取得）</h3></div>` +
            `<p class="note" style="margin-top:0">${b.lastPostNote}</p>` +
            `<p class="note">アカウントのフォロワー数（${b.retrievedAt}時点）は ${b.followersToday}。${b.followersNote}</p>` +
            winCard(w28) + winCard(w90) +
            `<p class="note">${b.note}</p>` +
            `<p class="note">上位10件に共通する型：実体験の書き出し＋具体的な数字・固有名詞＋議論を呼ぶ主張または鋭い1問。ほぼテキストのみで、絵文字・ハッシュタグ・リンクはほとんど使われていない。` +
            `インプレッション上位は「1000万円の壁」9,064件（2026-03-16、impression_count）、「日本のPTの給料が上がらない理由は？」8,794件（2026-01-11）、「日本は住むのに最高な国」7,224件（2026-01-09）。` +
            `一方で直近28日のViewsは120件（2026-10-25〜2026-11-22）、直近90日は705件（2026-08-24〜2026-11-22）と静かな状態が続いている。詳しくはREADMEの「過去のThreads実績」を参照。</p>` +
            `</div>`;
    },

    updateStats() {
        const el = document.getElementById('totalPosts');
        if (el) el.textContent = this.allPosts.length;
    },

    renderPosts() {
        const view = document.getElementById('view-' + this.currentView);
        if (!view) return;
        const container = view.querySelector('[data-posts]');
        if (!container) return;

        if (this.currentView === 'dashboard' || this.currentView === 'results') {
            container.innerHTML = '';
            return;
        }

        if (this.filteredPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>投稿が見つかりませんでした</h3>
                    <p>検索条件を変更してみてください</p>
                </div>`;
            return;
        }

        container.innerHTML = this.filteredPosts.map(post => {
            const r = post.result48h;
            const resultLine = post.status === 'posted'
                ? `<div class="post-result-line"><strong>48時間の結果：</strong>${this.hasResult(post)
                    ? `インプレッション ${this.fmtNum(r.impressions)} / 返信 ${this.fmtNum(r.replies)} / ターゲット返信 ${this.fmtNum(r.targetReplies)} / フォロワー ${r.followerDelta === null ? '未記録' : (r.followerDelta >= 0 ? '+' : '') + r.followerDelta}`
                    : '未記録（投稿から48時間後に記録する）'}</div>`
                : '';
            return `
            <article class="post-card" data-id="${post.globalId}">
                <div class="post-header-new">
                    <span class="post-category-badge">${this.pillarLabel(post)}</span>
                    <span class="post-status-badge status-${post.status}">${this.statusLabel(post)}</span>
                    ${post.hookType ? `<span class="post-hook-badge">${post.hookType}</span>` : ''}
                    <span class="post-account-badge">${this.accountLabel(post)}</span>
                    <span class="post-score">予測 ${post.engagementScore}点</span>
                </div>
                <h2 class="post-title-large">${post.title}</h2>
                <p class="post-preview">${this.getPreview(post.content)}</p>
                ${resultLine}
            </article>`;
        }).join('');

        container.querySelectorAll('.post-card').forEach(card => {
            card.addEventListener('click', () => this.openModal(parseInt(card.dataset.id, 10)));
        });
    },

    getPreview(content) {
        const cleanContent = this.cleanDisplay(content).replace(/\*\*/g, '').trim();
        const lines = cleanContent.split('\n');
        if (lines.length > 2) return lines.slice(0, 2).join('\n') + '...';
        return cleanContent;
    },

    resultRows(post) {
        const r = post.result48h;
        const row = (label, value) => `<p class="persona-text"><strong>${label}:</strong> ${value}</p>`;
        if (!this.hasResult(post)) {
            return row('48時間の結果', '未記録（投稿から48時間後に記録する）') +
                row('インプレッション', '未記録') + row('Views', '未記録') +
                row('いいね / 返信', '未記録') +
                row('ターゲット返信 / ターゲットフォロー', '未記録') +
                row('フォロワー（前 → 後 / 増減）', '未記録') +
                row('判定', '未判定');
        }
        const pastNote = post.category === 'Threads過去実績'
            ? row('集計', '2026-11-22取得時の累計（impression_count等）。48時間後の値ではない。投稿別のViewsは未記録。') : '';
        return pastNote +
            row('インプレッション', this.fmtNum(r.impressions)) +
            row('Views', this.fmtNum(r.views)) +
            row('いいね', this.fmtNum(r.likes)) +
            row('返信', this.fmtNum(r.replies)) +
            row('再投稿', this.fmtNum(r.reposts)) +
            row('ターゲット返信', this.fmtNum(r.targetReplies)) +
            row('ターゲットフォロー', this.fmtNum(r.targetFollows)) +
            row('フォロワー（前 → 後）', `${this.fmtNum(r.followersBefore)} → ${this.fmtNum(r.followersAfter)}`) +
            row('フォロワー増減', r.followerDelta === null ? '未記録' : ((r.followerDelta >= 0 ? '+' : '') + r.followerDelta)) +
            row('判定', r.verdict || '未判定');
    },

    openModal(postId) {
        const post = this.allPosts.find(p => p.globalId === postId);
        if (!post) return;
        const isKinapse = post.account === 'kinapse';
        const handle = isKinapse ? 'Kinapseアカウント（作成前）' : '@aus_physio_masa.therapist';

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="modal-header">
                <span class="modal-category">${post.category} · ${this.accountLabel(post)}</span>
                <h1 class="modal-title">${post.title}</h1>
            </div>

            <div class="prediction-section">
                <h3 class="section-title">投稿予測（実測ではない）</h3>
                <div class="score-display">
                    <span class="score-number">${post.engagementScore}点</span>
                    <span class="score-label">伸びる確率（予測）: ${post.scoreLevel === 'high' ? '高' : post.scoreLevel === 'medium' ? '中' : '低'}</span>
                </div>
                <p class="prediction-note">このスコアはフック・文字数などからのヒューリスティック予測です。実測の反応ではありません。</p>
                <div class="prediction-details">
                    <h4>予測理由</h4>
                    <ul>${post.predictionReasons.map(reason => `<li>${reason}</li>`).join('')}</ul>
                    <h4>改善提案</h4>
                    <ul>${post.improvements.map(improvement => `<li>${improvement}</li>`).join('')}</ul>
                </div>
            </div>

            <div class="thread-preview-section">
                <div class="preview-label">投稿プレビュー</div>
                <div class="thread-preview">
                    <div class="thread-header">
                        <div class="thread-avatar">M</div>
                        <div class="thread-user-info">
                            <div class="thread-username">${isKinapse ? 'Kinapse' : 'Masa'}</div>
                            <div class="thread-handle">${handle}</div>
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
                    <p class="persona-text"><strong>次にやること:</strong> ${post.nextAction || '未定'}</p>
                    ${post.postUrl ? `<p class="persona-text"><a href="${post.postUrl}" target="_blank" rel="noopener">投稿を開く</a></p>` : ''}
                </div>
            </div>

            <div class="modal-section">
                <h3 class="section-title">${post.category === 'Threads過去実績' ? '実績（2026-11-22取得時の累計）' : '実績（48時間後）'}</h3>
                <div class="section-content">
                    ${this.resultRows(post)}
                    <p class="persona-text">判定ルール：投稿から48時間後。ヒットはターゲット返信5件以上、またはターゲットフォロー3人以上。</p>
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
            .replace(/"/g, '&quot;');
    },

    copyToClipboard(text) {
        const cleanText = this.cleanDisplay(text);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cleanText)
                .then(() => this.showToast())
                .catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = cleanText;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    this.showToast();
                });
        } else {
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
        setTimeout(() => { toast.classList.remove('show'); }, 2000);
    },

    hideLoading() {
        const el = document.getElementById('loading');
        if (!el) return;
        setTimeout(() => {
            el.classList.add('hidden');
        }, 500);
    }
};

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// 起動後に何か例外が出てもローディング画面を残さない（最後の砦）
window.addEventListener('error', () => {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
    if (!window.__snsReady && typeof app !== 'undefined' && app.showLoadError) {
        app.showLoadError(new Error('ページの読み込み中にエラーが発生しました'));
    }
});

// PWA対応: サービスワーカー登録（オプション）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 将来的にオフライン対応する場合はここでサービスワーカーを登録
    });
}
