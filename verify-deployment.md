# 🔍 GitHub Pages 部署验证清单

## ✅ 部署前检查
- [ ] GitHub 仓库已创建（命名为 `username.github.io`）
- [ ] 本地代码已推送到 GitHub
- [ ] GitHub Pages 设置为 "GitHub Actions"
- [ ] `.github/workflows/deploy.yml` 文件存在

## ✅ 部署状态检查
1. **访问 GitHub Actions**：
   - 地址：`https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io/actions`
   - 检查最新的工作流是否成功（绿色勾号）

2. **检查 Pages 状态**：
   - 地址：`https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io/settings/pages`
   - 应该显示 "Your site is live at https://YOUR_USERNAME.github.io"

## ✅ 网站功能验证
访问 `https://YOUR_USERNAME.github.io` 并检查：

### 基础功能
- [ ] 页面正常加载，无 404 错误
- [ ] 所有 CSS 样式正确应用
- [ ] JavaScript 功能正常工作

### 布局检查
- [ ] 网格布局正确显示（4列布局）
- [ ] 个人信息卡片显示正常
- [ ] 技术栈卡片显示正常
- [ ] 所有卡片尺寸一致，对齐正确

### 交互功能
- [ ] 卡片悬停效果正常
- [ ] 头像点击动画正常
- [ ] 热力图正确生成
- [ ] 键盘快捷键正常工作（P、T、H 键）

### 响应式设计
- [ ] 桌面端显示正常（>768px）
- [ ] 移动端显示正常（<768px）
- [ ] 平板端显示正常（768px-1199px）

### 链接检查
- [ ] GitHub 链接正常跳转
- [ ] 邮箱链接正常工作
- [ ] Ultralime 博客链接正常
- [ ] 极客死亡计划链接正常

## 🚨 常见问题排查

### 如果网站无法访问：
1. 检查仓库名是否正确（必须是 `username.github.io`）
2. 检查仓库是否为 Public
3. 等待 5-10 分钟，GitHub Pages 有时需要时间生效

### 如果样式不正确：
1. 检查 CSS 文件是否正确上传
2. 检查浏览器开发者工具的网络标签页，查看是否有 404 错误
3. 清除浏览器缓存并刷新

### 如果 JavaScript 不工作：
1. 打开浏览器开发者工具的控制台，查看是否有错误
2. 检查 script.js 文件是否正确上传

## 📞 获取帮助
如果遇到问题，可以：
1. 检查 GitHub Actions 的日志输出
2. 查看 GitHub Pages 的官方文档
3. 在 GitHub 社区寻求帮助
