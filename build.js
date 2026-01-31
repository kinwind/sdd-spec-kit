const fs = require('fs');
const path = require('path');

// --- Configuration ---
const SITE_TITLE = "Spec Kit 實戰手冊";
const OUT_DIR = "/home/kinwind/.openclaw/workspace/sdd-spec-kit";

// --- Layout Template ---
const template = (title, content, activePage) => `<!DOCTYPE html>
<html lang="zh-TW" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | ${SITE_TITLE}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'base',
            themeVariables: {
                primaryColor: '#000000',
                primaryTextColor: '#ffffff',
                primaryBorderColor: '#333333',
                lineColor: '#666666',
                secondaryColor: '#000000',
                tertiaryColor: '#0a0a0a',
                mainBkg: '#000000',
                nodeBorder: '#333333',
                clusterBkg: '#000000',
                clusterBorder: '#333333',
                defaultLinkColor: '#666666',
                titleColor: '#ffffff',
                edgeLabelBackground: '#000000',
                nodeTextColor: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px'
            },
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'linear' }
        });
    </script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        :root {
            --bg-page: #000000;
            --bg-sidebar: #050505;
            --fg-primary: #ededed;
            --fg-secondary: #a1a1a1;
            --border-subtle: #262626;
            --accent: #ffffff;
        }

        body { 
            font-family: 'Inter', sans-serif; 
            background-color: var(--bg-page); 
            color: var(--fg-primary);
            -webkit-font-smoothing: antialiased;
        }

        /* Typography */
        h1 { letter-spacing: -0.02em; font-weight: 600; color: var(--fg-primary); line-height: 1.2; }
        h2 { letter-spacing: -0.01em; font-weight: 500; color: var(--fg-primary); margin-top: 2.5rem; margin-bottom: 1rem; }
        h3 { letter-spacing: -0.01em; font-weight: 500; color: var(--fg-primary); margin-top: 1.5rem; margin-bottom: 0.75rem; }
        p, li { color: var(--fg-secondary); font-weight: 400; line-height: 1.7; letter-spacing: 0.01em; margin-bottom: 1rem; }
        
        /* Code */
        code { font-family: 'Menlo', 'Monaco', 'Courier New', monospace; font-size: 0.85em; color: #fff; background: #222; padding: 0.2em 0.4em; border-radius: 4px; }
        pre code { background: transparent; padding: 0; }
        pre { background-color: #111 !important; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1rem; margin: 1rem 0; overflow-x: auto; }

        /* Components */
        .nav-link { 
            color: var(--fg-secondary); 
            transition: all 0.2s ease; 
            font-size: 0.9rem;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            display: block;
        }
        .nav-link:hover { color: var(--fg-primary); background-color: #1a1a1a; }
        .nav-link.active { color: var(--fg-primary); font-weight: 500; background-color: #1a1a1a; }

        .card { 
            background-color: #0a0a0a; 
            border: 1px solid var(--border-subtle); 
            border-radius: 8px; 
            padding: 1.5rem;
            transition: all 0.2s ease;
        }
        .card:hover { border-color: #444; transform: translateY(-1px); }

        /* Mermaid Overrides */
        .mermaid { background: #000; border: 1px solid var(--border-subtle); padding: 2rem; border-radius: 8px; display: flex; justify-content: center; }
        .mermaid path { stroke: #666 !important; }
        .mermaid .node rect, .mermaid .node circle, .mermaid .node polygon { stroke: #333 !important; fill: #000 !important; }
    </style>
</head>
<body class="min-h-screen flex flex-col lg:flex-row" x-data="{ mobileMenuOpen: false }">

    <!-- Mobile Header -->
    <header class="lg:hidden sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#262626] px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-white rounded-full"></div>
            <span class="font-medium text-sm text-white">Spec Kit</span>
        </div>
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-[#888] hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
    </header>

    <!-- Mobile Menu Overlay -->
    <div x-show="mobileMenuOpen" class="fixed inset-0 z-40 bg-black lg:hidden" x-transition.opacity>
        <div class="p-6 pt-20">
            ${renderNav(activePage)}
        </div>
        <button @click="mobileMenuOpen = false" class="absolute top-4 right-6 text-white p-2">✕</button>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex w-64 bg-[#050505] border-r border-[#262626] flex-col fixed inset-y-0 left-0 pt-8 pb-6 px-6 overflow-y-auto">
        <div class="mb-10 flex items-center gap-3">
            <div class="w-3 h-3 bg-white rounded-full"></div>
            <span class="font-medium text-white tracking-tight">Spec Kit Guide</span>
        </div>
        ${renderNav(activePage)}
    </aside>

    <!-- Main Content Wrapper -->
    <main class="flex-1 lg:pl-64 bg-black min-h-screen w-full">
        <div class="max-w-4xl mx-auto px-6 py-12 lg:py-24">
            ${content}
            
            <footer class="mt-32 pt-8 border-t border-[#262626] flex justify-between text-sm text-[#555]">
                <span>© 2026 Spec Kit Guide</span>
                <div class="flex gap-4">
                    ${renderFooterNav(activePage)}
                </div>
            </footer>
        </div>
    </main>

    <script>hljs.highlightAll();</script>
</body>
</html>`;

// --- Helper Functions ---
function renderNav(active) {
    const links = [
        { id: 'index', title: '核心概念', href: 'index.html' },
        { id: 'tools', title: '工具指南', href: 'tools.html' },
        { id: 'workflow', title: '實戰演練', href: 'workflow.html' },
        { id: 'faq', title: 'FAQ', href: 'faq.html' }
    ];
    return `
        <div class="space-y-8">
            <div>
                <div class="text-[11px] text-[#555] font-semibold mb-3 uppercase tracking-widest pl-2">Guide</div>
                <ul class="space-y-1">
                    ${links.map(l => `<li><a href="${l.href}" class="nav-link ${active === l.id ? 'active' : ''}">${l.title}</a></li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function renderFooterNav(active) {
    const order = ['index', 'tools', 'workflow', 'faq'];
    const idx = order.indexOf(active);
    let html = '';
    if (idx > 0) html += `<a href="${order[idx-1]}.html" class="hover:text-white">← Prev</a>`;
    if (idx < order.length - 1) html += `<a href="${order[idx+1]}.html" class="hover:text-white">Next →</a>`;
    return html;
}

// --- Content Definitions ---

const pages = {
    index: {
        title: "核心概念",
        content: `
            <header class="mb-20">
                <h1 class="text-4xl lg:text-5xl mb-6 tracking-tight">Spec-Driven Development</h1>
                <p class="text-xl font-light text-[#888] leading-relaxed">將軟體規格轉化為可執行的藍圖。<br>讓 AI 助手精準實作，消滅不確定性。</p>
            </header>
            <section class="space-y-16">
                <div>
                    <h2 class="text-2xl text-white mb-4 mt-0">什麼是 SDD？</h2>
                    <p>規格驅動開發 (SDD) 是一種顛覆傳統的協作模式。在傳統流程中，程式碼是主角；但在 SDD 中，規格書 (Spec) 才是唯一的真理。</p>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="text-lg text-white mb-3 mt-0">規格即真相</h3>
                        <p class="text-sm text-[#888] mb-0">所有實作必須嚴格遵守 <code>spec.md</code>。若代碼與規格不符，則代碼是錯誤的。</p>
                    </div>
                    <div class="card">
                        <h3 class="text-lg text-white mb-3 mt-0">AI 友善開發</h3>
                        <p class="text-sm text-[#888] mb-0">透過標準化的結構，讓 AI 能 100% 理解需求，實現精準的自動化編碼。</p>
                    </div>
                </div>
            </section>
        `
    },
    tools: {
        title: "工具指南",
        content: `
            <header class="mb-20 border-b border-[#262626] pb-8">
                <h1 class="text-3xl mb-4">工具指南</h1>
                <p class="text-lg font-light text-[#888]">Spec Kit 是這套工作流的核心引擎。</p>
            </header>
            <section class="space-y-16">
                <div>
                    <h2 class="text-xl text-white mb-6 flex items-center gap-3 mt-0"><span class="w-1.5 h-1.5 bg-white rounded-full"></span>安裝與初始化</h2>
                    <div class="space-y-6">
                        <div>
                            <p class="mb-2 text-sm font-medium text-white">1. 使用 uv 安裝 (推薦)</p>
                            <pre><code class="language-bash">uv tool install specify-cli --from git+https://github.com/github/spec-kit.git</code></pre>
                        </div>
                        <div>
                            <p class="mb-2 text-sm font-medium text-white">2. 在專案目錄初始化</p>
                            <pre><code class="language-bash">specify init . --ai claude --here</code></pre>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 class="text-xl text-white mb-6 flex items-center gap-3"><span class="w-1.5 h-1.5 bg-white rounded-full"></span>指令對照表</h2>
                    <div class="overflow-x-auto border border-[#262626] rounded-lg">
                        <table class="w-full text-left text-sm text-[#888]">
                            <thead class="bg-[#111] text-white font-medium border-b border-[#262626]">
                                <tr><th class="p-4 w-48">指令</th><th class="p-4">用途說明</th></tr>
                            </thead>
                            <tbody class="divide-y divide-[#262626]">
                                <tr><td class="p-4 font-mono text-white">/speckit.constitution</td><td class="p-4">建立專案憲法。</td></tr>
                                <tr><td class="p-4 font-mono text-white">/speckit.specify</td><td class="p-4">描述功能需求。</td></tr>
                                <tr><td class="p-4 font-mono text-white">/speckit.clarify</td><td class="p-4">釐清模糊需求 (必做)。</td></tr>
                                <tr><td class="p-4 font-mono text-white">/speckit.plan</td><td class="p-4">擬定技術實作藍圖。</td></tr>
                                <tr><td class="p-4 font-mono text-white">/speckit.tasks</td><td class="p-4">拆解細項任務。</td></tr>
                                <tr><td class="p-4 font-mono text-white">/speckit.implement</td><td class="p-4">AI 自動撰寫程式碼。</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        `
    },
    workflow: {
        title: "實戰演練",
        content: `
            <header class="mb-16 border-b border-[#262626] pb-8">
                <h1 class="text-3xl mb-4">實戰演練</h1>
                <p class="text-lg font-light text-[#888]">從需求到交付的完整循環。<br><span class="text-xs mt-3 inline-block text-[#555] bg-[#111] px-2 py-1 rounded">💡 點擊流程圖節點查看說明</span></p>
            </header>
            
            <div x-data="{ 
                activeStep: null,
                steps: {
                    'Const': { title: '定義憲法', desc: '專案最高指導原則。', cmd: '/speckit.constitution' },
                    'Spec': { title: '撰寫規格', desc: '描述功能需求與使用者故事。', cmd: '/speckit.specify' },
                    'Clarify': { title: '需求釐清', desc: 'AI 主動提問消除模糊。', cmd: '/speckit.clarify' },
                    'Checklist': { title: '品質檢查', desc: '產生驗收標準。', cmd: '/speckit.checklist' },
                    'Plan': { title: '技術規劃', desc: '擬定實作藍圖。', cmd: '/speckit.plan' },
                    'Tasks': { title: '任務拆解', desc: '拆解為可執行任務。', cmd: '/speckit.tasks' },
                    'Implement': { title: '自動實作', desc: 'AI 自動撰寫程式碼。', cmd: '/speckit.implement' },
                    'Review': { title: 'Demo 與測試', desc: '人工驗證功能。', cmd: 'Manual Review' }
                }
            }">
                <div class="mermaid cursor-pointer select-none mb-20" @click="if($event.target.closest('.node')) activeStep = $event.target.closest('.node').id.split('-')[1]">
                    graph TD
                        Start((開始)) --> Const[/"定義憲法"/]
                        Const --> Spec[/"撰寫規格"/]
                        Spec --> Clarify{"需求釐清"}
                        Clarify -- "仍有模糊" --> Spec
                        Clarify -- "完全對齊" --> Checklist[/"品質檢查"/]
                        Checklist --> Plan[/"技術規劃"/]
                        Plan --> Tasks[/"任務拆解"/]
                        Tasks --> Implement[/"自動實作"/]
                        Implement --> Review(("Demo<br/>與測試"))
                        Review -- "正常" --> Done((完成))
                        Review -- "微調" --> Loop1["修正 spec"]
                        Loop1 --> Clarify

                        click Const call showStep('Const')
                        click Spec call showStep('Spec')
                        click Clarify call showStep('Clarify')
                        click Checklist call showStep('Checklist')
                        click Plan call showStep('Plan')
                        click Tasks call showStep('Tasks')
                        click Implement call showStep('Implement')
                        click Review call showStep('Review')
                </div>

                <!-- Info Drawer -->
                <div x-show="activeStep" 
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 translate-y-4"
                     x-transition:enter-end="opacity-100 translate-y-0"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="opacity-100 translate-y-0"
                     x-transition:leave-end="opacity-0 translate-y-4"
                     class="fixed bottom-6 left-6 right-6 lg:left-[calc(16rem+1.5rem)] lg:right-6 pointer-events-none z-50">
                    <div class="bg-[#111] border border-[#333] p-6 rounded-lg shadow-2xl max-w-xl mx-auto pointer-events-auto relative">
                        <button @click="activeStep = null" class="absolute top-4 right-4 text-[#555] hover:text-white">✕</button>
                        <template x-if="activeStep && steps[activeStep]">
                            <div>
                                <div class="text-[10px] text-[#555] uppercase tracking-widest font-semibold mb-2">Step Detail</div>
                                <h3 class="text-lg text-white font-medium mb-2 mt-0" x-text="steps[activeStep].title"></h3>
                                <p class="text-[#888] text-sm mb-4 leading-relaxed" x-text="steps[activeStep].desc"></p>
                                <div class="inline-block bg-[#1a1a1a] text-[#ddd] text-xs font-mono px-2 py-1.5 rounded border border-[#333]" x-text="steps[activeStep].cmd"></div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <h2 class="text-xl text-white mb-6">循環迭代案例</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#262626] border border-[#262626] rounded-lg overflow-hidden">
                    <div class="bg-[#0a0a0a] p-6"><div class="text-white text-sm font-medium mb-1">1. 更新規格</div><p class="text-[#666] text-sm mb-0">手動修改 <code>spec.md</code>。</p></div>
                    <div class="bg-[#0a0a0a] p-6"><div class="text-white text-sm font-medium mb-1">2. 再次釐清</div><p class="text-[#666] text-sm mb-0">執行 <code>/speckit.clarify</code>。</p></div>
                    <div class="bg-[#0a0a0a] p-6"><div class="text-white text-sm font-medium mb-1">3. 同步實作</div><p class="text-[#666] text-sm mb-0">執行 <code>/speckit.implement</code>。</p></div>
                    <div class="bg-[#0a0a0a] p-6"><div class="text-white text-sm font-medium mb-1">4. 交付</div><p class="text-[#666] text-sm mb-0">代碼與規格始終同步。</p></div>
                </div>
            </div>
            
            <script>
                // Mermaid Click Handler Interop
                window.showStep = function(id) {
                    // This is handled by Alpine x-data scope in the HTML structure above
                    // But for mermaid's callback, we need to bridge it
                    const el = document.querySelector('[x-data]');
                    if (el && el.__x) {
                        el.__x.$data.activeStep = id;
                    }
                };
            </script>
        `
    },
    faq: {
        title: "常見問題",
        content: `
            <header class="mb-16 border-b border-[#262626] pb-8">
                <h1 class="text-3xl mb-4">常見問題</h1>
                <p class="text-lg font-light text-[#888]">實務開發中的標準應對策略。</p>
            </header>
            <div class="space-y-8">
                <div class="card">
                    <h3 class="text-white text-lg mt-0 mb-2">Q: 需求頻繁「微調」怎麼辦？</h3>
                    <p class="text-[#888] text-sm mb-0">不要開新目錄！直接修改舊的 <code>spec.md</code>，加上 <code>## v1.1 Refinement</code>，然後重跑 implement。</p>
                </div>
                <div class="card">
                    <h3 class="text-white text-lg mt-0 mb-2">Q: 一定要跑 clarify 嗎？</h3>
                    <p class="text-[#888] text-sm mb-0">強烈建議！除非只是改錯字。這能確保 AI 對新需求的理解正確。</p>
                </div>
                <div class="card">
                    <h3 class="text-white text-lg mt-0 mb-2">Q: 什麼時候該重頭開始？</h3>
                    <p class="text-[#888] text-sm mb-0">當 <code>spec.md</code> 補丁多到難以維護，或更換底層架構時。</p>
                </div>
            </div>
        `
    }
};

// --- Execution ---
console.log("Generating site...");
Object.keys(pages).forEach(key => {
    const page = pages[key];
    const html = template(page.title, page.content, key);
    fs.writeFileSync(path.join(OUT_DIR, `${key}.html`), html);
    console.log(`Generated ${key}.html`);
});
console.log("Done.");
