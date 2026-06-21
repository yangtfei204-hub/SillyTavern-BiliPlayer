/**
 * 🐾 BiliPlayer Extension for SillyTavern
 * 
 * Author: 未初
 * 💖 Special Thanks: 本插件的底层基础逻辑与核心机制由【老农民】老师提供支持，特此致谢！
 */


// 1. 全局配置与状态
const MODULE_NAME = 'bili_player_ext';
let panelElement = null;
let floatBadgeElement = null;
let settingsDialogElement = null;
let helpDialogElement = null;  // ⭐ 新增：使用说明弹窗

const THEMES = {
    pink:           { name: '🩷 樱花粉',     emoji: '🐾' },
    lemon:          { name: '🌼 嫩黄',       emoji: '🍋' },
    mint:           { name: '🌿 淡绿',       emoji: '🌱' },
    'glass-light':  { name: '🪟 毛玻璃白',   emoji: '☁️' },
    'glass-dark':   { name: '🕶️ 毛玻璃黑',   emoji: '🌙' },
    sakura:         { name: '🌸 夜樱',       emoji: '🌸' },
    ocean:          { name: '🌊 深海蓝',     emoji: '🐳' },
    sunset:         { name: '🌅 落日橘',     emoji: '🌇' },
    lavender:       { name: '💜 薰衣草',     emoji: '🪻' },
    mocha:          { name: '☕ 摩卡棕',     emoji: '🍫' }
};

const DEFAULT_SETTINGS = {
    theme: 'pink',
    badgeSize: 'medium',
    avatarType: 'emoji',
    avatarValue: '',
    borderImage: '',
    borderImageMode: 'background',
    borderImageFit: 'cover',
    borderImageOpacity: 1,
    customColors: null
};

const BADGE_DIMENSIONS = {
    large:  { w: 72, h: 76 },
    medium: { w: 58, h: 62 },
    small:  { w: 44, h: 48 }
};

const THEME_COLORS = {
    pink: {
        primary: '#ff85a7', primaryLight: '#fff0f3', primaryDeep: '#fb7299',
        secondary: '#86e3ce', bg: '#ffffff', bgSoft: '#fffbfc', text: '#5d6d7e',
        textMuted: '#b8a4ad', border: '#ff85a7', actionPrimary: '#ff85a7',
        actionPrimaryText: '#ffffff', actionSecondary: '#86e3ce',
        actionSecondaryText: '#2c3e50', shadow: 'rgba(251, 114, 153, 0.2)'
    },
    lemon: {
        primary: '#f4d35e', primaryLight: '#fff8d6', primaryDeep: '#ee9b00',
        secondary: '#ffd166', bg: '#fffdf5', bgSoft: '#fffbea', text: '#6b5d3f',
        textMuted: '#b8a87d', border: '#ee9b00', actionPrimary: '#ee9b00',
        actionPrimaryText: '#ffffff', actionSecondary: '#ffd166',
        actionSecondaryText: '#6b5d3f', shadow: 'rgba(244, 211, 94, 0.3)'
    },
    mint: {
        primary: '#95d5b2', primaryLight: '#d8f3dc', primaryDeep: '#52b788',
        secondary: '#b7e4c7', bg: '#ffffff', bgSoft: '#f1faf3', text: '#3d5a45',
        textMuted: '#8aab92', border: '#52b788', actionPrimary: '#52b788',
        actionPrimaryText: '#ffffff', actionSecondary: '#95d5b2',
        actionSecondaryText: '#3d5a45', shadow: 'rgba(82, 183, 136, 0.25)'
    },
    'glass-light': {
        primary: '#8b9bb4', primaryLight: 'rgba(255,255,255,0.5)', primaryDeep: '#5d6d7e',
        secondary: '#c9d6e2', bg: 'rgba(255,255,255,0.55)', bgSoft: 'rgba(245,248,252,0.6)',
        text: '#3d4a5c', textMuted: '#8a99ad', border: 'rgba(139,155,180,0.5)',
        actionPrimary: '#5d6d7e', actionPrimaryText: '#ffffff',
        actionSecondary: '#c9d6e2', actionSecondaryText: '#3d4a5c',
        shadow: 'rgba(100, 120, 150, 0.2)'
    },
    'glass-dark': {
        primary: '#b794d4', primaryLight: 'rgba(60,50,80,0.5)', primaryDeep: '#d4a5e8',
        secondary: '#7c9eb2', bg: 'rgba(30,25,45,0.55)', bgSoft: 'rgba(40,35,55,0.6)',
        text: '#e8e3f0', textMuted: '#9a8fb0', border: 'rgba(183,148,212,0.4)',
        actionPrimary: '#b794d4', actionPrimaryText: '#1a1525',
        actionSecondary: '#7c9eb2', actionSecondaryText: '#1a1525',
        shadow: 'rgba(0, 0, 0, 0.5)'
    },
    sakura: {
        primary: '#f8a5c2', primaryLight: 'rgba(60, 40, 55, 0.6)', primaryDeep: '#ff6b9d',
        secondary: '#c39bd3', bg: 'rgba(40, 30, 45, 0.7)', bgSoft: 'rgba(50, 38, 58, 0.65)',
        text: '#f5e6ee', textMuted: '#b094a6', border: 'rgba(248, 165, 194, 0.5)',
        actionPrimary: '#ff6b9d', actionPrimaryText: '#ffffff',
        actionSecondary: '#c39bd3', actionSecondaryText: '#2a1f2e',
        shadow: 'rgba(255, 107, 157, 0.3)'
    },
    ocean: {
        primary: '#48cae4', primaryLight: '#caf0f8', primaryDeep: '#0077b6',
        secondary: '#90e0ef', bg: '#ffffff', bgSoft: '#f0fbfd', text: '#023e58',
        textMuted: '#8ab4c8', border: '#0077b6',
        actionPrimary: '#0077b6', actionPrimaryText: '#ffffff',
        actionSecondary: '#90e0ef', actionSecondaryText: '#023e58',
        shadow: 'rgba(0, 119, 182, 0.25)'
    },
    sunset: {
        primary: '#ffb07c', primaryLight: '#fff0e0', primaryDeep: '#ff7e3c',
        secondary: '#ffd6a5', bg: '#fffaf5', bgSoft: '#fff3e8', text: '#6b4423',
        textMuted: '#c4a382', border: '#ff7e3c',
        actionPrimary: '#ff7e3c', actionPrimaryText: '#ffffff',
        actionSecondary: '#ffd6a5', actionSecondaryText: '#6b4423',
        shadow: 'rgba(255, 126, 60, 0.3)'
    },
    lavender: {
        primary: '#c8a2d4', primaryLight: '#f3e5f7', primaryDeep: '#9c6bc7',
        secondary: '#e1bee7', bg: '#ffffff', bgSoft: '#faf5fc', text: '#5a4570',
        textMuted: '#b094c4', border: '#9c6bc7',
        actionPrimary: '#9c6bc7', actionPrimaryText: '#ffffff',
        actionSecondary: '#e1bee7', actionSecondaryText: '#5a4570',
        shadow: 'rgba(156, 107, 199, 0.25)'
    },
    mocha: {
        primary: '#c9a883', primaryLight: 'rgba(60, 45, 35, 0.6)', primaryDeep: '#a07855',
        secondary: '#d4b896', bg: 'rgba(45, 35, 28, 0.75)', bgSoft: 'rgba(55, 42, 33, 0.7)',
        text: '#f0e6d8', textMuted: '#a89880', border: 'rgba(201, 168, 131, 0.5)',
        actionPrimary: '#a07855', actionPrimaryText: '#ffffff',
        actionSecondary: '#d4b896', actionSecondaryText: '#2a1f15',
        shadow: 'rgba(160, 120, 85, 0.35)'
    }
};

const state = {
    isCollapsed: false,
    isFloating: false,
    currentGroup: '',
    currentBvid: '',
    savedHeight: '450px',
    savedWidth: '340px',
    savedPos: null,
    settings: { ...DEFAULT_SETTINGS },
    playlistData: {
        "🐾 未分类": [{ bvid: 'BV1GJ411x7h7', title: '极乐净土' }],
        "✨ 追剧池": []
    }
};

// 2. 数据恢复与持久化
function loadExtensionSettings() {
    try {
        const context = window.SillyTavern?.extensions_settings;
        let saved = null;

        if (context && context[MODULE_NAME]) {
            saved = context[MODULE_NAME];
        }

        if (!saved) {
            const local = localStorage.getItem(MODULE_NAME);
            if (local) {
                try {
                    saved = JSON.parse(local);
                    if (context) {
                        context[MODULE_NAME] = saved;
                        window.saveSettingsDebounced?.();
                    }
                } catch (e) { }
            }
        }

        if (!saved) {
            saved = {
                playlistData: state.playlistData,
                lastGroup: '',
                lastBvid: '',
                lastPos: null,
                settings: { ...DEFAULT_SETTINGS }
            };
            if (context) {
                context[MODULE_NAME] = saved;
                window.saveSettingsDebounced?.();
            }
            localStorage.setItem(MODULE_NAME, JSON.stringify(saved));
        }

        state.playlistData = saved.playlistData || state.playlistData;
        state.currentGroup = saved.lastGroup || '';
        state.currentBvid = saved.lastBvid || '';
        state.savedPos = saved.lastPos || null;
        state.settings = { ...DEFAULT_SETTINGS, ...(saved.settings || {}) };

        if (['cover', 'contain', 'repeat', '100% 100%'].includes(state.settings.borderImageMode)) {
            state.settings.borderImageFit = state.settings.borderImageMode;
            state.settings.borderImageMode = 'background';
        }

    } catch (e) {
        console.warn("配置读取失败", e);
    }
}

function saveExtensionSettings() {
    let pos = null;
    if (panelElement && !state.isFloating && panelElement.style.display !== 'none') {
        const rect = panelElement.getBoundingClientRect();
        pos = { left: rect.left, top: rect.top };
    }

    const data = {
        playlistData: state.playlistData,
        lastGroup: state.currentGroup,
        lastBvid: state.currentBvid,
        lastPos: pos,
        settings: state.settings
    };

    try {
        localStorage.setItem(MODULE_NAME, JSON.stringify(data));
    } catch (e) {
        console.warn("localStorage 保存失败", e);
    }

    const context = window.SillyTavern?.extensions_settings;
    if (context) {
        context[MODULE_NAME] = data;
        if (typeof window.saveSettingsDebounced === 'function') {
            window.saveSettingsDebounced();
        } else if (typeof window.saveSettings === 'function') {
            window.saveSettings();
        }
    }
}

// 3. 主题应用
function applyTheme() {
    const theme = state.settings.theme;
    const colors = state.settings.customColors || THEME_COLORS[theme] || THEME_COLORS.pink;

    const root = document.documentElement;
    if (colors.primary) root.style.setProperty('--kp-primary', colors.primary);
    if (colors.primaryLight) root.style.setProperty('--kp-primary-light', colors.primaryLight);
    if (colors.primaryDeep) root.style.setProperty('--kp-primary-deep', colors.primaryDeep);
    if (colors.secondary) root.style.setProperty('--kp-secondary', colors.secondary);
    if (colors.bg) root.style.setProperty('--kp-bg', colors.bg);
    if (colors.bgSoft) root.style.setProperty('--kp-bg-soft', colors.bgSoft);
    if (colors.text) root.style.setProperty('--kp-text', colors.text);
    if (colors.textMuted) root.style.setProperty('--kp-text-muted', colors.textMuted);
    if (colors.border) root.style.setProperty('--kp-border', colors.border);
    if (colors.actionPrimary) root.style.setProperty('--kp-action-primary', colors.actionPrimary);
    if (colors.actionPrimaryText) root.style.setProperty('--kp-action-primary-text', colors.actionPrimaryText);
    if (colors.actionSecondary) root.style.setProperty('--kp-action-secondary', colors.actionSecondary);
    if (colors.actionSecondaryText) root.style.setProperty('--kp-action-secondary-text', colors.actionSecondaryText);
    if (colors.shadow) root.style.setProperty('--kp-shadow', `0 12px 35px ${colors.shadow}`);

    root.setAttribute('data-bili-theme', theme);

    applyBorderImage();

    updateBadgeAvatar();

    if (panelElement) {
        const titleEl = panelElement.querySelector('.bili-ext-header .title');
        if (titleEl) {
            titleEl.textContent = `${THEMES[theme].emoji} BiliPlayer ${THEMES[theme].emoji}`;
        }
    }

    refreshSettingsUI();
}

function applyThemeColorsOnly() {
    const theme = state.settings.theme;
    const colors = state.settings.customColors || THEME_COLORS[theme] || THEME_COLORS.pink;

    const root = document.documentElement;
    if (colors.primary) root.style.setProperty('--kp-primary', colors.primary);
    if (colors.primaryLight) root.style.setProperty('--kp-primary-light', colors.primaryLight);
    if (colors.primaryDeep) root.style.setProperty('--kp-primary-deep', colors.primaryDeep);
    if (colors.secondary) root.style.setProperty('--kp-secondary', colors.secondary);
    if (colors.bg) root.style.setProperty('--kp-bg', colors.bg);
    if (colors.bgSoft) root.style.setProperty('--kp-bg-soft', colors.bgSoft);
    if (colors.text) root.style.setProperty('--kp-text', colors.text);
    if (colors.textMuted) root.style.setProperty('--kp-text-muted', colors.textMuted);
    if (colors.border) root.style.setProperty('--kp-border', colors.border);
    if (colors.actionPrimary) root.style.setProperty('--kp-action-primary', colors.actionPrimary);
    if (colors.actionPrimaryText) root.style.setProperty('--kp-action-primary-text', colors.actionPrimaryText);
    if (colors.actionSecondary) root.style.setProperty('--kp-action-secondary', colors.actionSecondary);
    if (colors.actionSecondaryText) root.style.setProperty('--kp-action-secondary-text', colors.actionSecondaryText);
    if (colors.shadow) root.style.setProperty('--kp-shadow', `0 12px 35px ${colors.shadow}`);
}

function applyBorderImage() {
    if (!panelElement) return;

    const oldLayer = panelElement.querySelector('.bili-border-image-layer');
    if (oldLayer) oldLayer.remove();

    if (!state.settings.borderImage) {
        panelElement.classList.remove('bili-has-border-image');
        panelElement.removeAttribute('data-border-mode');
        return;
    }

    panelElement.classList.add('bili-has-border-image');
    const mode = state.settings.borderImageMode || 'background';
    panelElement.setAttribute('data-border-mode', mode);

    const layer = document.createElement('div');
    layer.className = 'bili-border-image-layer';
    layer.style.backgroundImage = `url("${state.settings.borderImage}")`;

    const fit = state.settings.borderImageFit || 'cover';
    if (fit === 'repeat') {
        layer.style.backgroundSize = 'auto';
        layer.style.backgroundRepeat = 'repeat';
    } else if (fit === 'stretch') {
        layer.style.backgroundSize = '100% 100%';
        layer.style.backgroundRepeat = 'no-repeat';
    } else {
        layer.style.backgroundSize = fit;
        layer.style.backgroundRepeat = 'no-repeat';
    }

    layer.style.backgroundPosition = 'center';
    layer.style.opacity = state.settings.borderImageOpacity;

    panelElement.insertBefore(layer, panelElement.firstChild);
}

function updateBadgeAvatar() {
    if (!floatBadgeElement) return;
    
    const circle = floatBadgeElement.querySelector('.bili-badge-circle');
    if (!circle) return;
    
    const faceEl = circle.querySelector('.bili-badge-text-face');
    const imgEl = circle.querySelector('.bili-badge-avatar-img');
    
    const { avatarType, avatarValue } = state.settings;
    
    if (imgEl) imgEl.remove();
    
    if (avatarType === 'emoji' || !avatarValue) {
        circle.style.background = '';
        circle.style.backgroundImage = '';
        if (!faceEl) {
            const newFace = document.createElement('div');
            newFace.className = 'bili-badge-text-face';
            newFace.textContent = avatarValue || THEMES[state.settings.theme].emoji;
            circle.appendChild(newFace);
        } else {
            faceEl.textContent = avatarValue || THEMES[state.settings.theme].emoji;
            faceEl.style.display = '';
        }
    } else {
        if (faceEl) faceEl.style.display = 'none';
        const img = document.createElement('img');
        img.className = 'bili-badge-avatar-img';
        img.src = avatarValue;
        img.alt = 'avatar';
        img.onerror = () => {
            img.remove();
            if (faceEl) {
                faceEl.style.display = '';
                faceEl.textContent = THEMES[state.settings.theme].emoji;
            }
        };
        circle.appendChild(img);
    }
}

// 4. 安全释放 Iframe 内存
function safeUpdateIframe(src) {
    const box = document.getElementById('bili-ext-video-box');
    if (!box) return;
    
    const oldFrame = document.getElementById('bili-ext-frame');
    if (oldFrame) {
        oldFrame.src = 'about:blank';
        oldFrame.parentNode.removeChild(oldFrame);
    }
    
    const placeholder = document.getElementById('bili-ext-placeholder');
    if (!src) {
        if (placeholder) placeholder.style.display = 'flex';
        return;
    }
    
    if (placeholder) placeholder.style.display = 'none';
    const newFrame = document.createElement('iframe');
    newFrame.id = 'bili-ext-frame';
    newFrame.className = 'bili-ext-iframe';
    newFrame.setAttribute('scrolling', 'no');
    newFrame.setAttribute('frameborder', 'no');
    newFrame.setAttribute('allowfullscreen', 'true');
    newFrame.src = src;
    box.appendChild(newFrame);
}

function loadVideo(groupName, bvid) {
    state.currentGroup = groupName;
    state.currentBvid = bvid;
    
    let targetPage = 1; 
    let pureBvid = bvid;
    if (bvid.includes('_p')) {
        const parts = bvid.split('_p');
        pureBvid = parts[0];
        targetPage = parts[1] || 1;
    }
    
    const src = `https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=${pureBvid}&p=${targetPage}`;
    safeUpdateIframe(src);
    renderGroups(); 
    saveExtensionSettings();
}

// 5. 绘制系列列表（含 ⭐ 重命名功能）
let renderTimeout = null;

function renderGroups() {
    clearTimeout(renderTimeout);

    renderTimeout = setTimeout(() => {
        const container = document.getElementById('bili-ext-groups-container');
        if (!container) return;

        container.innerHTML = '';
        const allGroupNames = Object.keys(state.playlistData);

        if (allGroupNames.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:var(--kp-text-muted);font-size:11px;margin-top:20px;">盒子空啦喏~</div>';
            saveExtensionSettings();
            return;
        }

        const fragment = document.createDocumentFragment();

        allGroupNames.forEach(groupName => {
            const videos = state.playlistData[groupName] || [];
            const details = document.createElement('details');
            details.className = 'bili-details';

            if (state.currentGroup === groupName || allGroupNames.length === 1) {
                details.open = true;
            }

            const summary = document.createElement('summary');
            summary.className = 'bili-summary';
            // ⭐ 箭头从 👇 换成 ⭐
            summary.innerHTML = `
            <span class="bili-arrow">⭐</span>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${groupName} (${videos.length})
            </span>`;

            const groupDel = document.createElement('span');
            groupDel.className = 'bili-del';
            groupDel.textContent = '×';
            groupDel.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (videos.length > 0 && !confirm(`确定删除 ${groupName}？`)) {
                    return;
                }

                delete state.playlistData[groupName];

                if (state.currentGroup === groupName) {
                    state.currentGroup = '';
                    state.currentBvid = '';
                    safeUpdateIframe('');
                }
                renderGroups();
                saveExtensionSettings();
            };

            summary.appendChild(groupDel);
            details.appendChild(summary);

            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0 6px 6px';

            videos.forEach(item => {
                const li = document.createElement('li');
                li.className = 'bili-item';

                if (state.currentGroup === groupName && state.currentBvid === item.bvid) {
                    li.classList.add('active');
                }

                // ⭐ 视频名（点击播放 + 双击改名）
                const title = document.createElement('span');
                title.className = 'bili-title-span';
                title.textContent = item.title || item.bvid;
                title.title = '点击播放 · 双击改名';
                title.onclick = (e) => { 
                    e.stopPropagation();
                    loadVideo(groupName, item.bvid); 
                };
                // ⭐ 双击改名
                title.ondblclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    startRenameItem(li, groupName, item);
                };
                li.appendChild(title);

                // ⭐ 笔形按钮（hover 才显示）
                const renameBtn = document.createElement('span');
                renameBtn.className = 'bili-rename';
                renameBtn.textContent = '✎';
                renameBtn.title = '重命名';
                renameBtn.onclick = (e) => {
                    e.stopPropagation();
                    startRenameItem(li, groupName, item);
                };
                li.appendChild(renameBtn);

                const move = document.createElement('select');
                move.className = 'bili-selector';
                move.innerHTML = '<option disabled selected>移动</option>';

                allGroupNames.forEach(name => {
                    if (name === groupName) return;
                    move.innerHTML += `<option>${name}</option>`;
                });

                move.onchange = (e) => {
                    const target = e.target.value;
                    state.playlistData[groupName] = state.playlistData[groupName].filter(v => v.bvid !== item.bvid);
                    state.playlistData[target].push(item);

                    if (state.currentBvid === item.bvid) {
                        state.currentGroup = target;
                    }
                    renderGroups();
                    saveExtensionSettings();
                };
                li.appendChild(move);

                const del = document.createElement('span');
                del.className = 'bili-del';
                del.textContent = '×';
                del.onclick = () => {
                    state.playlistData[groupName] = state.playlistData[groupName].filter(v => v.bvid !== item.bvid);

                    if (state.currentBvid === item.bvid) {
                        safeUpdateIframe('');
                        state.currentBvid = '';
                        if (state.currentGroup === groupName) {
                            state.currentGroup = '';
                        }
                    }
                    renderGroups();
                    saveExtensionSettings();
                };
                li.appendChild(del);
                ul.appendChild(li);
            });

            details.appendChild(ul);
            fragment.appendChild(details);
        });

        container.appendChild(fragment);
        saveExtensionSettings();
    }, 30);
}

// ⭐ 新增：让某个视频项进入"重命名"状态
function startRenameItem(liElement, groupName, item) {
    if (liElement.classList.contains('bili-renaming')) return;
    
    const titleSpan = liElement.querySelector('.bili-title-span');
    if (!titleSpan) return;
    
    const oldTitle = item.title || item.bvid;
    const oldBvid = item.bvid;
    
    const idx = state.playlistData[groupName].findIndex(v => v.bvid === oldBvid);
    if (idx === -1) return;
    
    liElement.classList.add('bili-renaming');
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'bili-rename-input';
    input.value = oldTitle;
    input.placeholder = '输入新名字...';
    input.maxLength = 50;
    input.setAttribute('touch-action', 'manipulation');
    
    titleSpan.style.display = 'none';
    titleSpan.parentNode.insertBefore(input, titleSpan);
    
    // ⭐ 移动端：用 setTimeout 避免虚拟键盘弹起时立刻 blur
    setTimeout(() => {
        input.focus();
        input.select();
    }, 50);
    
    let finished = false;
    const finish = (commit) => {
        if (finished) return;
        finished = true;
        liElement.classList.remove('bili-renaming');
        
        if (commit) {
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== oldTitle) {
                const cur = state.playlistData[groupName][idx];
                if (cur && cur.bvid === oldBvid) {
                    cur.title = newTitle;
                    saveExtensionSettings();
                }
            }
        }
        if (input.parentNode) input.remove();
        titleSpan.style.display = '';
        renderGroups();
    };
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finish(true);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            finish(false);
        }
        // ⭐ 阻止冒泡，避免触发拖拽
        e.stopPropagation();
    };
    input.onblur = () => {
        // 移动端延迟判断：如果是被新 input 抢走焦点，忽略
        setTimeout(() => {
            if (!finished && document.activeElement !== input) {
                finish(true);
            }
        }, 100);
    };
    // ⭐ 阻止 input 点击冒泡到 li（防止触发拖拽）
    input.onclick = (e) => e.stopPropagation();
    input.onmousedown = (e) => e.stopPropagation();
    input.ontouchstart = (e) => e.stopPropagation();
}

// 6. 创建主面板
function createPanel() {
    if (document.getElementById('bili-player-extension-panel')) return;

    panelElement = document.createElement('div');
    panelElement.id = 'bili-player-extension-panel';
    panelElement.setAttribute('data-theme', state.settings.theme);
    
    if (window.innerWidth <= 768) {
        const w = Math.min(window.innerWidth * 0.94, 500);
        const h = Math.min(window.innerHeight * 0.82, 700);
        panelElement.style.position = 'fixed';
        panelElement.style.width = w + 'px';
        panelElement.style.height = h + 'px';
        panelElement.style.left = (window.innerWidth - w) / 2 + 'px';
        panelElement.style.top = (window.innerHeight - h) / 2 + 'px';
        panelElement.style.right = 'auto';
        panelElement.style.bottom = 'auto';
        panelElement.classList.add('bili-mobile');
        console.log('[BiliPlayer] 📱 移动端初始化', w, 'x', h);
    } else {
        panelElement.style.position = 'fixed';
        panelElement.style.bottom = '80px';
        panelElement.style.right = '20px';
    }
    
    const theme = state.settings.theme;
    const themeEmoji = THEMES[theme].emoji;
    
    // ⭐ 标题栏：新增 ? 帮助按钮
    panelElement.innerHTML = `
        <div class="bili-ext-header" id="bili-ext-header-drag">
            <span class="title">${themeEmoji} BiliPlayer ${themeEmoji}</span>
            <div class="bili-ext-controls">
                <button id="bili-ext-help-btn" class="bili-ext-btn" title="使用说明" type="button">?</button>
                <button id="bili-ext-settings-btn" class="bili-ext-btn" title="设置" type="button">⚙</button>
                <button id="bili-ext-collapse-btn" class="bili-ext-btn" title="切换收起/展开" type="button">_</button>
                <button id="bili-ext-close-btn" class="bili-ext-btn" title="缩成悬浮猫耳" type="button">×</button>
            </div>
        </div>
        <div class="bili-ext-video-box" id="bili-ext-video-box">
            <div class="bili-ext-dragging-shield"></div>
            <div class="bili-ext-placeholder" id="bili-ext-placeholder">
                <div class="bili-ext-mascot">${themeEmoji} • 人 • ${themeEmoji}</div>
                <p>小主人请投喂我~</p>
            </div>
        </div>
        <div id="bili-ext-lower-wrapper">
            <div class="bili-ext-panel">
                <div class="bili-ext-tools">
                    <div style="display:flex;gap:6px;">
                        <input type="text" id="bili-ext-g-input" placeholder="新分类/系列名称..." />
                        <button id="bili-ext-g-btn" class="bili-pink-action-btn" type="button">新建系列</button>
                    </div>
                    <div style="display:flex;gap:6px;margin-top:2px;">
                        <input type="text" id="bili-ext-v-input" placeholder="BV号 / 完整链接 / 分P链接 (空格+自定义名)" />
                        <button id="bili-ext-v-btn" class="bili-mint-action-btn" type="button">投喂</button>
                    </div>
                </div>
                <div class="bili-ext-groups" id="bili-ext-groups-container"></div>
            </div>
        </div>
    `;

    document.body.appendChild(panelElement);

    setupPanelEventDelegation(panelElement);

    applyBorderImage();
    applyThemeColorsOnly();

    if (state.savedPos && state.savedPos.left != null && state.savedPos.top != null) {
        const inViewport = state.savedPos.left > -100 && 
                           state.savedPos.top > -50 && 
                           state.savedPos.left < window.innerWidth - 50 && 
                           state.savedPos.top < window.innerHeight - 50;
        if (inViewport) {
            panelElement.style.left = state.savedPos.left + 'px';
            panelElement.style.top = state.savedPos.top + 'px';
            panelElement.style.right = 'auto';
            panelElement.style.bottom = 'auto';
        }
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (panelElement && !state.isFloating && panelElement.style.display !== 'none') {
                const rect = panelElement.getBoundingClientRect();
                if (rect.left < -panelElement.offsetWidth + 100 || 
                    rect.top < 0 || 
                    rect.right > window.innerWidth + 100 || 
                    rect.bottom > window.innerHeight) {
                    if (panelElement.classList.contains('bili-mobile')) {
                        const w = parseInt(panelElement.style.width);
                        const h = parseInt(panelElement.style.height);
                        panelElement.style.left = (window.innerWidth - w) / 2 + 'px';
                        panelElement.style.top = (window.innerHeight - h) / 2 + 'px';
                    } else {
                        panelElement.style.left = Math.max(0, window.innerWidth - panelElement.offsetWidth - 20) + 'px';
                        panelElement.style.top = Math.max(0, window.innerHeight - panelElement.offsetHeight - 100) + 'px';
                    }
                }
            }
        }, 200);
    });
}

function setupPanelEventDelegation(panel) {
    panel.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const id = btn.id;
        
        if (id === 'bili-ext-close-btn') {
            e.preventDefault();
            e.stopPropagation();
            enterFloatingState();
        } else if (id === 'bili-ext-collapse-btn') {
            e.preventDefault();
            e.stopPropagation();
            toggleCollapseState();
        } else if (id === 'bili-ext-g-btn') {
            createGroup();
        } else if (id === 'bili-ext-v-btn') {
            addVideo();
        } else if (id === 'bili-ext-settings-btn') {
            e.preventDefault();
            e.stopPropagation();
            openSettingsDialog();
        } else if (id === 'bili-ext-help-btn') {  // ⭐ 新增
            e.preventDefault();
            e.stopPropagation();
            openHelpDialog();
        }
    });

    initDragSystem(panel, document.getElementById('bili-ext-header-drag'), false);
}

// 7. 拖拽系统
function initDragSystem(panel, handle, isBadge) {
    if (!handle) return;
    
    let isDragging = false;
    let hasMoved = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let moveHandler = null;
    let endHandler = null;
    const DRAG_THRESHOLD = 5;

    const start = (clientX, clientY, e) => {
        // ⭐ 防止 input / 按钮 / 重命名输入框触发拖拽
        if (e.target.tagName === 'BUTTON' || 
            e.target.tagName === 'INPUT' || 
            e.target.tagName === 'SELECT' ||
            e.target.classList?.contains('bili-rename-input') ||
            e.target.closest('button') ||
            e.target.closest('input')) {
            return false;
        }

        if (!isBadge && !panel.classList.contains('bili-mobile')) {
            const rect = panel.getBoundingClientRect();
            if (clientX > rect.right - 16 && clientY > rect.bottom - 16) {
                return false;
            }
        }

        isDragging = true;
        hasMoved = false;
        if (isBadge) panel.dataset.dragging = 'true';
        
        const rect = panel.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        startX = clientX;
        startY = clientY;

        if (isBadge) {
            panel.style.left = startLeft + 'px';
            panel.style.top = startTop + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        } else {
            if (panel.style.right && panel.style.right !== 'auto') {
                panel.style.left = startLeft + 'px';
                panel.style.top = startTop + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            }
        }

        panel.classList.add('bili-is-dragging');
        if (!isBadge && e.cancelable) e.preventDefault();
        
        return true;
    };

    const move = (clientX, clientY) => {
        if (!isDragging) return;
        
        const dx = clientX - startX;
        const dy = clientY - startY;
        
        if (!hasMoved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
            hasMoved = true;
        }
        
        if (!hasMoved) return;
        
        panel.style.left = (startLeft + dx) + 'px';
        panel.style.top = (startTop + dy) + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
    };

    const end = () => {
        if (!isDragging) return;
        const wasMoved = hasMoved;
        isDragging = false;
        hasMoved = false;
        panel.classList.remove('bili-is-dragging');
        
        if (moveHandler) {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('touchmove', moveHandler);
            moveHandler = null;
        }
        if (endHandler) {
            document.removeEventListener('mouseup', endHandler);
            document.removeEventListener('touchend', endHandler);
            document.removeEventListener('touchcancel', endHandler);
            endHandler = null;
        }
        
        if (isBadge) {
            if (wasMoved) {
                panel.dataset.dragging = 'true';
                setTimeout(() => {
                    if (floatBadgeElement) panel.dataset.dragging = 'false';
                }, 100);
                saveExtensionSettings();
            } else {
                panel.dataset.dragging = 'false';
            }
        } else {
            saveExtensionSettings();
        }
    };

    handle.addEventListener('mousedown', (e) => {
        if (!start(e.clientX, e.clientY, e)) return;
        
        moveHandler = (ev) => move(ev.clientX, ev.clientY);
        endHandler = () => end();
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
    });

    handle.addEventListener('touchstart', (e) => {
        if (!e.touches[0]) return;
        if (!start(e.touches[0].clientX, e.touches[0].clientY, e)) return;
        
        moveHandler = (ev) => {
            if (ev.touches[0]) move(ev.touches[0].clientX, ev.touches[0].clientY);
        };
        endHandler = () => end();
        
        document.addEventListener('touchmove', moveHandler, { passive: false });
        document.addEventListener('touchend', endHandler);
        document.addEventListener('touchcancel', endHandler);
    }, { passive: false });
}

// 8. 折叠/展开
function toggleCollapseState() {
    state.isCollapsed = !state.isCollapsed;
    const lowerBody = document.getElementById('bili-ext-lower-wrapper');
    const btn = document.getElementById('bili-ext-collapse-btn');
    
    if (state.isCollapsed) {
        state.savedHeight = panelElement.style.height || '450px';
        state.savedWidth = panelElement.style.width || '340px';
        panelElement.classList.add('bili-collapsed-mode');
        panelElement.style.height = 'auto'; 
        panelElement.style.resize = 'horizontal'; 
        lowerBody.style.display = 'none';
        btn.textContent = '▢';
    } else {
        panelElement.classList.remove('bili-collapsed-mode');
        panelElement.style.height = state.savedHeight; 
        panelElement.style.width = state.savedWidth;
        panelElement.style.resize = 'both'; 
        lowerBody.style.display = 'flex';
        btn.textContent = '_';
    }
    saveExtensionSettings();
}

// 9. 缩成猫耳
function enterFloatingState() {
    console.log('[BiliPlayer] 进入悬浮球模式');
    state.isFloating = true;
    
    let badgeLeft = null, badgeTop = null;
    if (panelElement) {
        const rect = panelElement.getBoundingClientRect();
        state.savedPos = { left: rect.left, top: rect.top };
        const dim = BADGE_DIMENSIONS[state.settings.badgeSize] || BADGE_DIMENSIONS.medium;
        badgeLeft = rect.left + rect.width / 2 - dim.w / 2;
        badgeTop = rect.top + rect.height / 2 - dim.h / 2;
    }
    
    panelElement.style.display = 'none';
    createFloatBadge(badgeLeft, badgeTop);
    saveExtensionSettings();
}

function exitFloatingState() {
    console.log('[BiliPlayer] 退出悬浮球模式');
    state.isFloating = false;
    if (floatBadgeElement) {
        floatBadgeElement.style.display = 'none';
    }
    panelElement.style.display = 'flex';
    renderGroups();
    saveExtensionSettings();
}

// 10. 绘制小猫耳悬浮球
function createFloatBadge(customLeft = null, customTop = null) {
    if (document.getElementById('bili-ext-float-badge')) {
        floatBadgeElement.style.display = 'block';
        return;
    }

    floatBadgeElement = document.createElement('div');
    floatBadgeElement.id = 'bili-ext-float-badge';
    floatBadgeElement.dataset.dragging = 'false';
    floatBadgeElement.setAttribute('data-size', state.settings.badgeSize);
    floatBadgeElement.setAttribute('data-theme', state.settings.theme);
    
    const isMobile = window.innerWidth <= 768;
    const left = customLeft !== null ? customLeft + 'px' : (isMobile ? '15px' : '40px');
    const top = customTop !== null ? customTop + 'px' : '40%';
    
    floatBadgeElement.style.cssText = `
        position: fixed !important;
        left: ${left} !important;
        top: ${top} !important;
        z-index: 100000 !important;
        cursor: pointer !important;
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        user-select: none;
    `;

    floatBadgeElement.innerHTML = `
        <div class="bili-badge-container">
            <div class="bili-badge-ear left"></div>
            <div class="bili-badge-ear right"></div>
            <div class="bili-badge-circle">
                <div class="bili-badge-text-face"></div>
            </div>
        </div>
    `;

    document.body.appendChild(floatBadgeElement);

    updateBadgeAvatar();

    let downX = 0, downY = 0, downTime = 0;
    const TAP_THRESHOLD = 10;
    const TAP_TIME = 500;

    const onDown = (x, y) => {
        downX = x;
        downY = y;
        downTime = Date.now();
    };

    const onUp = (x, y) => {
        const dx = Math.abs(x - downX);
        const dy = Math.abs(y - downY);
        const dt = Date.now() - downTime;
        if (dx < TAP_THRESHOLD && dy < TAP_THRESHOLD && dt < TAP_TIME) {
            exitFloatingState();
        }
    };

    floatBadgeElement.addEventListener('touchstart', (e) => {
        if (e.touches[0]) onDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    floatBadgeElement.addEventListener('touchend', (e) => {
        if (e.changedTouches[0]) {
            onUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
    }, { passive: false });

    floatBadgeElement.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        onDown(e.clientX, e.clientY);
    });

    floatBadgeElement.addEventListener('mouseup', (e) => {
        if (e.button !== 0) return;
        onUp(e.clientX, e.clientY);
    });

    initDragSystem(floatBadgeElement, floatBadgeElement, true);
}

// ⭐ 新增：使用说明弹窗
function openHelpDialog() {
    if (document.getElementById('bili-ext-help-dialog')) {
        closeHelpDialog();
        return;
    }

    const isMobile = window.innerWidth <= 768;
    helpDialogElement = document.createElement('div');
    helpDialogElement.id = 'bili-ext-help-dialog';
    helpDialogElement.setAttribute('data-theme', state.settings.theme);
    if (isMobile) helpDialogElement.classList.add('bili-help-mobile');

    helpDialogElement.innerHTML = `
        <div class="bili-help-mask"></div>
        <div class="bili-help-box">
            <div class="bili-help-header">
                <span>📖 使用说明</span>
                <button class="bili-help-close" type="button">×</button>
            </div>
            <div class="bili-help-body">
                <div class="bili-help-section">
                    <div class="bili-help-title">🎬 添加视频</div>
                    <div class="bili-help-content">
                        在「投喂」输入框粘贴以下任一格式即可：
                        <ul>
                            <li><b>纯 BV 号：</b><code>BV1SPQeBuE2d</code></li>
                            <li><b>完整链接：</b><code>https://www.bilibili.com/video/BV1xxx</code></li>
                            <li><b>分P链接：</b>链接带 <code>?p=2</code> 自动识别</li>
                            <li><b>追踪参数：</b>带 <code>?vd_source=xxx</code> 也能识别</li>
                            <li><b>短链：</b><code>https://b23.tv/xxx</code>（自动展开）</li>
                        </ul>
                        💡 想自定义名字？在链接后<b>加个空格再写名字</b>：
                        <div class="bili-help-code">BV1SPQeBuE2d 蜡笔小新第一集</div>
                        ⭐ 粘贴链接后会自动获取真实标题哦！
                    </div>
                </div>

                <div class="bili-help-section">
                    <div class="bili-help-title">📂 分类管理</div>
                    <div class="bili-help-content">
                        <ul>
                            <li>在「新分类」输入框填名字 → 点击「新建系列」</li>
                            <li>视频右侧的下拉框可<b>移动到其他分类</b></li>
                            <li>分类名 / 视频名右侧的 <b>×</b> 可删除</li>
                        </ul>
                    </div>
                </div>

                <div class="bili-help-section">
                    <div class="bili-help-title">✏️ 重命名视频</div>
                    <div class="bili-help-content">
                        两种方式都能改名：
                        <ul>
                            <li><b>双击</b>视频名</li>
                            <li><b>悬停</b>视频后点击右侧 ✎ 笔形按钮</li>
                        </ul>
                        操作：<b>Enter</b> 保存 / <b>Esc</b> 取消 / 点击外部自动保存
                    </div>
                </div>

                <div class="bili-help-section">
                    <div class="bili-help-title">🎨 主题与外观</div>
                    <div class="bili-help-content">
                        顶部 <b>⚙ 设置</b> 按钮可切换 10 套主题、自定义配色、悬浮球样式、边框图片等。
                    </div>
                </div>

                <div class="bili-help-section">
                    <div class="bili-help-title">🐱 悬浮球</div>
                    <div class="bili-help-content">
                        点击右上 <b>×</b> 缩成悬浮猫耳：
                        <ul>
                            <li><b>单击猫耳</b>：恢复主面板</li>
                            <li><b>拖拽猫耳</b>：移动位置（自动保存）</li>
                        </ul>
                    </div>
                </div>

                <div class="bili-help-section">
                    <div class="bili-help-title">📱 移动端</div>
                    <div class="bili-help-content">
                        手机访问会自动适配：
                        <ul>
                            <li>面板自动居中，按屏幕 94% 宽度显示</li>
                            <li>输入框、按钮变大，方便触屏</li>
                            <li>改名输入框不触发拖拽</li>
                        </ul>
                    </div>
                </div>

                <div class="bili-help-section">
                    <div class="bili-help-title">💾 数据保存</div>
                    <div class="bili-help-content">
                        所有播放列表、设置、主题、位置都自动保存到本地。无需手动备份~
                    </div>
                </div>

                <div class="bili-help-footer">
                    🐾 BiliPlayer v1.2.0 · 让小主人看电影更开心~<br>
                    <span style="font-size:10px; opacity:0.8;">💖 特别鸣谢：本插件底层核心逻辑由 <b>老农民</b> 老师提供支持</span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(helpDialogElement);

    helpDialogElement.querySelector('.bili-help-close').onclick = closeHelpDialog;
    helpDialogElement.querySelector('.bili-help-mask').onclick = closeHelpDialog;
}

function closeHelpDialog() {
    if (helpDialogElement) {
        helpDialogElement.remove();
        helpDialogElement = null;
    }
}

// 11. 设置弹窗
function openSettingsDialog() {
    if (document.getElementById('bili-ext-settings-dialog')) {
        closeSettingsDialog();
        return;
    }

    const isMobile = window.innerWidth <= 768;
    settingsDialogElement = document.createElement('div');
    settingsDialogElement.id = 'bili-ext-settings-dialog';
    settingsDialogElement.setAttribute('data-theme', state.settings.theme);
    if (isMobile) settingsDialogElement.classList.add('bili-settings-mobile');

    settingsDialogElement.innerHTML = `
        <div class="bili-settings-mask"></div>
        <div class="bili-settings-box">
            <div class="bili-settings-header">
                <span>⚙ BiliPlayer 设置</span>
                <button class="bili-settings-close" type="button">×</button>
            </div>
            <div class="bili-settings-body">
                <!-- 主题 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🎨 主题配色</div>
                    <div class="bili-theme-grid">
                        ${Object.entries(THEMES).map(([key, info]) => `
                            <label class="bili-theme-option" data-theme-key="${key}">
                                <input type="radio" name="bili-theme" value="${key}" ${state.settings.theme === key ? 'checked' : ''}>
                                <div class="bili-theme-preview bili-theme-preview-${key}"></div>
                                <span>${info.name}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- ⭐ 悬浮窗边框图片 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🖼️ 悬浮窗边框图片（支持动图 GIF/WebP）</div>
                    <div class="bili-border-image-controls">
                        <div class="bili-border-image-upload-wrap">
                            <input type="file" id="bili-border-image-upload" accept="image/*" style="display:none;">
                            <button id="bili-border-image-upload-btn" type="button" class="bili-action-btn-sm bili-action-btn-primary">
                                ${state.settings.borderImage ? '✓ 已设置（点击更换）' : '📁 选择图片'}
                            </button>
                            ${state.settings.borderImage ? `<button id="bili-border-image-clear-btn" type="button" class="bili-action-btn-sm bili-action-btn-warn">移除</button>` : ''}
                        </div>

                        <div class="bili-border-image-mode-wrap">
                            <label class="bili-settings-sub-label">边框模式：</label>
                            <select id="bili-border-image-mode" class="bili-settings-select">
                                <option value="background" ${state.settings.borderImageMode === 'background' ? 'selected' : ''}>
                                    🖼️ 作为背景（保留猫耳边框）
                                </option>
                                <option value="replace" ${state.settings.borderImageMode === 'replace' ? 'selected' : ''}>
                                    🎀 替换原边框（图片包边）
                                </option>
                            </select>
                        </div>

                        <div class="bili-border-image-mode-wrap">
                            <label class="bili-settings-sub-label">填充方式：</label>
                            <select id="bili-border-image-fit" class="bili-settings-select">
                                <option value="cover" ${state.settings.borderImageFit === 'cover' ? 'selected' : ''}>覆盖（推荐）</option>
                                <option value="contain" ${state.settings.borderImageFit === 'contain' ? 'selected' : ''}>包含</option>
                                <option value="repeat" ${state.settings.borderImageFit === 'repeat' ? 'selected' : ''}>平铺</option>
                                <option value="stretch" ${state.settings.borderImageFit === 'stretch' ? 'selected' : ''}>拉伸</option>
                            </select>
                        </div>

                        <div class="bili-border-image-opacity-wrap">
                            <label class="bili-settings-sub-label">透明度：<span id="bili-border-opacity-val">${Math.round(state.settings.borderImageOpacity * 100)}%</span></label>
                            <input type="range" id="bili-border-image-opacity" min="0" max="100" value="${Math.round(state.settings.borderImageOpacity * 100)}" class="bili-settings-range">
                        </div>

                        <div class="bili-border-image-preview" id="bili-border-image-preview">
                            ${state.settings.borderImage ? `<img src="${state.settings.borderImage}" alt="边框预览">` : '<span style="color:var(--kp-text-muted);font-size:11px;">未设置边框图片</span>'}
                        </div>

                        <div class="bili-border-image-tip">💡 提示：「替换原边框」建议上传四周有图案、中心透明的 PNG；「作为背景」可上传任意纹理或动图</div>
                    </div>
                </div>

                <!-- ⭐ 自定义配色 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🎨 自定义配色 <span style="font-size:10px;color:var(--kp-text-muted);font-weight:normal;">（留空则使用上方选定的主题）</span></div>
                    <div class="bili-color-picker-grid">
                        <div class="bili-color-picker-item">
                            <label>主色</label>
                            <input type="color" id="bili-color-primary" value="${getColorValue('primary')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>主色浅</label>
                            <input type="color" id="bili-color-primary-light" value="${getColorValue('primaryLight')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>主色深</label>
                            <input type="color" id="bili-color-primary-deep" value="${getColorValue('primaryDeep')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>辅色</label>
                            <input type="color" id="bili-color-secondary" value="${getColorValue('secondary')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>面板背景</label>
                            <input type="color" id="bili-color-bg" value="${getColorValue('bg')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>文字颜色</label>
                            <input type="color" id="bili-color-text" value="${getColorValue('text')}">
                        </div>
                    </div>
                    <div class="bili-color-actions">
                        <button id="bili-color-reset" type="button" class="bili-action-btn-sm bili-action-btn-warn">↺ 重置配色</button>
                        <button id="bili-color-apply-preset" type="button" class="bili-action-btn-sm bili-action-btn-primary">✨ 应用当前主题预设</button>
                    </div>
                </div>

                <!-- 悬浮球大小 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🔘 悬浮球尺寸</div>
                    <div class="bili-size-options">
                        <label class="bili-size-option">
                            <input type="radio" name="bili-badge-size" value="large" ${state.settings.badgeSize === 'large' ? 'checked' : ''}>
                            <span>大（72px）</span>
                        </label>
                        <label class="bili-size-option">
                            <input type="radio" name="bili-badge-size" value="medium" ${state.settings.badgeSize === 'medium' ? 'checked' : ''}>
                            <span>中（58px）</span>
                        </label>
                        <label class="bili-size-option">
                            <input type="radio" name="bili-badge-size" value="small" ${state.settings.badgeSize === 'small' ? 'checked' : ''}>
                            <span>小（44px）</span>
                        </label>
                    </div>
                </div>

                <!-- 头像 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🐱 悬浮球头像</div>
                    <div class="bili-avatar-type">
                        <label>
                            <input type="radio" name="bili-avatar-type" value="emoji" ${state.settings.avatarType === 'emoji' ? 'checked' : ''}>
                            <span>颜文字/Emoji</span>
                        </label>
                        <label>
                            <input type="radio" name="bili-avatar-type" value="url" ${state.settings.avatarType === 'url' ? 'checked' : ''}>
                            <span>图片 URL</span>
                        </label>
                        <label>
                            <input type="radio" name="bili-avatar-type" value="upload" ${state.settings.avatarType === 'upload' ? 'checked' : ''}>
                            <span>上传图片</span>
                        </label>
                    </div>
                    <div class="bili-avatar-input-wrap">
                        <input type="text" id="bili-avatar-emoji" class="bili-avatar-input" 
                               placeholder="输入颜文字，如 ⎚˕⎚ 或 🐱" 
                               value="${state.settings.avatarType === 'emoji' ? state.settings.avatarValue : ''}" 
                               style="display:${state.settings.avatarType === 'emoji' ? 'block' : 'none'}">
                        <input type="text" id="bili-avatar-url" class="bili-avatar-input" 
                               placeholder="输入图片 URL，如 https://..." 
                               value="${state.settings.avatarType === 'url' ? state.settings.avatarValue : ''}" 
                               style="display:${state.settings.avatarType === 'url' ? 'block' : 'none'}">
                        <div class="bili-avatar-upload-wrap" style="display:${state.settings.avatarType === 'upload' ? 'block' : 'none'}">
                            <input type="file" id="bili-avatar-upload" accept="image/*" class="bili-avatar-input" style="display:none;">
                            <button id="bili-avatar-upload-preview" type="button" class="bili-action-btn-sm">
                                ${state.settings.avatarType === 'upload' && state.settings.avatarValue ? '✓ 已上传（点击重新选择）' : '点击上传图片'}
                            </button>
                        </div>
                    </div>
                    <div class="bili-avatar-preview" id="bili-avatar-preview">
                        <span style="font-size:11px;color:var(--kp-text-muted);">实时预览 →</span>
                        <div class="bili-avatar-preview-badge"></div>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="bili-settings-actions">
                    <button id="bili-settings-reset" type="button" class="bili-action-btn-sm bili-action-btn-warn">恢复默认</button>
                    <button id="bili-settings-save" type="button" class="bili-action-btn-sm bili-action-btn-primary">保存</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(settingsDialogElement);

    setupSettingsEvents();
    updateAvatarPreview();
}

function getColorValue(key) {
    const colors = state.settings.customColors || THEME_COLORS[state.settings.theme] || THEME_COLORS.pink;
    let val = colors[key] || '';
    if (val.startsWith('rgba') || val.startsWith('rgb(')) {
        return THEME_COLORS.pink[key] || '#ffffff';
    }
    return val || '#ffffff';
}

function setupSettingsEvents() {
    const dialog = settingsDialogElement;
    
    dialog.querySelector('.bili-settings-close').onclick = closeSettingsDialog;
    dialog.querySelector('.bili-settings-mask').onclick = closeSettingsDialog;
    
    dialog.querySelectorAll('input[name="bili-theme"]').forEach(radio => {
        radio.onchange = (e) => {
            const newTheme = e.target.value;
            dialog.setAttribute('data-theme', newTheme);
            if (!state.settings.customColors) {
                refreshColorInputs(newTheme);
            }
        };
    });
    
    const borderFileInput = dialog.querySelector('#bili-border-image-upload');
    const borderUploadBtn = dialog.querySelector('#bili-border-image-upload-btn');
    const borderClearBtn = dialog.querySelector('#bili-border-image-clear-btn');
    
    if (borderUploadBtn) {
        borderUploadBtn.onclick = () => borderFileInput.click();
    }
    if (borderClearBtn) {
        borderClearBtn.onclick = () => {
            state.settings.borderImage = '';
            closeSettingsDialog();
            openSettingsDialog();
        };
    }
    if (borderFileInput) {
        borderFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                alert('图片太大啦！请选择 5MB 以内的图片（动图文件较大是正常的）');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                state.settings.borderImage = ev.target.result;
                closeSettingsDialog();
                openSettingsDialog();
            };
            reader.readAsDataURL(file);
        };
    }
    
    const borderModeSelect = dialog.querySelector('#bili-border-image-mode');
    if (borderModeSelect) {
        borderModeSelect.onchange = (e) => {
            state.settings.borderImageMode = e.target.value;
        };
    }
    
    const borderFitSelect = dialog.querySelector('#bili-border-image-fit');
    if (borderFitSelect) {
        borderFitSelect.onchange = (e) => {
            state.settings.borderImageFit = e.target.value;
        };
    }
    
    const borderOpacity = dialog.querySelector('#bili-border-image-opacity');
    const borderOpacityVal = dialog.querySelector('#bili-border-opacity-val');
    if (borderOpacity) {
        borderOpacity.oninput = (e) => {
            const v = parseInt(e.target.value);
            state.settings.borderImageOpacity = v / 100;
            if (borderOpacityVal) borderOpacityVal.textContent = v + '%';
        };
    }
    
    const colorInputs = [
        'primary', 'primary-light', 'primary-deep',
        'secondary', 'bg', 'text'
    ];
    colorInputs.forEach(key => {
        const input = dialog.querySelector(`#bili-color-${key}`);
        if (input) {
            input.oninput = (e) => {
                const cssVar = '--kp-' + key.replace(/([A-Z])/g, '-\$1').toLowerCase();
                document.documentElement.style.setProperty(cssVar, e.target.value);
            };
        }
    });
    
    const colorResetBtn = dialog.querySelector('#bili-color-reset');
    if (colorResetBtn) {
        colorResetBtn.onclick = () => {
            state.settings.customColors = null;
            refreshColorInputs(state.settings.theme);
            applyTheme();
        };
    }
    
    const applyPresetBtn = dialog.querySelector('#bili-color-apply-preset');
    if (applyPresetBtn) {
        applyPresetBtn.onclick = () => {
            state.settings.customColors = null;
            refreshColorInputs(state.settings.theme);
            applyTheme();
        };
    }
    
    dialog.querySelectorAll('input[name="bili-avatar-type"]').forEach(radio => {
        radio.onchange = (e) => {
            const type = e.target.value;
            dialog.querySelector('#bili-avatar-emoji').style.display = type === 'emoji' ? 'block' : 'none';
            dialog.querySelector('#bili-avatar-url').style.display = type === 'url' ? 'block' : 'none';
            dialog.querySelector('.bili-avatar-upload-wrap').style.display = type === 'upload' ? 'block' : 'none';
            updateAvatarPreview();
        };
    });
    
    ['#bili-avatar-emoji', '#bili-avatar-url'].forEach(sel => {
        const el = dialog.querySelector(sel);
        if (el) el.addEventListener('input', updateAvatarPreview);
    });
    
    const fileInput = dialog.querySelector('#bili-avatar-upload');
    const uploadBtn = dialog.querySelector('#bili-avatar-upload-preview');
    
    uploadBtn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('图片太大啦！请选择 2MB 以内的图片');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            state.settings.avatarValue = ev.target.result;
            uploadBtn.textContent = '✓ 已上传（点击重新选择）';
            updateAvatarPreview();
        };
        reader.readAsDataURL(file);
    };
    
    dialog.querySelector('#bili-settings-reset').onclick = () => {
        if (!confirm('确定要恢复所有设置为默认值吗？播放列表不会受影响~')) return;
        
        state.settings.theme = DEFAULT_SETTINGS.theme;
        state.settings.badgeSize = DEFAULT_SETTINGS.badgeSize;
        state.settings.avatarType = DEFAULT_SETTINGS.avatarType;
        state.settings.borderImage = DEFAULT_SETTINGS.borderImage;
        state.settings.borderImageMode = DEFAULT_SETTINGS.borderImageMode;
        state.settings.borderImageFit = DEFAULT_SETTINGS.borderImageFit;
        state.settings.borderImageOpacity = DEFAULT_SETTINGS.borderImageOpacity;
        state.settings.customColors = DEFAULT_SETTINGS.customColors;
        
        closeSettingsDialog();
        openSettingsDialog();
        applyTheme();
        if (floatBadgeElement) {
            floatBadgeElement.setAttribute('data-size', state.settings.badgeSize);
            updateBadgeAvatar();
        }
        saveExtensionSettings();
    };
    
    dialog.querySelector('#bili-settings-save').onclick = () => {
        const theme = dialog.querySelector('input[name="bili-theme"]:checked').value;
        const badgeSize = dialog.querySelector('input[name="bili-badge-size"]:checked').value;
        const avatarType = dialog.querySelector('input[name="bili-avatar-type"]:checked').value;
        
        let avatarValue = '';
        if (avatarType === 'emoji') {
            avatarValue = dialog.querySelector('#bili-avatar-emoji').value.trim() || THEMES[theme].emoji;
        } else if (avatarType === 'url') {
            avatarValue = dialog.querySelector('#bili-avatar-url').value.trim();
            if (!avatarValue) {
                alert('请输入图片 URL');
                return;
            }
        } else if (avatarType === 'upload') {
            avatarValue = state.settings.avatarValue || '';
            if (!avatarValue) {
                alert('请先上传图片');
                return;
            }
        }
        
        const customColorsRaw = {
            primary: dialog.querySelector('#bili-color-primary').value,
            primaryLight: dialog.querySelector('#bili-color-primary-light').value,
            primaryDeep: dialog.querySelector('#bili-color-primary-deep').value,
            secondary: dialog.querySelector('#bili-color-secondary').value,
            bg: dialog.querySelector('#bili-color-bg').value,
            text: dialog.querySelector('#bili-color-text').value,
        };
        const themeColors = THEME_COLORS[theme];
        let isCustom = false;
        for (const key of Object.keys(customColorsRaw)) {
            const themeVal = (themeColors[key] || '').toLowerCase();
            const customVal = customColorsRaw[key].toLowerCase();
            if (themeVal.startsWith('rgba') || themeVal.startsWith('rgb(')) {
                isCustom = true;
                break;
            }
            if (customVal !== themeVal) {
                isCustom = true;
                break;
            }
        }
        
        state.settings.theme = theme;
        state.settings.badgeSize = badgeSize;
        state.settings.avatarType = avatarType;
        state.settings.avatarValue = avatarValue;
        state.settings.customColors = isCustom ? customColorsRaw : null;
        
        applyTheme();
        if (floatBadgeElement) {
            floatBadgeElement.setAttribute('data-size', badgeSize);
            updateBadgeAvatar();
        }
        
        saveExtensionSettings();
        closeSettingsDialog();
    };
}

function refreshColorInputs(themeKey) {
    if (!settingsDialogElement) return;
    const colors = THEME_COLORS[themeKey] || THEME_COLORS.pink;
    const mapping = {
        'primary': colors.primary,
        'primary-light': colors.primaryLight,
        'primary-deep': colors.primaryDeep,
        'secondary': colors.secondary,
        'bg': colors.bg,
        'text': colors.text
    };
    Object.entries(mapping).forEach(([key, val]) => {
        const input = settingsDialogElement.querySelector(`#bili-color-${key}`);
        if (input && val && !val.startsWith('rgba') && !val.startsWith('rgb(')) {
            input.value = val;
        }
    });
}

function closeSettingsDialog() {
    if (settingsDialogElement) {
        settingsDialogElement.remove();
        settingsDialogElement = null;
    }
}

function updateAvatarPreview() {
    if (!settingsDialogElement) return;
    const previewEl = settingsDialogElement.querySelector('.bili-avatar-preview-badge');
    if (!previewEl) return;
    
    const type = settingsDialogElement.querySelector('input[name="bili-avatar-type"]:checked').value;
    let value = '';
    
    if (type === 'emoji') {
        value = settingsDialogElement.querySelector('#bili-avatar-emoji').value.trim();
        if (!value) value = THEMES[state.settings.theme].emoji;
        previewEl.innerHTML = `<div class="bili-badge-text-face" style="font-size:20px;">${value}</div>`;
    } else if (type === 'url') {
        value = settingsDialogElement.querySelector('#bili-avatar-url').value.trim();
        if (value) {
            previewEl.innerHTML = `<img src="${value}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none'">`;
        } else {
            previewEl.innerHTML = '';
        }
    } else if (type === 'upload') {
        if (state.settings.avatarValue) {
            previewEl.innerHTML = `<img src="${state.settings.avatarValue}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            previewEl.innerHTML = '';
        }
    }
}

function refreshSettingsUI() {
    if (!settingsDialogElement) return;
    const dialog = settingsDialogElement;
    dialog.setAttribute('data-theme', state.settings.theme);
    
    const themeRadio = dialog.querySelector(`input[name="bili-theme"][value="${state.settings.theme}"]`);
    if (themeRadio) themeRadio.checked = true;
    
    const sizeRadio = dialog.querySelector(`input[name="bili-badge-size"][value="${state.settings.badgeSize}"]`);
    if (sizeRadio) sizeRadio.checked = true;
    
    const typeRadio = dialog.querySelector(`input[name="bili-avatar-type"][value="${state.settings.avatarType}"]`);
    if (typeRadio) typeRadio.checked = true;
}

// 12. 交互功能

/**
 * ⭐ 解析各种 B 站输入格式
 * 支持：纯 BV号、完整 URL、带分P、带追踪参数、番剧链接、短链
 */
function parseBilibiliInput(input) {
    if (!input) return null;
    
    // 情况 1：纯 BV 号
    const bvMatch = input.match(/(BV[a-zA-Z0-9]+)/);
    if (bvMatch) {
        let bvid = bvMatch[1];
        let pageNum = null;
        if (input.includes('p=')) {
            const pParts = input.split('p=');
            if (pParts[1]) {
                const numMatch = pParts[1].match(/^([0-9]+)/);
                if (numMatch) pageNum = numMatch[1];
            }
        }
        return { bvid, pageNum, sourceTitle: null };
    }
    
    // 情况 2：完整 URL
    const videoUrlMatch = input.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/i);
    if (videoUrlMatch) {
        const bvid = videoUrlMatch[1];
        const pageNum = extractPageFromUrl(input);
        return { bvid, pageNum, sourceTitle: null, needFetchTitle: true };
    }
    
    // 情况 3：短链 b23.tv
    const shortMatch = input.match(/b23\.tv\/([a-zA-Z0-9]+)/i);
    if (shortMatch) {
        return { 
            bvid: null, pageNum: null, sourceTitle: null,
            shortUrl: input, isShortUrl: true 
        };
    }
    
    // 情况 4：番剧链接
    const bangumiMatch = input.match(/bangumi\/play\/(ss|ep)(\d+)/i);
    if (bangumiMatch) {
        return { 
            bvid: null, pageNum: null, sourceTitle: null,
            bangumiId: bangumiMatch[2],
            bangumiType: bangumiMatch[1].toLowerCase(),
            isBangumi: true 
        };
    }
    
    return null;
}

function extractPageFromUrl(url) {
    try {
        if (url.includes('?')) {
            const query = url.split('?')[1].split('#')[0];
            const params = new URLSearchParams(query);
            const p = params.get('p');
            if (p && /^\d+$/.test(p)) return p;
        }
        const m = url.match(/[?&]p=(\d+)/);
        if (m) return m[1];
    } catch (e) { }
    return null;
}

async function fetchVideoTitle(bvid) {
    try {
        const resp = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
            credentials: 'omit'
        });
        const data = await resp.json();
        if (data?.code === 0 && data?.data?.title) {
            return data.data.title;
        }
    } catch (e) {
        console.warn('[BiliPlayer] 获取标题失败', e);
    }
    return null;
}

async function expandShortUrl(shortUrl) {
    try {
        const resp = await fetch(shortUrl, { 
            method: 'HEAD', 
            redirect: 'follow' 
        });
        const finalUrl = resp.url;
        console.log('[BiliPlayer] 短链展开:', shortUrl, '→', finalUrl);
        return parseBilibiliInput(finalUrl);
    } catch (e) {
        console.warn('[BiliPlayer] 短链展开失败（可能被 CORS 拦截）', e);
        return null;
    }
}

function createGroup() {
    const input = document.getElementById('bili-ext-g-input');
    const name = input.value.trim();
    if (!name || state.playlistData[name]) return;
    state.playlistData[name] = [];
    input.value = '';
    renderGroups();
    saveExtensionSettings();
}

async function addVideo() {
    const input = document.getElementById('bili-ext-v-input');
    const val = input.value.trim();
    if (!val) return;

    const spaceIndex = val.indexOf(' ');
    let videoPart = val;
    let customTitle = '';
    if (spaceIndex !== -1) {
        videoPart = val.substring(0, spaceIndex).trim();
        customTitle = val.substring(spaceIndex + 1).trim();
    }

    const parsed = parseBilibiliInput(videoPart);
    if (!parsed) {
        alert('无法识别这个链接或 BV 号哦~\n\n支持格式：\n• BV 号（BV1xxx...）\n• 完整链接（https://www.bilibili.com/video/BV...）\n• 带 ?p=2 的分P链接\n• 带 ?vd_source=xxx 的追踪参数链接\n• 短链（https://b23.tv/xxx）\n• 番剧链接（/bangumi/play/ss...）\n\n点击右上 ? 查看详细使用说明~');
        return;
    }

    if (parsed.isBangumi) {
        alert('番剧链接暂不支持直接添加哦~\n请在网页打开番剧，复制播放页的 BV 号或普通视频链接~');
        return;
    }

    if (parsed.isShortUrl) {
        const expanded = await expandShortUrl(parsed.shortUrl);
        if (!expanded || expanded.isShortUrl) {
            alert('短链展开失败啦~\n可能是 CORS 拦截，请直接复制完整链接试试~');
            return;
        }
        Object.assign(parsed, expanded);
    }

    const { bvid, pageNum, sourceTitle, needFetchTitle } = parsed;
    const finalBvid = pageNum ? bvid + "_p" + pageNum : bvid;
    
    let displayTitle = customTitle || sourceTitle || (pageNum ? `${bvid} (P${pageNum})` : bvid);

    let defaultBox = Object.keys(state.playlistData)[0] || "🐾 未分类";
    if (!state.playlistData[defaultBox]) state.playlistData[defaultBox] = [];

    if (!state.playlistData[defaultBox].some(v => v.bvid === finalBvid)) {
        state.playlistData[defaultBox].push({ bvid: finalBvid, title: displayTitle });
    }
    input.value = '';
    renderGroups();
    saveExtensionSettings();
    if (!state.currentBvid) loadVideo(defaultBox, finalBvid);

    if (needFetchTitle && !customTitle) {
        fetchVideoTitle(bvid).then(fetchedTitle => {
            if (fetchedTitle) {
                const finalTitle = pageNum ? `${fetchedTitle} (P${pageNum})` : fetchedTitle;
                const item = state.playlistData[defaultBox]?.find(v => v.bvid === finalBvid);
                if (item) {
                    item.title = finalTitle;
                    renderGroups();
                    saveExtensionSettings();
                }
            }
        });
    }
}

function toggleMainPlayerPanel() {
    if (state.isFloating) {
        exitFloatingState();
    } else if (panelElement) {
        if (panelElement.style.display === 'none') {
            panelElement.style.display = 'flex';
            renderGroups();
        } else {
            panelElement.style.display = 'none';
        }
    } else {
        createPanel();
        renderGroups();
    }
}

// 13. 初始化
function initExtension() {
    loadExtensionSettings();
    
    document.documentElement.setAttribute('data-bili-theme', state.settings.theme);
    applyThemeColorsOnly();

    const context = window.SillyTavern?.extensions_settings;
    if (context && !context[MODULE_NAME]) {
        context[MODULE_NAME] = {
            playlistData: state.playlistData,
            lastGroup: state.currentGroup,
            lastBvid: state.currentBvid,
            lastPos: state.savedPos,
            settings: state.settings
        };
        if (typeof window.saveSettingsDebounced === 'function') {
            window.saveSettingsDebounced();
        } else if (typeof window.saveSettings === 'function') {
            window.saveSettings();
        }
    }

    createPanel();
    renderGroups();

    if (
        state.currentGroup &&
        state.currentBvid &&
        state.playlistData[state.currentGroup]
    ) {
        loadVideo(state.currentGroup, state.currentBvid);
    }

    let attempts = 0;
    const injectInterval = setInterval(() => {
        attempts++;
        const extensionSettingsMenu = document.getElementById('extensions_settings');
        if (extensionSettingsMenu && !document.getElementById('bili-ext-nav-toggle')) {
            extensionSettingsMenu.insertAdjacentHTML('afterbegin', `
                <div class="inline-drawer" id="bili-ext-nav-toggle" style="margin-bottom: 10px; cursor: pointer; padding: 10px; background: var(--kp-pink-light); border-radius: 10px; border: 2px dashed var(--kp-pink); text-align: center; color: var(--kp-pink-deep); font-weight: bold;">
                    <span>📺 唤醒 / 隐藏 BiliPlayer 悬浮窗</span>
                </div>
            `);
            document.getElementById('bili-ext-nav-toggle').addEventListener('click', toggleMainPlayerPanel);
        }

        try {
            if (window.SillyTavern && window.SillyTavern.SlashCommandParser && !window.SillyTavern.SlashCommandParser.commands.bili) {
                window.SillyTavern.SlashCommandParser.addCommandObject(
                    window.SillyTavern.SlashCommandParser.commands.bili = {
                        namedArgumentList: [],
                        unnamedArgumentList: [],
                        returns: 'void',
                        helpString: '打开或隐藏 BiliPlayer 播放器',
                        execute: () => { toggleMainPlayerPanel(); return ''; }
                    }
                );
            }
        } catch (e) { }

        if (document.getElementById('bili-ext-nav-toggle') || attempts > 20) {
            clearInterval(injectInterval);
        }
    }, 1000);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initExtension();
} else {
    document.addEventListener('DOMContentLoaded', initExtension);
}
