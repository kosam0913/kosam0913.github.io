/**
 * Profile Module
 * 处理个人资料页面相关的功能，包括Cover Flow轮播组件
 */

class ProfileManager {
    constructor() {
        this.currentIndex = 4; // Start with Philosophy card (middle)
        this.totalCards = 9;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        // Profile Manager initialized
    }

    /**
     * 加载 Profile HTML 内容
     * @param {string} containerId - 容器ID
     */
    async loadProfileSection(containerId) {
        try {
            const response = await fetch('./profile/profile.html');
            
            const html = await response.text();
            
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = html;
                
                // 找到插入的profile section并激活它
                const profileSection = container.querySelector('#profile');
                if (profileSection) {
                    profileSection.classList.add('active');
                    profileSection.style.display = 'block';
                }
                
                // 加载完成后初始化Cover Flow
                setTimeout(() => {
                    this.initializeCoverflow();
                }, 100);
            }
        } catch (error) {
            console.error('Error loading profile section:', error);
        }
    }

    /**
     * 初始化Cover Flow组件
     */
    initializeCoverflow() {
        // Initialize indicators
        const indicatorsContainer = document.querySelector('.indicators-container');
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < this.totalCards; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                indicator.onclick = () => this.goToCard(i);
                indicatorsContainer.appendChild(indicator);
            }
        }
        
        // Add card click listeners
        const cards = document.querySelectorAll('.coverflow-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (index !== this.currentIndex) {
                    // Navigate to clicked card
                    this.goToCard(index);
                }
            });
        });
        
        // Initialize positions
        this.updateCoverflow();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            const profileSection = document.getElementById('profile');
            if (profileSection && (profileSection.classList.contains('active') || profileSection.style.display === 'block')) {
                if (e.key === 'ArrowLeft') {
                    this.navigateCoverflow(-1);
                } else if (e.key === 'ArrowRight') {
                    this.navigateCoverflow(1);
                }
            }
        });
    }

    /**
     * 导航Cover Flow
     * @param {number} direction - 方向 (-1: 左, 1: 右)
     */
    navigateCoverflow(direction) {
        if (this.isTransitioning) return;
        
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.totalCards) {
            this.goToCard(newIndex);
        }
        
        // Update navigation button states
        this.updateNavigationButtons();
    }
    
    /**
     * 更新导航按钮状态
     */
    updateNavigationButtons() {
        const prevBtn = document.querySelector('.coverflow-nav-btn.prev');
        const nextBtn = document.querySelector('.coverflow-nav-btn.next');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentIndex === this.totalCards - 1;
        }
    }

    /**
     * 跳转到指定卡片
     * @param {number} index - 卡片索引
     */
    goToCard(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        this.updateCoverflow();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    /**
     * 更新Cover Flow显示
     */
    updateCoverflow() {
        const cards = document.querySelectorAll('.coverflow-card');
        
        // 容器宽度估算 (根据viewport和卡片宽度)
        const containerWidth = 1500; // 大致的可视区域宽度
        const cardWidth = 320; // 单个卡片宽度
        const maxOffset = Math.floor(this.totalCards / 2); // 最大偏移量
        
        cards.forEach((card, index) => {
            const offset = index - this.currentIndex; // 当前卡片相对active的位置（左边负，右边正）
            
            let rotateY = 0;
            let translateX = 0;
            
            // 非线性压缩算法
            if (offset !== 0) {
                // 使用双曲正切函数实现非线性压缩
                // 近处间距大，远处间距逐渐压缩
                const baseSpacing = 120; // 基础间距
                const maxDistance = (containerWidth - cardWidth) / 2; // 最大允许距离
                
                // 归一化offset (-1 到 1)
                const normalizedOffset = offset / maxOffset;
                
                // 使用tanh函数进行非线性映射，确保不超出边界
                const compressedOffset = Math.tanh(normalizedOffset * 1.5); // 1.5为压缩系数
                
                // 最终位置 = 压缩后的偏移 * 最大允许距离
                translateX = compressedOffset * maxDistance * 0.8; // 0.8为安全系数
            }
            
            let translateZ = -Math.abs(offset) * 50; // 控制深度层级
            let scale = 1;
            let zIndex = 10 - Math.abs(offset); // active卡片在最上面
            let opacity = 1;
            
            // 远距离卡片透明度递减
            if (Math.abs(offset) > 3) {
                opacity = Math.max(0.3, 1 - (Math.abs(offset) - 3) * 0.2);
            }
            
            if (offset === 0) {
                // 中心卡片：正对用户，无旋转
                rotateY = 0;
                scale = 1;
                card.classList.add('center');
            } else if (offset < 0) {
                // 左边卡片：向右倾斜
                rotateY = Math.min(45, Math.abs(offset) * 15); // 根据距离调整旋转角度
                scale = Math.max(0.7, 1 - Math.abs(offset) * 0.05); // 根据距离调整缩放
                card.classList.remove('center');
            } else {
                // 右边卡片：向左倾斜
                rotateY = -Math.min(45, Math.abs(offset) * 15); // 根据距离调整旋转角度
                scale = Math.max(0.7, 1 - Math.abs(offset) * 0.05); // 根据距离调整缩放
                card.classList.remove('center');
            }
            
            card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
            card.style.zIndex = zIndex;
            card.style.opacity = opacity;
        });
        
        // Update navigation button states
        this.updateNavigationButtons();
    }

    /**
     * 切换到Profile页面
     */
    switchToProfile() {
        // Remove active class from all links and sections
        const navLinks = document.querySelectorAll('.nav__link');
        const sections = document.querySelectorAll('.content-section');
        
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        // Activate profile section
        const profileLink = document.querySelector('a[href="#profile"]');
        const profileSection = document.getElementById('profile');
        
        if (profileLink) profileLink.classList.add('active');
        if (profileSection) {
            profileSection.classList.add('active');
            profileSection.style.display = 'block';
        }
        
        // Initialize Cover Flow if not already done
        setTimeout(() => {
            const firstCard = document.querySelector('.coverflow-card');
            if (firstCard && !firstCard.style.transform) {
                this.initializeCoverflow();
            }
        }, 100);
    }

    /**
     * 获取个人资料数据
     */
    getProfileData() {
        return {
            cards: [
                {
                    type: 'info',
                    icon: 'fas fa-code',
                    title: 'Technical Expertise',
                    content: 'Specialized in AI/ML pipeline development, computer graphics, and motion capture technology. Experienced in building distributed computing systems and automation tools.',
                    meta: ['8+ Years Experience', 'Python • TensorFlow • Linux']
                },
                {
                    type: 'photo',
                    image: './profile/badminton.jpg',
                    alt: 'Badminton'
                },
                {
                    type: 'info',
                    icon: 'fas fa-film',
                    title: 'Industry Experience',
                    content: 'Worked on major Hollywood productions including Red Notice, Aquaman, and Star Wars. Contributed to cutting-edge visual effects and pipeline development.',
                    meta: ['Hollywood Productions', 'VFX • Game • Pipeline']
                },
                {
                    type: 'photo',
                    image: './profile/singer.jpg',
                    alt: 'Music Performance'
                },
                {
                    type: 'info',
                    icon: 'fas fa-lightbulb',
                    title: 'Philosophy',
                    content: 'Passionate about bridging technology and creativity. Believe that innovation in AI/ML can revolutionize the creative industry and improve production workflows.',
                    meta: ['Innovation • Creativity', 'AI/ML • Creative Tech']
                },
                {
                    type: 'photo',
                    image: './profile/ops.jpg',
                    alt: 'Operations'
                },
                {
                    type: 'info',
                    icon: 'fas fa-trophy',
                    title: 'Project Achievements',
                    content: 'Led development of motion capture AI models achieving 20x iteration speed improvement. Built full-stack WeChat Mini Program serving 500+ users in UAE Chinese community.',
                    meta: ['20x Performance Boost', '500+ Active Users']
                },
                {
                    type: 'photo',
                    image: './profile/diver.jpg',
                    alt: 'Diving'
                },
                {
                    type: 'info',
                    icon: 'fas fa-envelope',
                    title: 'Get In Touch',
                    content: 'Always open to discussing AI/ML, computer graphics, or any technology-related topics. Feel free to reach out for collaboration opportunities!',
                    meta: ['Abu Dhabi, UAE', 'Open to Remote']
                }
            ]
        };
    }
}

// 创建全局实例
window.profileManager = new ProfileManager();

// 全局函数，供 HTML 调用
function navigateCoverflow(direction) {
    window.profileManager.navigateCoverflow(direction);
}

function switchToProfile() {
    window.profileManager.switchToProfile();
}

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileManager;
}
