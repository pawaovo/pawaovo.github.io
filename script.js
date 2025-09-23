// 技术栈现在使用静态网格布局，不需要滚动动画

// 生成文章字数热力图
function generateHeatmap() {
    const heatmapContainer = document.getElementById('cal-heatmap');
    if (!heatmapContainer) return;
    
    // 创建简化的热力图显示
    heatmapContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(26, 12px); gap: 2px; justify-content: center;">
            ${Array.from({length: 182}, (_, i) => {
                const level = Math.floor(Math.random() * 5);
                const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
                return `<div style="width: 12px; height: 12px; background: ${colors[level]}; border-radius: 2px;" title="文章字数: ${level * 500}"></div>`;
            }).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #666;">
            <span>March</span>
            <span>April</span>
            <span>May</span>
            <span>June</span>
            <span>July</span>
            <span>August</span>
        </div>
    `;
}

// 添加交互效果
function initInteractiveEffects() {
    // 卡片悬停效果
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
    });

    // 头像点击效果
    const avatar = document.querySelector('.profile-image img');
    if (avatar) {
        avatar.addEventListener('click', function() {
            this.style.transform = 'scale(1.1) rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 600);
        });
    }
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



// 添加键盘快捷键
document.addEventListener('keydown', function(e) {
    // 按 'P' 键聚焦到个人信息
    if (e.key.toLowerCase() === 'p') {
        document.querySelector('#name-card').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    // 按 'T' 键聚焦到技术栈
    if (e.key.toLowerCase() === 't') {
        document.querySelector('#techstack-card').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    // 按 'H' 键聚焦到热力图
    if (e.key.toLowerCase() === 'h') {
        document.querySelector('#heatmap-card').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
});


