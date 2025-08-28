/**
 * Main Application Controller
 * Handles navigation, component initialization, and global app state
 */

class PortfolioApp {
    constructor() {
        this.currentSection = 'portfolio'; // Default active section
        this.isInitialized = false;
        this.managers = {};
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
            this.setupNavigation();
            this.loadDefaultSection();
            this.isInitialized = true;
        });
    }

    /**
     * Initialize all components
     */
    async initializeComponents() {
        try {
            // Load widget profile component
            await this.loadWidgetProfile();
            
            // Store manager references
            this.managers = {
                profile: window.profileManager,
                portfolio: window.portfolioManager,
                blog: window.blogManager
            };
            
        } catch (error) {
            console.error('Error initializing components:', error);
        }
    }

    /**
     * Load widget profile component
     */
    async loadWidgetProfile() {
        if (typeof window.loadWidgetProfile === 'function') {
            await window.loadWidgetProfile({
                basePath: './',
                componentPath: './assets/components/widget-profile.html'
            });
        }
    }

    /**
     * Setup navigation event listeners
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav__link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
            });
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.navigateToSection('profile');
                        break;
                    case '2':
                        e.preventDefault();
                        this.navigateToSection('portfolio');
                        break;
                    case '3':
                        e.preventDefault();
                        this.navigateToSection('blog');
                        break;
                }
            }
        });
    }

    /**
     * Navigate to a specific section
     * @param {string} sectionId - The section to navigate to
     */
    async navigateToSection(sectionId) {
        if (this.currentSection === sectionId) return;

        try {
            // Clean up current section
            this.cleanupCurrentSection();
            
            // Update navigation state
            this.updateNavigationState(sectionId);
            
            // Load new section
            await this.loadSection(sectionId);
            
            // Update current section
            this.currentSection = sectionId;
            
        } catch (error) {
            console.error(`Error navigating to section ${sectionId}:`, error);
        }
    }

    /**
     * Clean up the current section
     */
    cleanupCurrentSection() {
        // Clean up blog sections if switching away from blog
        if (this.managers.blog && typeof this.managers.blog.cleanupBlogSections === 'function') {
            this.managers.blog.cleanupBlogSections();
        }

        // Hide all containers
        const containers = ['profile-container', 'portfolio-container', 'blog-container'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.style.display = 'none';
                // Remove active class from content sections
                const sections = container.querySelectorAll('.content-section');
                sections.forEach(section => {
                    section.classList.remove('active');
                    section.style.display = 'none';
                });
            }
        });
    }

    /**
     * Update navigation active state
     * @param {string} sectionId - The active section ID
     */
    updateNavigationState(sectionId) {
        const navLinks = document.querySelectorAll('.nav__link');
        
        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            if (linkTarget === sectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Load a specific section
     * @param {string} sectionId - The section to load
     */
    async loadSection(sectionId) {
        const container = document.getElementById(`${sectionId}-container`);
        if (!container) return;

        const manager = this.managers[sectionId];
        if (!manager) return;

        // Check if content needs to be loaded
        const existingSection = container.querySelector(`#${sectionId}`);
        const needsLoading = !existingSection || 
                           container.children.length === 0 || 
                           container.innerHTML.trim() === '' ||
                           container.innerHTML.includes('will be loaded dynamically');

        if (needsLoading && typeof manager.loadSection === 'function') {
            await manager.loadSection(`${sectionId}-container`);
        } else if (needsLoading) {
            // Fallback for managers with different method names
            const loadMethod = `load${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}Section`;
            if (typeof manager[loadMethod] === 'function') {
                await manager[loadMethod](`${sectionId}-container`);
            }
        } else if (existingSection) {
            // Content already exists, just activate it
            existingSection.classList.add('active');
            existingSection.style.display = 'block';
        }

        // Show the container
        container.style.display = 'block';
    }

    /**
     * Load the default section on page load
     */
    async loadDefaultSection() {
        // Find the active nav link to determine default section
        const activeLink = document.querySelector('.nav__link.active');
        if (activeLink) {
            const defaultSection = activeLink.getAttribute('href').substring(1);
            this.currentSection = defaultSection;
            
            // Wait a bit for managers to be fully initialized
            setTimeout(async () => {
                await this.loadSection(defaultSection);
            }, 200);
        }
    }

    /**
     * Get current section
     * @returns {string} Current active section ID
     */
    getCurrentSection() {
        return this.currentSection;
    }

    /**
     * Check if app is initialized
     * @returns {boolean} Initialization status
     */
    isReady() {
        return this.isInitialized;
    }
}

// Initialize the application
const portfolioApp = new PortfolioApp();

// Export for global access
window.portfolioApp = portfolioApp;

// Legacy support - maintain backward compatibility
window.addEventListener('DOMContentLoaded', function () {
    // This ensures any legacy code still works
    if (typeof window.loadWidgetProfile === 'function') {
        window.loadWidgetProfile({
            basePath: './',
            componentPath: './assets/components/widget-profile.html'
        });
    }
});
