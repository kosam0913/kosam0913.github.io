# Xinjie Hu - Personal Website

A modern, minimalist personal website showcasing my experience as a Technical Product Manager and Full Stack Developer.

## 🚀 Live Site
Visit: [kosam0913.github.io](https://kosam0913.github.io)

## 📁 Project Structure

```
kosam0913.github.io/
├── assets/                 # Static assets
│   ├── css/               # Stylesheets
│   │   └── main-style.css # Main CSS file
│   ├── images/            # All images
│   │   ├── bg/           # Background images
│   │   ├── favicon/      # Favicon files
│   │   ├── img/          # Profile images
│   │   └── portfolio/    # Project images
│   └── docs/             # Documents
│       ├── *.docx        # Resume files
│       └── *.pdf
├──               # Content organization
│   ├── blog/            # Blog posts
│   └── portfolio/       # Portfolio projects
│       └── tree_node/   # TreeNode project details
├── ref/                 # Reference materials
├── index.html          # Main website file
├── deploy.bat          # Deployment script
└── README.md           # This file
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Modern glass-morphism with responsive grid layout
- **Icons**: Font Awesome 6.0
- **Hosting**: GitHub Pages

## 🎨 Design Features

- **Three-column layout**: Personal info sidebar, main content, navigation sidebar
- **Responsive design**: Optimized for desktop, tablet, and mobile
- **Glass-morphism effects**: Modern backdrop-filter blur effects
- **Compact information density**: Optimized for professional presentation
- **Smooth scrolling navigation**: Enhanced user experience

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (Full three-column layout)
- **Tablet**: 768px-1199px (Stacked layout)
- **Mobile**: <768px (Single column)

## 🚀 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

For manual deployment:
```bash
./deploy.bat
```

## 📝 Content Management

### Adding Blog Posts
1. Create new `.md` file in `blog/`
2. Update blog section in `index.html`

### Adding Portfolio Projects
1. Create project folder in `portfolio/`
2. Add project images to `assets/images/portfolio/`
3. Update portfolio section in `index.html`

## 🔧 Development

1. Clone the repository
2. Open `index.html` in a browser
3. Make changes to HTML/CSS files
4. Test responsiveness across different screen sizes

## 📄 License

© 2025 Xinjie Hu. All rights reserved.

## 📞 Contact

- **Email**: xinjie.hu@gmail.com
- **LinkedIn**: [linkedin.com/in/xinjie-hu-574070125](https://www.linkedin.com/in/xinjie-hu-574070125/)
- **GitHub**: [github.com/kosam0913](https://github.com/kosam0913)

## GitHub Issues 博客系统

本网站集成了基于 GitHub Issues 的博客系统，具有以下特色：

### 功能特点

1. **自动获取 Issues** - 使用 GitHub API 自动获取仓库中的 Issues 作为博客文章
2. **标签分类** - 支持通过 Issues 标签进行文章分类和筛选
3. **响应式设计** - 完美适配各种设备屏幕
4. **Markdown 支持** - 自动渲染 Issues 中的 Markdown 内容
5. **分页浏览** - 支持文章分页显示
6. **实时更新** - 无需手动部署，Issues 更新即可同步

### 如何使用博客系统

#### 1. 创建博客文章

要发布新的博客文章，只需要在 GitHub 仓库中创建一个新的 Issue：

1. 前往仓库的 Issues 页面
2. 点击 "New issue" 创建新 Issue
3. 填写标题（作为文章标题）
4. 在内容区域写入 Markdown 格式的文章内容
5. 添加合适的标签（用于分类）
6. 创建 Issue

#### 2. 发布文章

要让文章在博客中显示：

1. 文章写作完成后，关闭 Issue（Close issue）
2. 只有状态为 "Closed" 的 Issues 才会在博客中显示
3. 这样可以区分草稿（Open）和发布的文章（Closed）

#### 3. 文章分类

使用 Issues 标签来管理文章分类：

- `技术` - 技术类文章
- `生活` - 生活感悟类文章  
- `项目` - 项目分享类文章
- `学习` - 学习笔记类文章

你可以根据需要创建和使用自己的标签分类系统。

#### 4. 更新文章

要更新已发布的文章：

1. 重新打开对应的 Issue
2. 编辑 Issue 内容
3. 完成修改后重新关闭 Issue
4. 博客会自动显示更新后的内容

#### 5. 配置设置

博客系统的配置在 `blog/index.html` 文件中：

```javascript
this.config = {
    owner: 'kosam0913',  // 你的 GitHub 用户名
    repo: 'kosam0913.github.io',  // 你的仓库名
    apiBase: 'https://api.github.com'
};
```

如果你 fork 了这个项目，请务必修改这两个配置项为你自己的信息。

### 技术实现

- **GitHub API** - 使用 REST API 获取 Issues 数据
- **原生 JavaScript** - 无框架依赖的轻量级实现
- **CSS Grid/Flexbox** - 现代化的响应式布局
- **Markdown 渲染** - 简单的 Markdown 到 HTML 转换

### 优势

1. **零成本** - 完全基于 GitHub 免费服务
2. **易于管理** - 直接在 GitHub 网页界面写作和管理
3. **版本控制** - 天然的版本历史记录
4. **协作友好** - 支持评论、讨论等社交功能
5. **备份安全** - 数据保存在 GitHub 云端

### 注意事项

- GitHub API 有速率限制（未认证请求每小时 60 次）
- 对于个人博客使用，这个限制通常足够
- 如需要更高频率访问，可以考虑添加 Personal Access Token

### 自定义样式

博客样式可以在 `blog/index.html` 的 `<style>` 标签中进行自定义，或者提取到独立的 CSS 文件中。所有样式都使用 CSS 变量，方便统一修改主题色彩。

---

如有任何问题或建议，欢迎在 Issues 中讨论！ 