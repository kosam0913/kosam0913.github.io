/**
 * Widget Profile Component Loader
 */

class WidgetProfileComponent {
    constructor(options = {}) {
        this.options = {
            containerId: 'widget-profile-container',
            avatarPath: 'assets/images/profile/avatar_prev.jpg',
            componentPath: 'assets/components/widget-profile.html',
            basePath: '', 
            ...options
        };
    }

    /**
     * 获取组件路径（由 options 提供）
     */
    getComponentPath() {
        return this.options.componentPath;
    }

    /**
     * 获取头像图片路径（由 options.basePath + options.avatarPath 拼接）
     */
    getAvatarPath() {
        return this.options.basePath + this.options.avatarPath;
    }

    /**
     * 加载并渲染组件
     */
    async load() {
        try {
            const componentPath = this.getComponentPath();
            const response = await fetch(componentPath);
            
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            
            let html = await response.text();
            
            // 替换模板变量
            html = html.replace('{{avatarPath}}', this.getAvatarPath());
            
            // 查找容器并插入HTML
            const container = document.getElementById(this.options.containerId);
            if (container) {
                container.innerHTML = html;
            } else {
                // 如果没有指定容器，直接插入到body的开始位置
                document.body.insertAdjacentHTML('afterbegin', html);
            }
            
            // 触发组件加载完成事件
            this.onLoaded();
            
        } catch (error) {
            console.error('Error loading widget-profile component:', error);
            // 提供fallback
            this.loadFallback();
        }
    }

    /**
     * 组件加载完成后的回调
     */
    onLoaded() {
        const event = new CustomEvent('widgetProfileLoaded', {
            detail: { component: this }
        });
        document.dispatchEvent(event);
    }

    /**
     * Fallback：如果组件加载失败，使用内联模板
     */
    loadFallback() {
        const avatarPath = this.getAvatarPath();
        const fallbackHTML = `
            <div class="widget-profile">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-3 col-xs-12">
                        <div class="profile__image">
                            <img src="${avatarPath}" alt="Xinjie Hu" class="img-responsive" />
                        </div>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-3 col-xs-12">
                        <div class="profile__info">
                            <h1 class="profile__name">Hu Xinjie</h1>
                            <h4 class="profile__title">Full Stack Developer</h4>
                            <h4 class="profile__title"> Technical Artist</h4>
                            <h6 class="profile__location"><i class="fa fa-map-pin"></i> Abu Dhabi, UAE</h6>
                        </div>
                        <div class="profile__social">
                            <a href="https://www.facebook.com/kosam0913" target="_blank"><i class="fab fa-facebook"></i></a>
                            <a href="https://www.linkedin.com/in/xinjie-hu-574070125/" target="_blank"><i class="fab fa-linkedin"></i></a>
                            <a href="https://github.com/kosam0913" target="_blank"><i class="fab fa-github"></i></a>
                            <a href="mailto:kosam0913@gmail.com" target="_blank"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.getElementById(this.options.containerId);
        if (container) {
            container.innerHTML = fallbackHTML;
        } else {
            document.body.insertAdjacentHTML('afterbegin', fallbackHTML);
        }
        
        this.onLoaded();
    }
}

/**
 * 全局便利函数：快速加载组件
 */
window.loadWidgetProfile = function(options) {
    const component = new WidgetProfileComponent(options);
    return component.load();
};

/**
 * 自动加载：如果页面包含 data-auto-load-widget-profile 属性，自动加载组件
 */
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.hasAttribute('data-auto-load-widget-profile')) {
        const options = {
            basePath: document.body.getAttribute('data-base-path') || '',
            componentPath: document.body.getAttribute('data-component-path') || 'assets/components/widget-profile.html'
        };
        window.loadWidgetProfile(options);
    }
}); 