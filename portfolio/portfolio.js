    /**
     * Portfolio Module
     * 处理作品集相关的功能
     */

    class PortfolioManager {
        constructor() {
            this.init();
        }

        init() {
            this.bindEvents();
        }


        bindEvents() {
            // 项目卡片点击事件将通过 HTML 的 onclick 属性处理
            // Portfolio Manager initialized
        }

        /**
         * 打开项目详情
         * @param {string} projectId - 项目ID
         */
        openProjectDetail(projectId) {
            if (projectId === 'datascience') {
                window.open('https://colab.research.google.com/drive/1A3DhtigtOnSK2Jkvbd3zkQkeWm7Pd1_x?usp=sharing', '_blank');
            } else if (projectId === 'best') {
                window.open('https://www.notion.com/templates/budget-expense-smart-tracker', '_blank');
            } else if (projectId === 'poster1' || projectId === 'poster2' || projectId === 'charity') {
                // Poster项目和公益活动暂时无跳转
                return;
            } else if (projectId === 'design') {
                window.open(`portfolio/design/index.html`, '_blank');
            } else if (projectId === 'treenode') {
                window.open('https://chromewebstore.google.com/detail/notion-treeview/ckoknomfbeadbnmkppidchmhmeaflbka', '_blank');
            } else {
                window.open(`portfolio/${projectId}/index.html`, '_blank');
            }
        }

        /**
         * 加载 Portfolio HTML 内容
         * @param {string} containerId - 容器ID
         */
        async loadPortfolioSection(containerId) {
            try {
                const response = await fetch('./portfolio/portfolio.html');
                
                const html = await response.text();
                
                const container = document.getElementById(containerId);
                
                if (container) {
                    container.innerHTML = html;
                    
                    // 找到插入的portfolio section并激活它
                    const portfolioSection = container.querySelector('#portfolio');
                    if (portfolioSection) {
                        portfolioSection.classList.add('active');
                        portfolioSection.style.display = 'block';
                    }

                    // load projects
                    this.getProjectsData();
                    
                    // 重新绑定事件
                    this.bindEvents();
                }
            } catch (error) {
                console.error('Error loading portfolio section:', error);
            }
        }

        /**
         * 获取项目数据
         */
        getProjectsData() {
            return [
                {
                    id: 'datascience',
                    title: 'Big Data Analysis',
                    description: 'Ride Price Factors and Ride-sharing Demand Forecasting',
                    tags: ['Python', 'ML', 'Data Analysis'],
                    image: 'portfolio/datascience/logo.jpg',
                    type: 'large',
                    url: 'https://colab.research.google.com/drive/1A3DhtigtOnSK2Jkvbd3zkQkeWm7Pd1_x?usp=sharing'
                },
                {
                    id: 'treeview',
                    title: 'Chrome Extension: TreeView',
                    description: 'Notion Database Visualization Chrome Extension',
                    tags: ['Product Design', 'React'],
                    image: 'portfolio/treeview/logo.jpg',
                    type: 'large',
                    url: 'portfolio/treeview/index.html'
                },
                {
                    id: 'ucg',
                    title: 'UCG WeChat Mini Program',
                    description: 'A WeChat Mini Program for the UAE Chinese Community',
                    tags: ['JavaScript', 'MySQL', 'Flask'],
                    image: 'portfolio/ucg/logo.jpg',
                    type: 'large',
                    url: 'portfolio/ucg/index.html'
                },
                {
                    id: 'design',
                    title: 'Visual Design',
                    description: 'Graphic Portfolio',
                    tags: ['Graphic Design', 'Poster Design'],
                    image: 'portfolio/design/design/design_03.jpg',
                    type: 'small',
                    url: 'portfolio/design/index.html'
                },
                {
                    id: 'charity',
                    title: 'Public Welfare',
                    description: 'Rescue and Help',
                    tags: ['Public Welfare'],
                    image: 'portfolio/public_welfare/logo.jpg',
                    type: 'small',
                    url: null
                },
                {
                    id: 'best',
                    title: 'BEST Notion Template',
                    description: 'Apple Shortcuts Budget Expense Tracker',
                    tags: ['Apple Shortcuts', 'Notion Template'],
                    image: 'portfolio/best/logo.jpg',
                    type: 'small',
                    url: 'https://www.notion.com/templates/budget-expense-smart-tracker'
                },
                {
                    id: 'emoji',
                    title: 'Emoji Design',
                    description: 'Original Emoji Design Portfolio, inspired by my fighting fish',
                    tags: ['CorelDRAW', 'Original IP'],
                    image: 'portfolio/emoji/logo.jpg',
                    type: 'large',
                    url: 'portfolio/emoji/index.html'
                },
                {
                    id: 'poster1',
                    title: 'Poster Design',
                    description: '',
                    tags: ['Graphic Design', 'CorelDRAW'],
                    image: 'portfolio/design/poster1.jpg',
                    type: 'poster',
                    url: null
                },
                {
                    id: 'poster2',
                    title: 'Poster Design',
                    description: '',
                    tags: ['Graphic Design', 'CorelDRAW'],
                    image: 'portfolio/design/poster2.jpg',
                    type: 'poster',
                    url: null
                }
            ];
        }
    }

    // 创建全局实例
    window.portfolioManager = new PortfolioManager();

    // 全局函数，供 HTML 调用
    function openProjectDetail(projectId) {
        window.portfolioManager.openProjectDetail(projectId);
    }

    // 导出类以供其他模块使用
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PortfolioManager;
    }
