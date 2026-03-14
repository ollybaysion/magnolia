// ─── State ───
let currentAlgo = null;
let editor = null;
let guideMode = true;
let guideTimer = null;
let timerInterval = null;
let elapsedSeconds = 0;
let isGuideLoading = false;
let isVerifying = false;

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
    initCategoryFilter();
    renderAlgoList();
    initMonaco();
    bindEvents();
});

// ─── Category Filter ───
function initCategoryFilter() {
    const sel = document.getElementById('category-filter');
    CATEGORIES.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        sel.appendChild(opt);
    });
    sel.addEventListener('change', () => renderAlgoList(sel.value));
}

// ─── Algorithm List ───
function renderAlgoList(filter = 'all') {
    const list = document.getElementById('algo-list');
    list.innerHTML = '';
    const algos = filter === 'all' ? ALGORITHMS : ALGORITHMS.filter(a => a.category === filter);

    algos.sort((a, b) => a.difficulty - b.difficulty || a.name.localeCompare(b.name));

    algos.forEach(algo => {
        const li = document.createElement('li');
        li.dataset.id = algo.id;
        if (currentAlgo && currentAlgo.id === algo.id) li.classList.add('active');

        li.innerHTML = `
            <div style="flex:1">
                <div class="algo-name">${algo.name}</div>
                <div class="algo-category-tag">${algo.category}</div>
            </div>
            <span class="algo-diff diff-${algo.difficulty}">Lv.${algo.difficulty}</span>
        `;
        li.addEventListener('click', () => selectAlgorithm(algo));
        list.appendChild(li);
    });
}

// ─── Select Algorithm ───
function selectAlgorithm(algo) {
    currentAlgo = algo;
    document.getElementById('current-algo-name').textContent = algo.name;
    document.getElementById('current-algo-desc').textContent = algo.description;

    // Load saved code or skeleton
    const saved = localStorage.getItem(`magnolia_code_${algo.id}`);
    if (editor) {
        editor.setValue(saved || algo.skeleton);
    }

    // Reset timer
    resetTimer();
    startTimer();

    // Enable buttons
    document.getElementById('btn-solution').disabled = false;
    document.getElementById('btn-reset-code').disabled = false;

    // Reset feedback
    showEmptyFeedback();

    // Update active state
    document.querySelectorAll('#algo-list li').forEach(li => {
        li.classList.toggle('active', li.dataset.id === algo.id);
    });
}

// ─── Monaco Editor ───
function initMonaco() {
    require.config({
        paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
    });

    require(['vs/editor/editor.main'], function () {
        monaco.editor.defineTheme('magnolia-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6a737d' },
                { token: 'keyword', foreground: 'ff7b72' },
                { token: 'string', foreground: 'a5d6ff' },
                { token: 'number', foreground: '79c0ff' },
                { token: 'type', foreground: 'ffa657' },
            ],
            colors: {
                'editor.background': '#0d1117',
                'editor.foreground': '#e6edf3',
                'editor.lineHighlightBackground': '#161b2266',
                'editor.selectionBackground': '#264f78',
                'editorCursor.foreground': '#58a6ff',
                'editorLineNumber.foreground': '#484f58',
                'editorLineNumber.activeForeground': '#e6edf3',
            }
        });

        editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: '// 왼쪽에서 알고리즘을 선택하세요.\n',
            language: 'cpp',
            theme: 'magnolia-dark',
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            minimap: { enabled: false },
            padding: { top: 12 },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'off',
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            parameterHints: { enabled: false },
            suggest: { enabled: false },
        });

        // Auto-save and trigger guide on change
        editor.onDidChangeModelContent(() => {
            if (currentAlgo) {
                const code = editor.getValue();
                localStorage.setItem(`magnolia_code_${currentAlgo.id}`, code);
                scheduleGuide();
            }
        });
    });
}

// ─── Guide Mode ───
function scheduleGuide() {
    if (!guideMode || !currentAlgo) return;
    clearTimeout(guideTimer);
    guideTimer = setTimeout(requestGuide, 1500); // 1.5s debounce
}

async function requestGuide() {
    if (!guideMode || !currentAlgo || isGuideLoading) return;

    const code = editor.getValue();
    isGuideLoading = true;
    showLoadingFeedback();

    try {
        const res = await fetch('/api/guide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ algorithm: currentAlgo.name, code })
        });

        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        renderGuideFeedback(data);
    } catch (err) {
        renderErrorFeedback('가이드 요청 실패: ' + err.message);
    } finally {
        isGuideLoading = false;
    }
}

function renderGuideFeedback(data) {
    const el = document.getElementById('feedback-content');
    const progressClass = data.progress < 33 ? 'low' : data.progress < 66 ? 'mid' : 'high';

    const statusLabels = {
        starting: '시작',
        in_progress: '진행 중',
        almost_done: '거의 완성',
        complete: '완성!'
    };

    let html = `<div class="guide-feedback">`;
    html += `<div class="progress-bar"><div class="progress-fill ${progressClass}" style="width:${data.progress}%"></div></div>`;
    html += `<span class="status-badge status-${data.status}">${statusLabels[data.status] || data.status} · ${data.progress}%</span>`;

    if (data.feedback && data.feedback.length > 0) {
        html += `<div class="feedback-section"><h3>피드백</h3><ul>`;
        data.feedback.forEach(f => html += `<li>${escapeHtml(f)}</li>`);
        html += `</ul></div>`;
    }

    if (data.bugs && data.bugs.length > 0) {
        html += `<div class="feedback-section bugs"><h3>버그</h3><ul>`;
        data.bugs.forEach(b => html += `<li>${escapeHtml(b)}</li>`);
        html += `</ul></div>`;
    }

    if (data.hint) {
        html += `<div class="hint-box">${escapeHtml(data.hint)}</div>`;
    }

    html += `</div>`;
    // 부드러운 전환: 로딩 인디케이터 제거 후 페이드인
    el.querySelector('.overlay-loading')?.remove();
    const oldFeedback = el.querySelector('.guide-feedback');
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const newFeedback = temp.firstElementChild;
    newFeedback.classList.add('fade-in');
    if (oldFeedback) {
        oldFeedback.replaceWith(newFeedback);
    } else {
        el.innerHTML = '';
        el.appendChild(newFeedback);
    }
}

function showLoadingFeedback() {
    const el = document.getElementById('feedback-content');
    // 기존 피드백이 있으면 유지하고 로딩 인디케이터만 상단에 추가
    const existing = el.querySelector('.guide-feedback');
    const indicator = `<div class="loading-indicator overlay-loading">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <span>분석 중...</span>
        </div>`;
    if (existing) {
        // 기존 피드백 위에 로딩 오버레이
        el.querySelector('.overlay-loading')?.remove();
        existing.classList.add('fading');
        existing.insertAdjacentHTML('beforebegin', indicator);
    } else {
        el.innerHTML = indicator;
    }
}

function showEmptyFeedback() {
    document.getElementById('feedback-content').innerHTML = `
        <div class="empty-state">
            <p>코드를 작성하세요.</p>
            <p class="hint">${guideMode ? 'Guide Mode ON — 실시간 피드백 활성화' : 'Guide Mode OFF — 검증하기 버튼으로 결과 확인'}</p>
        </div>`;
}

function renderErrorFeedback(msg) {
    document.getElementById('feedback-content').innerHTML = `
        <div class="feedback-section bugs"><h3>오류</h3><ul><li>${escapeHtml(msg)}</li></ul></div>`;
}

// ─── Verify ───
async function requestVerify() {
    if (!currentAlgo || isVerifying) return;

    const code = editor.getValue();
    if (!code || code.trim().length < 10) {
        alert('코드를 먼저 작성하세요.');
        return;
    }

    isVerifying = true;
    const btn = document.getElementById('btn-verify');
    btn.disabled = true;
    btn.textContent = '검증 중...';

    const modal = document.getElementById('verify-modal');
    const resultEl = document.getElementById('verify-result');
    resultEl.innerHTML = `<div class="loading-indicator">
        <div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>
        <span>코드를 컴파일하고 테스트하고 있습니다...</span>
    </div>`;
    modal.classList.remove('hidden');

    try {
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ algorithm: currentAlgo.name, algorithmId: currentAlgo.id, code })
        });

        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        renderVerifyResult(data);
    } catch (err) {
        resultEl.innerHTML = `<div class="feedback-section bugs"><h3>오류</h3><ul><li>${escapeHtml(err.message)}</li></ul></div>`;
    } finally {
        isVerifying = false;
        btn.disabled = false;
        btn.textContent = '검증하기';
    }
}

function renderVerifyResult(data) {
    const el = document.getElementById('verify-result');
    const scoreClass = data.score >= 80 ? 'pass' : data.score >= 50 ? 'partial' : 'fail';

    let html = `<div class="verify-score">
        <div class="score-circle ${scoreClass}">${data.score}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">${data.correct ? '✓ 정답' : '✗ 오답'}</div>
    </div>`;

    html += `<div class="verify-summary">${escapeHtml(data.summary)}</div>`;

    if (data.compileError) {
        html += `<div class="compile-error"><h3>컴파일 에러</h3><pre>${escapeHtml(data.compileError)}</pre></div>`;
    }

    if (data.testResults && data.testResults.length > 0) {
        html += `<div class="test-results">`;
        data.testResults.forEach(t => {
            const icon = t.passed ? '✓' : '✗';
            const cls = t.passed ? 'passed' : 'failed';
            html += `<div class="test-case ${cls}">
                <div class="test-case-header"><span class="test-icon">${icon}</span> ${escapeHtml(t.name)}</div>`;
            if (!t.passed) {
                if (t.error) {
                    html += `<div class="test-diff"><pre>${escapeHtml(t.error)}</pre></div>`;
                } else {
                    html += `<div class="test-diff">
                        <div><span class="diff-label">기대:</span><pre>${escapeHtml(t.expected)}</pre></div>
                        <div><span class="diff-label">실제:</span><pre>${escapeHtml(t.actual || '(출력 없음)')}</pre></div>
                    </div>`;
                }
            }
            html += `</div>`;
        });
        html += `</div>`;
    }

    el.innerHTML = html;
}

// ─── Timer ───
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedSeconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const m = Math.floor(elapsedSeconds / 60);
    const s = elapsedSeconds % 60;
    document.getElementById('timer').textContent =
        `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Events ───
function bindEvents() {
    document.getElementById('toggle-guide').addEventListener('change', (e) => {
        guideMode = e.target.checked;
        if (!guideMode) {
            clearTimeout(guideTimer);
            showEmptyFeedback();
        } else if (currentAlgo) {
            scheduleGuide();
        }
    });

    document.getElementById('btn-verify').addEventListener('click', requestVerify);
    document.getElementById('btn-solution').addEventListener('click', showSolution);
    document.getElementById('btn-reset-code').addEventListener('click', resetCode);
    document.getElementById('btn-reset-timer').addEventListener('click', () => {
        resetTimer();
        if (currentAlgo) startTimer();
    });

    document.getElementById('modal-close').addEventListener('click', () => {
        document.getElementById('verify-modal').classList.add('hidden');
    });

    document.getElementById('solution-close').addEventListener('click', () => {
        document.getElementById('solution-modal').classList.add('hidden');
    });

    document.querySelectorAll('.modal-backdrop').forEach(el => {
        el.addEventListener('click', () => {
            el.closest('.modal').classList.add('hidden');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        }
    });
}

// ─── Solution ───
function showSolution() {
    if (!currentAlgo || !currentAlgo.solution) return;
    document.getElementById('solution-title').textContent = `정답 — ${currentAlgo.name}`;
    document.getElementById('solution-body').innerHTML =
        `<pre><code>${escapeHtml(currentAlgo.solution)}</code></pre>`;
    document.getElementById('solution-modal').classList.remove('hidden');
}

// ─── Reset Code ───
function resetCode() {
    if (!currentAlgo) return;
    if (!confirm('코드를 초기화하시겠습니까? 현재 작성한 코드가 삭제됩니다.')) return;
    localStorage.removeItem(`magnolia_code_${currentAlgo.id}`);
    if (editor) {
        editor.setValue(currentAlgo.skeleton);
    }
    showEmptyFeedback();
}

// ─── Utils ───
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
