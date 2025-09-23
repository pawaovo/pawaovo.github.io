# Pawa's Personal Website

这是一个使用纯HTML、CSS和JavaScript构建的现代化个人主页，灵感来源于优秀的个人网站设计。

## 🌟 特性

- **现代化设计** - 采用玻璃拟态效果和渐变背景
- **响应式布局** - 完美适配桌面端和移动端
- **动态效果** - 包含滚动动画、悬停效果和交互反馈
- **技术栈展示** - 滚动展示个人技术栈
- **活动热力图** - 模拟GitHub风格的代码提交热力图
- **个性化内容** - 展示个人信息、项目和特色

## 🚀 快速开始

### 本地预览

1. 克隆仓库到本地
```bash
git clone https://github.com/yourusername/pawa.github.io.git
cd pawa.github.io
```

2. 使用任意HTTP服务器预览
```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 或直接用浏览器打开 index.html
```

### 部署到GitHub Pages

1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择从main分支部署
4. 访问 `https://yourusername.github.io` 查看网站

## 📁 项目结构

```
pawa.github.io/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript功能
└── README.md           # 项目说明
```

## 🎨 自定义

### 修改个人信息

编辑 `index.html` 中的以下部分：

```html
<!-- 个人信息 -->
<h2 class="name">Pawa</h2>
<h3 class="alias">alias. 开发者、创作者</h3>

<!-- 社交链接 -->
<a href="https://github.com/pawa" class="social-link">GitHub</a>
<a href="mailto:hi@pawa.dev" class="social-link">hi@pawa.dev</a>
```

### 修改技术栈

在 `index.html` 的技术栈部分添加或修改技术图标：

```html
<div class="tech-item">
    <img src="技术图标URL" alt="技术名称">
    <span>技术名称</span>
</div>
```

### 修改颜色主题

在 `style.css` 中修改CSS变量：

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **JavaScript** - 交互功能
- **GitHub Pages** - 免费托管

## 📱 响应式设计

网站完全响应式，支持：
- 桌面端 (1200px+)
- 平板端 (768px - 1199px)
- 移动端 (< 768px)

## ⚡ 性能优化

- 使用CDN加载字体和图标
- CSS动画使用GPU加速
- 图片懒加载
- 代码压缩优化

## 🎯 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系方式

- GitHub: [@pawa](https://github.com/pawa)
- Email: hi@pawa.dev

---

⭐ 如果这个项目对你有帮助，请给个Star！
