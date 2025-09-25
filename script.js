// GitHub贡献热力图配置
const GITHUB_CONFIG = {
    username: 'pawaovo',
    apiUrl: 'https://github-contributions-api.jogruber.de/v4/',
    colors: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
    cacheKey: 'github_contributions_cache',
    cacheExpiry: 24 * 60 * 60 * 1000 // 24小时
};

// 月份名称常量
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 热力图布局常量
const HEATMAP_CONFIG = {
    cellSize: '16px',
    gap: '3px',
    rows: 7,
    borderRadius: '3px'
};

// 获取GitHub贡献数据
async function fetchGitHubContributions(username) {
    try {
        // 检查缓存
        const cached = getFromCache();
        if (cached) {
            console.log('使用缓存的GitHub数据');
            return cached;
        }

        console.log('从API获取GitHub数据...');
        const response = await fetch(`${GITHUB_CONFIG.apiUrl}${username}?y=last`);

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();

        // 缓存数据
        saveToCache(data.contributions);

        return data.contributions;
    } catch (error) {
        console.error('获取GitHub数据失败:', error);
        return null;
    }
}

// 缓存管理
function getFromCache() {
    try {
        const cached = localStorage.getItem(GITHUB_CONFIG.cacheKey);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        if (now - timestamp > GITHUB_CONFIG.cacheExpiry) {
            localStorage.removeItem(GITHUB_CONFIG.cacheKey);
            return null;
        }

        return data;
    } catch (error) {
        console.error('读取缓存失败:', error);
        return null;
    }
}

function saveToCache(data) {
    try {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(GITHUB_CONFIG.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
        console.error('保存缓存失败:', error);
    }
}

// 渲染GitHub贡献热力图
function renderGitHubHeatmap(contributions, container) {
    if (!contributions || contributions.length === 0) {
        throw new Error('无有效的贡献数据');
    }

    // 获取最近6个月的数据
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

    // 过滤最近6个月的数据
    const recentContributions = contributions.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= sixMonthsAgo && dayDate <= now;
    });

    // 按周组织数据
    const weeksData = organizeByWeeksWithDates(recentContributions, sixMonthsAgo);
    const weeks = weeksData.weeks;
    const monthLabels = generateMonthLabels(weeksData.startDate, weeks.length);

    // 生成热力图HTML - 使用正确的列优先布局
    const heatmapHTML = `
        <div class="github-heatmap" style="display: flex; flex-direction: column; align-items: center;">
            ${monthLabels}
            <div class="heatmap-grid" style="display: grid; grid-template-rows: repeat(${HEATMAP_CONFIG.rows}, ${HEATMAP_CONFIG.cellSize}); grid-template-columns: repeat(${weeks.length}, ${HEATMAP_CONFIG.cellSize}); gap: ${HEATMAP_CONFIG.gap}; justify-content: center;">
                ${generateHeatmapCells(weeks)}
            </div>
            <div class="heatmap-info" style="margin-top: 8px; font-size: 11px; color: #888; text-align: center;">
                数据来源: GitHub API
            </div>
        </div>
    `;

    container.innerHTML = heatmapHTML;

    // 添加交互效果
    addHeatmapInteractions(container);
}

// 按周组织数据（改进版，返回更多信息）
function organizeByWeeksWithDates(contributions, sixMonthsAgo) {
    const weeks = [];
    const contributionMap = {};

    // 创建贡献数据映射
    contributions.forEach(day => {
        contributionMap[day.date] = day;
    });

    // 获取开始日期（6个月前的第一个周日）
    const now = new Date();
    const startDate = new Date(sixMonthsAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // 调整到周日

    let currentDate = new Date(startDate);

    while (currentDate <= now) {
        const week = [];

        // 一周7天
        for (let i = 0; i < 7; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            week.push(contributionMap[dateStr] || null);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        weeks.push(week);
    }

    return {
        weeks: weeks,
        startDate: startDate
    };
}

// 生成月份标签
function generateMonthLabels(startDate, weekCount) {

    // 计算每个月在热力图中的位置
    let currentDate = new Date(startDate);
    const monthFirstWeek = {};

    for (let week = 0; week < weekCount; week++) {
        const weekStartDate = new Date(currentDate);
        const month = weekStartDate.getMonth();

        // 只记录月份第一次出现的位置，且不在第一周显示
        if (!(month in monthFirstWeek) && week > 0) {
            // 检查这一周是否是该月份的第一周（即上一周是不同月份）
            const prevWeekDate = new Date(currentDate);
            prevWeekDate.setDate(prevWeekDate.getDate() - 7);
            const prevMonth = prevWeekDate.getMonth();

            if (prevMonth !== month) {
                monthFirstWeek[month] = week;
            }
        }

        // 移动到下一周
        currentDate.setDate(currentDate.getDate() + 7);
    }

    // 生成月份标签HTML
    let labelsHTML = `<div class="month-labels" style="display: grid; grid-template-columns: repeat(${weekCount}, ${HEATMAP_CONFIG.cellSize}); gap: ${HEATMAP_CONFIG.gap}; margin-bottom: 4px; font-size: 11px; color: #666;">`;

    // 为每个月添加标签
    Object.entries(monthFirstWeek).forEach(([month, weekPos]) => {
        const monthName = MONTH_NAMES[parseInt(month)];
        // 确保有足够空间显示月份标签，且不在最左边显示
        if (weekPos >= 2 && weekPos + 3 <= weekCount) {
            labelsHTML += `<div style="grid-column: ${weekPos + 1} / span 3; text-align: left; font-size: 11px;">${monthName}</div>`;
        }
    });

    labelsHTML += '</div>';

    return labelsHTML;
}



// 生成热力图方格（按列优先排列）
function generateHeatmapCells(weeks) {
    const cells = [];

    // 按列优先的方式生成方格
    // 外层循环：行（星期几，0=周日，1=周一，...，6=周六）
    for (let row = 0; row < HEATMAP_CONFIG.rows; row++) {
        // 内层循环：列（第几周）
        for (let col = 0; col < weeks.length; col++) {
            const day = weeks[col][row]; // 获取第col周的第row天
            const color = day ? GITHUB_CONFIG.colors[day.level] : GITHUB_CONFIG.colors[0];
            const count = day ? day.count : 0;
            const date = day ? day.date : '';

            cells.push(`<div class="heatmap-day" style="width: ${HEATMAP_CONFIG.cellSize}; height: ${HEATMAP_CONFIG.cellSize}; background: ${color}; border-radius: ${HEATMAP_CONFIG.borderRadius}; cursor: pointer;" data-date="${date}" data-count="${count}"></div>`);
        }
    }

    return cells.join('');
}



// 添加热力图交互效果
function addHeatmapInteractions(container) {
    const days = container.querySelectorAll('.heatmap-day');

    // 创建悬浮提示框元素
    const tooltip = createTooltip();
    document.body.appendChild(tooltip);

    days.forEach(day => {
        day.addEventListener('mouseenter', function(e) {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';

            // 显示悬浮提示框
            const date = this.dataset.date;
            const count = this.dataset.count;
            if (date) {
                showTooltip(e, tooltip, date, count);
            }
        });

        day.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            // 隐藏悬浮提示框
            hideTooltip(tooltip);
        });

        day.addEventListener('mousemove', function(e) {
            // 更新提示框位置
            if (tooltip.style.display === 'block') {
                updateTooltipPosition(e, tooltip);
            }
        });
    });
}

// 创建悬浮提示框
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'github-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        white-space: nowrap;
        z-index: 1000;
        display: none;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    `;
    return tooltip;
}

// 显示悬浮提示框
function showTooltip(event, tooltip, date, count) {
    const formattedDate = formatDate(date);
    const countText = count > 0 ? `${count} 创造` : '0创造';
    tooltip.textContent = `${countText} on ${formattedDate}`;
    tooltip.style.display = 'block';
    updateTooltipPosition(event, tooltip);
}

// 隐藏悬浮提示框
function hideTooltip(tooltip) {
    tooltip.style.display = 'none';
}

// 更新提示框位置
function updateTooltipPosition(event, tooltip) {
    const x = event.pageX;
    const y = event.pageY;
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 计算提示框位置，避免超出屏幕边界
    let left = x + 10;
    let top = y - tooltipRect.height - 10;

    // 如果右边超出屏幕，则显示在鼠标左边
    if (left + tooltipRect.width > windowWidth) {
        left = x - tooltipRect.width - 10;
    }

    // 如果上边超出屏幕，则显示在鼠标下边
    if (top < 0) {
        top = y + 10;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// 格式化日期显示
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = MONTH_NAMES[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
}

// 生成静态热力图（作为后备方案）
function generateStaticHeatmap() {
    const heatmapContainer = document.getElementById('cal-heatmap');
    if (!heatmapContainer) return;

    console.log('使用静态热力图作为后备方案');

    // 计算6个月的周数（约27周）
    const weekCount = 27;
    const dayCount = weekCount * 7;

    // 生成按列优先排列的静态数据
    const staticCells = [];
    for (let row = 0; row < HEATMAP_CONFIG.rows; row++) {
        for (let col = 0; col < weekCount; col++) {
            const level = Math.floor(Math.random() * 5);
            staticCells.push(`<div style="width: ${HEATMAP_CONFIG.cellSize}; height: ${HEATMAP_CONFIG.cellSize}; background: ${GITHUB_CONFIG.colors[level]}; border-radius: ${HEATMAP_CONFIG.borderRadius};"></div>`);
        }
    }

    // 创建简化的热力图显示
    heatmapContainer.innerHTML = `
        <div class="github-heatmap" style="display: flex; flex-direction: column; align-items: center;">
            <div class="heatmap-grid" style="display: grid; grid-template-rows: repeat(${HEATMAP_CONFIG.rows}, ${HEATMAP_CONFIG.cellSize}); grid-template-columns: repeat(${weekCount}, ${HEATMAP_CONFIG.cellSize}); gap: ${HEATMAP_CONFIG.gap}; justify-content: center;">
                ${staticCells.join('')}
            </div>
            <div class="heatmap-info" style="margin-top: 8px; font-size: 11px; color: #888; text-align: center;">
                数据来源: GitHub API (后备显示)
            </div>
        </div>
    `;
}

// 主要的热力图生成函数
async function generateHeatmap() {
    const heatmapContainer = document.getElementById('cal-heatmap');
    if (!heatmapContainer) return;

    // 显示加载状态
    heatmapContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
            <div style="width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <div style="margin-top: 10px; font-size: 12px; color: #666;">加载GitHub贡献数据...</div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    try {
        // 获取GitHub贡献数据
        const contributions = await fetchGitHubContributions(GITHUB_CONFIG.username);

        if (contributions && contributions.length > 0) {
            // 渲染真实的GitHub热力图
            renderGitHubHeatmap(contributions, heatmapContainer);
            console.log('GitHub热力图渲染成功');
        } else {
            throw new Error('无法获取GitHub数据');
        }

    } catch (error) {
        console.error('GitHub热力图生成失败:', error);
        // 降级到静态显示
        generateStaticHeatmap();
    }
}

// 添加交互效果
function initInteractiveEffects() {
    // 这里可以添加其他交互效果
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    generateHeatmap();
    initInteractiveEffects();

    // 添加页面加载动画
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});