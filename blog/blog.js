/**
 * Blog Module
 * 处理博客相关的功能，包括GitHub Issues集成
 */

class BlogManager {
    constructor() {
        // GitHub repository information
        this.GITHUB_OWNER = 'kosam0913';
        this.GITHUB_REPO = 'kosam0913.github.io';
        
        // DOM elements (will be set when content is loaded)
        this.loadingEl = null;
        this.errorEl = null;
        this.errorTextEl = null;
        this.blogPostsEl = null;
        this.noPostsEl = null;
        
        this.init();
    }

    init() {
        // Blog Manager initialized
    }

    /**
     * 加载 Blog HTML 内容
     * @param {string} containerId - 容器ID
     */
    async loadBlogSection(containerId) {
        try {
            const response = await fetch('./blog/blog.html');
            
            const html = await response.text();
            
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = html;
                
                // 找到插入的blog section并激活它
                const blogSection = container.querySelector('#blog');
                if (blogSection) {
                    blogSection.classList.add('active');
                    blogSection.style.display = 'block';
                }
                
                // 初始化DOM元素引用
                this.initDOMElements();
                
                // 加载blog posts
                setTimeout(() => {
                    this.loadBlogPosts();
                }, 100);
            }
        } catch (error) {
            console.error('Error loading blog section:', error);
        }
    }

    /**
     * 初始化DOM元素引用
     */
    initDOMElements() {
        this.loadingEl = document.getElementById('loading');
        this.errorEl = document.getElementById('error');
        this.errorTextEl = document.getElementById('error-text');
        this.blogPostsEl = document.getElementById('blog-posts');
        this.noPostsEl = document.getElementById('no-posts');
    }

    /**
     * 加载博客文章
     */
    async loadBlogPosts() {
        try {
            this.showLoading();
            
            const apiUrl = `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/issues?state=open&sort=created&direction=desc&per_page=20`;
            
            const fetchResponse = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!fetchResponse.ok) {
                if (fetchResponse.status === 403) {
                    throw new Error('GitHub API rate limit exceeded. Please try again later.');
                } else if (fetchResponse.status === 404) {
                    throw new Error('Repository not found or no issues with "blog" label exist.');
                } else {
                    throw new Error(`GitHub API error: ${fetchResponse.status} ${fetchResponse.statusText}`);
                }
            }
            
            const data = await fetchResponse.json();
            const filteredData = data.filter(issue => issue.labels.some(label => label.name === 'blog' || label.name === 'note'));
            const response = { data: filteredData };

            const issues = response.data;
            
            if (issues.length === 0) {
                this.showNoPosts();
                return;
            }

            // Render blog posts
            this.renderBlogPosts(issues);
            
            this.showBlogPosts();
            
        } catch (error) {
            console.error('Error loading blog posts:', error);
            
            let errorMessage = error.message;
            
            // 为不同类型的错误提供更有用的提示
            if (error.message.includes('rate limit')) {
                errorMessage += '\n\n💡 Tip: GitHub API allows 60 requests per hour for unauthenticated requests.';
            } else if (error.message.includes('no issues with "blog" label')) {
                errorMessage += '\n\n💡 Tip: Create GitHub Issues with the "blog" label to display them here.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error: Please check your internet connection.';
            }
            this.showError(errorMessage);
        }
    }

    /**
     * 渲染博客文章列表
     * @param {Array} issues - GitHub Issues数组
     */
    renderBlogPosts(issues) {
        if (!this.blogPostsEl) return;
        
        this.blogPostsEl.innerHTML = '';
        
        issues.forEach(issue => {
            const postEl = this.createBlogPostElement(issue);
            this.blogPostsEl.appendChild(postEl);
        });
    }

    /**
     * 提取缩略图
     * @param {string} body - 文章内容
     * @returns {Object|null} 缩略图信息
     */
    extractThumbnail(body) {
        if (!body) return null;
        
        console.log("BODY:", body);
        // 提取第一张图片作为缩略图
        const imageRegex = /<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"[^>]*\/?>/i;
        const match = body.match(imageRegex);
        
        if (match) {
            return {
                alt: match[1] || 'Blog thumbnail',
                src: match[2]
            };
        }
        
        return null;
    }

    /**
     * 创建博客文章元素
     * @param {Object} issue - GitHub Issue对象
     * @returns {HTMLElement} 文章元素
     */
    createBlogPostElement(issue) {
        const postEl = document.createElement('article');
        postEl.className = 'blog-post';
        
        // Extract excerpt from issue body
        const excerpt = this.getExcerpt(issue.body || '');
        
        // Extract thumbnail
        const thumbnail = this.extractThumbnail(issue.body || '');
        
        // Format date
        const createdDate = this.formatDate(new Date(issue.created_at));
        const updatedDate = this.formatDate(new Date(issue.updated_at));
        
        postEl.innerHTML = `
            <div class="blog-post-layout">
                <div class="blog-post-thumbnail">
                    ${thumbnail ? 
                        `<img src="${thumbnail.src}" alt="${this.escapeHtml(thumbnail.alt)}" class="blog-thumbnail-img" style="width: 100%; height: 100px; object-fit: cover;">` :
                        `<div class="blog-thumbnail-placeholder">
                            <i class="fas fa-file-alt"></i>
                        </div>`
                    }
                </div>
                <div class="blog-post-main">
            <div class="blog-post-header">
                <div class="blog-post-meta">
                    <div class="blog-post-date">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Published: ${createdDate}</span>
                    </div>
                    ${issue.updated_at !== issue.created_at ? `
                    <div class="blog-post-date">
                        <i class="fas fa-edit"></i>
                        <span>Updated: ${updatedDate}</span>
                    </div>
                    ` : ''}
                    <div class="blog-post-labels">
                        ${issue.labels.map(label => 
                            `<span class="blog-post-label" style="background: #${label.color}20; color: #${label.color};">${label.name}</span>`
                        ).join('')}
                    </div>
                </div>
                <h2 class="blog-post-title">${this.escapeHtml(issue.title)}</h2>
            </div>
            <div class="blog-post-content">
                <div class="blog-post-excerpt">${excerpt}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add click handler to load blog post
        postEl.addEventListener('click', (e) => {
            this.loadBlogPost(issue);
        });
        
        return postEl;
    }

    /**
     * 获取文章摘要
     * @param {string} body - 文章内容
     * @param {number} maxLength - 最大长度
     * @returns {string} 摘要
     */
    getExcerpt(body, maxLength = 100) {
        if (!body) return 'No content preview available.';
        
        // 改进 Markdown 转换，使用更全面的正则表达式
        let plainText = body
            // 移除代码块
            .replace(/```[\s\S]*?```/g, '[Code Block]')
            // 移除行内代码
            .replace(/`([^`]+)`/g, '$1')
            // 移除Markdown格式图片
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
            // 移除HTML格式图片
            .replace(/<img[^>]*alt="([^"]*)"[^>]*\/?>/gi, '')
            // 移除链接，保留文本
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // 移除粗体
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            // 移除斜体
            .replace(/\*([^*]+)\*/g, '$1')
            // 移除标题标记
            .replace(/#{1,6}\s+/g, '')
            // 移除引用
            .replace(/>\s+/g, '')
            // 移除列表标记
            .replace(/^\s*[-*+]\s+/gm, '')
            // 移除数字列表
            .replace(/^\s*\d+\.\s+/gm, '')
            // 替换多个换行为空格
            .replace(/\n+/g, ' ')
            // 移除多余空格
            .replace(/\s+/g, ' ')
            .trim();
        
        if (plainText.length <= maxLength) {
            return plainText;
        }
        
        // 在单词边界截断，避免截断单词
        const truncated = plainText.substring(0, maxLength);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        
        if (lastSpaceIndex > maxLength * 0.8) {
            return truncated.substring(0, lastSpaceIndex) + '...';
        }
        
        return truncated + '...';
    }

    /**
     * 格式化日期
     * @param {Date} date - 日期对象
     * @returns {string} 格式化的日期字符串
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * HTML转义
     * @param {string} text - 需要转义的文本
     * @returns {string} 转义后的HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        if (!this.loadingEl) return;
        this.loadingEl.style.display = 'block';
        if (this.errorEl) this.errorEl.style.display = 'none';
        if (this.blogPostsEl) this.blogPostsEl.style.display = 'none';
        if (this.noPostsEl) this.noPostsEl.style.display = 'none';
    }

    /**
     * 显示错误信息
     * @param {string} message - 错误信息
     */
    showError(message) {
        if (!this.errorEl || !this.errorTextEl) return;
        this.errorTextEl.textContent = message;
        if (this.loadingEl) this.loadingEl.style.display = 'none';
        this.errorEl.style.display = 'block';
        if (this.blogPostsEl) this.blogPostsEl.style.display = 'none';
        if (this.noPostsEl) this.noPostsEl.style.display = 'none';
    }

    /**
     * 显示博客文章
     */
    showBlogPosts() {
        if (!this.blogPostsEl) return;
        if (this.loadingEl) this.loadingEl.style.display = 'none';
        if (this.errorEl) this.errorEl.style.display = 'none';
        this.blogPostsEl.style.display = 'grid';
        if (this.noPostsEl) this.noPostsEl.style.display = 'none';
    }

    /**
     * 显示无文章状态
     */
    showNoPosts() {
        if (!this.noPostsEl) return;
        if (this.loadingEl) this.loadingEl.style.display = 'none';
        if (this.errorEl) this.errorEl.style.display = 'none';
        if (this.blogPostsEl) this.blogPostsEl.style.display = 'none';
        this.noPostsEl.style.display = 'block';
    }

    /**
     * 加载博客文章详情
     * @param {Object} issue - GitHub Issue对象
     */
    async loadBlogPost(issue) {
        try {
            this.showBlogLoading();
            
            // Fetch the detailed issue content
            const apiUrl = `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/issues/${issue.number}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to load blog post: ${response.status}`);
            }
            
            const detailedIssue = await response.json();
            this.renderBlogPost(detailedIssue);
            
        } catch (error) {
            console.error('Error loading blog post:', error);
            this.showBlogError('Failed to load blog post. Please try again.');
        }
    }

    /**
     * 渲染博客文章详情
     * @param {Object} issue - GitHub Issue对象
     */
    renderBlogPost(issue) {
        const contentSections = document.querySelector('.content-sections');
        
        // Clean up any existing blog detail sections first
        this.cleanupBlogSections();
        
        // Hide all sections first
        const allSections = document.querySelectorAll('.content-section');
        allSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Also hide profile, portfolio and blog containers
        const profileContainer = document.getElementById('profile-container');
        if (profileContainer) {
            profileContainer.style.display = 'none';
        }
        
        const portfolioContainer = document.getElementById('portfolio-container');
        if (portfolioContainer) {
            portfolioContainer.style.display = 'none';
        }
        
        const blogContainer = document.getElementById('blog-container');
        if (blogContainer) {
            blogContainer.style.display = 'none';
        }
        
        // Create blog post detail section
        const blogDetailSection = document.createElement('section');
        blogDetailSection.id = 'blog-detail';
        blogDetailSection.className = 'content-section active';
        blogDetailSection.style.display = 'block';
        
        // Format dates
        const createdDate = this.formatDate(new Date(issue.created_at));
        const updatedDate = this.formatDate(new Date(issue.updated_at));
        
        // Render markdown content
        const markdownContent = marked.parse(issue.body || '');
        
        blogDetailSection.innerHTML = `
            <div class="blog-detail-container">
                <div class="blog-detail-header">

                    <div class="blog-detail-meta">
                        <div class="blog-detail-date">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Published: ${createdDate}</span>
                        </div>
                        ${issue.updated_at !== issue.created_at ? `
                        <div class="blog-detail-date">
                            <i class="fas fa-edit"></i>
                            <span>Updated: ${updatedDate}</span>
                        </div>
                        ` : ''}
                        <div class="blog-detail-labels">
                            ${issue.labels.map(label => 
                                `<span class="blog-detail-label" style="background: #${label.color}20; color: #${label.color};">${label.name}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <h1 class="blog-detail-title">${this.escapeHtml(issue.title)}</h1>
                </div>
                <div class="blog-detail-content">
                    <div class="blog-detail-body">${markdownContent}</div>
                </div>
                <div class="blog-detail-footer">
                    <a href="${issue.html_url}" target="_blank" class="view-on-github-btn">
                        <i class="fab fa-github"></i>
                        View on GitHub
                    </a>
                </div>
            </div>
        `;
        
        // Add the new section
        contentSections.appendChild(blogDetailSection);
        
        // Update navigation
        this.updateNavigation('blog');
    }

    /**
     * 返回博客列表
     */
    backToBlogList() {
        // Clean up all blog-related sections
        this.cleanupBlogSections();
        
        // Get the original blog section
        const blogSection = document.getElementById('blog');
        
        // Hide all sections first
        const allSections = document.querySelectorAll('.content-section');
        allSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Also hide profile, portfolio and blog containers
        const profileContainer = document.getElementById('profile-container');
        if (profileContainer) {
            profileContainer.style.display = 'none';
        }
        
        const portfolioContainer = document.getElementById('portfolio-container');
        if (portfolioContainer) {
            portfolioContainer.style.display = 'none';
        }
        
        const blogContainer = document.getElementById('blog-container');
        if (blogContainer) {
            blogContainer.style.display = 'none';
        }
        
        // Show the original blog section
        if (blogSection) {
            blogSection.classList.add('active');
            blogSection.style.display = 'block';
            
            // Reload blog posts
            setTimeout(() => {
                this.loadBlogPosts();
            }, 100);
        }
        
        // Update navigation
        this.updateNavigation('blog');
    }

    /**
     * 显示博客加载状态
     */
    showBlogLoading() {
        // Hide all sections first
        const allSections = document.querySelectorAll('.content-section');
        allSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Also hide profile, portfolio and blog containers
        const profileContainer = document.getElementById('profile-container');
        if (profileContainer) {
            profileContainer.style.display = 'none';
        }
        
        const portfolioContainer = document.getElementById('portfolio-container');
        if (portfolioContainer) {
            portfolioContainer.style.display = 'none';
        }
        
        const blogContainer = document.getElementById('blog-container');
        if (blogContainer) {
            blogContainer.style.display = 'none';
        }
        
        // Create or update blog loading section
        const contentSections = document.querySelector('.content-sections');
        let blogLoadingSection = document.getElementById('blog-loading');
        
        if (!blogLoadingSection) {
            blogLoadingSection = document.createElement('section');
            blogLoadingSection.id = 'blog-loading';
            blogLoadingSection.className = 'content-section active';
            contentSections.appendChild(blogLoadingSection);
        }
        
        blogLoadingSection.innerHTML = `
            <div class="blog-container">
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p style="margin-top: 1rem; color: #64748b;">Loading blog post...</p>
                </div>
            </div>
        `;
        
        blogLoadingSection.classList.add('active');
        blogLoadingSection.style.display = 'block';
    }

    /**
     * 显示博客错误状态
     * @param {string} message - 错误信息
     */
    showBlogError(message) {
        // Hide all sections first
        const allSections = document.querySelectorAll('.content-section');
        allSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Also hide profile, portfolio and blog containers
        const profileContainer = document.getElementById('profile-container');
        if (profileContainer) {
            profileContainer.style.display = 'none';
        }
        
        const portfolioContainer = document.getElementById('portfolio-container');
        if (portfolioContainer) {
            portfolioContainer.style.display = 'none';
        }
        
        const blogContainer = document.getElementById('blog-container');
        if (blogContainer) {
            blogContainer.style.display = 'none';
        }
        
        // Create or update blog error section
        const contentSections = document.querySelector('.content-sections');
        let blogErrorSection = document.getElementById('blog-error');
        
        if (!blogErrorSection) {
            blogErrorSection = document.createElement('section');
            blogErrorSection.id = 'blog-error';
            blogErrorSection.className = 'content-section active';
            contentSections.appendChild(blogErrorSection);
        }
        
        blogErrorSection.innerHTML = `
            <div class="blog-container">
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;
        
        blogErrorSection.classList.add('active');
        blogErrorSection.style.display = 'block';
    }

    /**
     * 清理博客相关sections
     */
    cleanupBlogSections() {
        const sectionsToCleanup = ['blog-detail', 'blog-loading', 'blog-error'];
        sectionsToCleanup.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.remove();
            }
        });
    }

    /**
     * 更新导航状态
     * @param {string} activeSection - 活动section
     */
    updateNavigation(activeSection) {
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        const targetLink = document.querySelector(`a[href="#${activeSection}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }
}

// 创建全局实例
window.blogManager = new BlogManager();

// 全局函数，供 HTML 调用
function backToBlogList() {
    window.blogManager.backToBlogList();
}

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}
