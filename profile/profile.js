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
        
        const newIndex = (this.currentIndex + direction + this.totalCards) % this.totalCards;
        this.goToCard(newIndex);
    }
    
    /**
     * 更新导航按钮状态
     */
    updateNavigationButtons() {
        const prevBtn = document.querySelector('.coverflow-nav-btn.prev');
        const nextBtn = document.querySelector('.coverflow-nav-btn.next');
        
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
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
     * 计算卡片的变换参数
     */
    computeCardTransform(offset) {
        const containerWidth = 1500;
        const cardWidth = 320;
        const maxOffset = Math.floor(this.totalCards / 2);

        let rotateY = 0;
        let translateX = 0;

        if (offset !== 0) {
            const maxDistance = (containerWidth - cardWidth) / 2;
            const normalizedOffset = offset / maxOffset;
            const compressedOffset = Math.tanh(normalizedOffset * 1.5);
            translateX = compressedOffset * maxDistance * 0.8;
        }

        let translateZ = -Math.abs(offset) * 50;
        let scale = 1;
        let zIndex = 10 - Math.abs(offset);
        let opacity = 1;

        if (Math.abs(offset) > 3) {
            opacity = Math.max(0.3, 1 - (Math.abs(offset) - 3) * 0.2);
        }

        if (offset === 0) {
            rotateY = 0;
            scale = 1;
        } else if (offset < 0) {
            rotateY = Math.min(45, Math.abs(offset) * 15);
            scale = Math.max(0.7, 1 - Math.abs(offset) * 0.05);
        } else {
            rotateY = -Math.min(45, Math.abs(offset) * 15);
            scale = Math.max(0.7, 1 - Math.abs(offset) * 0.05);
        }

        return { translateX, translateZ, rotateY, scale, zIndex, opacity };
    }

    /**
     * 计算循环偏移量
     */
    wrapOffset(rawOffset) {
        if (rawOffset > this.totalCards / 2) return rawOffset - this.totalCards;
        if (rawOffset < -this.totalCards / 2) return rawOffset + this.totalCards;
        return rawOffset;
    }

    /**
     * 更新Cover Flow显示（支持循环）
     */
    updateCoverflow() {
        const cards = document.querySelectorAll('.coverflow-card');
        const half = this.totalCards / 2;

        cards.forEach((card, index) => {
            const rawOffset = index - this.currentIndex;
            const offset = this.wrapOffset(rawOffset);
            const prevOffset = this._prevOffsets ? this._prevOffsets[index] : offset;

            const crossed = (prevOffset > half - 1 && offset < -(half - 1)) ||
                            (prevOffset < -(half - 1) && offset > (half - 1));

            if (crossed) {
                card.style.transition = 'none';
            }

            const t = this.computeCardTransform(offset);

            card.style.transform = `translateX(${t.translateX}px) translateZ(${t.translateZ}px) rotateY(${t.rotateY}deg) scale(${t.scale})`;
            card.style.zIndex = t.zIndex;
            card.style.opacity = t.opacity;

            if (offset === 0) {
                card.classList.add('center');
            } else {
                card.classList.remove('center');
            }

            if (crossed) {
                // Force reflow then re-enable transition
                void card.offsetWidth;
                card.style.transition = '';
            }
        });

        // Store offsets for next update
        this._prevOffsets = [];
        cards.forEach((_, index) => {
            this._prevOffsets[index] = this.wrapOffset(index - this.currentIndex);
        });

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
