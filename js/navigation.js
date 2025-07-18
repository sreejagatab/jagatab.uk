/**
 * Shared Navigation Component for Jagatab.UK
 *
 * ⚠️  DEPRECATED: This file is deprecated as of 2024
 *
 * Please use the new Universal Components system instead:
 * - File: js/universal-components.js
 * - Features: Responsive design, accessibility, consistent styling
 * - Migration guide: UNIVERSAL-COMPONENTS-MIGRATION.md
 *
 * This file is kept for backward compatibility only.
 *
 * @deprecated Use js/universal-components.js instead
 * @version 2.0.0 (DEPRECATED)
 * @author Jagatab.UK
 */

console.warn('⚠️  NavigationManager is DEPRECATED. Please migrate to Universal Components (js/universal-components.js)');

class NavigationManager {
    constructor() {
        // Show deprecation warning
        this.showDeprecationWarning();
        this.navigationConfig = {
            // Standard navigation links - always use these exact URLs
            links: {
                home: 'index.html',
                services: 'index.html#services',
                portfolio: 'index.html#portfolio',
                projects: 'projects.html',
                repositories: 'projects.html', // Alias for projects
                virtualAssistant: 'virtual-assistant.html',
                about: 'index.html#about',
                testimonials: 'index.html#testimonials',
                blog: 'blog/', // Always use directory structure for SEO
                uniblog: 'https://universal-blog-platform.vercel.app/',
                contact: 'index.html#contact'
            },
            
            // Navigation labels
            labels: {
                home: 'Home',
                services: 'Services',
                portfolio: 'Portfolio',
                projects: 'Projects',
                repositories: 'Repositories',
                virtualAssistant: 'Virtual Assistant',
                about: 'About',
                testimonials: 'Testimonials',
                blog: 'Blog',
                contact: 'Contact'
            }
        };
    }

    /**
     * Get the correct URL for a navigation item
     * @param {string} key - Navigation key (e.g., 'blog', 'home')
     * @param {string} basePath - Base path for relative URLs (e.g., '../' for blog pages)
     * @returns {string} - Correct URL
     */
    getUrl(key, basePath = '') {
        const url = this.navigationConfig.links[key];
        if (!url) {
            console.warn(`Navigation key '${key}' not found`);
            return '#';
        }
        
        // Handle absolute URLs (starting with http/https)
        if (url.startsWith('http')) {
            return url;
        }
        
        // Handle anchor links (starting with #)
        if (url.startsWith('#')) {
            return basePath + 'index.html' + url;
        }
        
        // Handle relative URLs
        return basePath + url;
    }

    /**
     * Get the label for a navigation item
     * @param {string} key - Navigation key
     * @returns {string} - Navigation label
     */
    getLabel(key) {
        return this.navigationConfig.labels[key] || key;
    }

    /**
     * Generate navigation HTML for a specific page
     * @param {string} currentPage - Current page identifier
     * @param {string} basePath - Base path for relative URLs
     * @param {Array} navItems - Array of navigation items to include
     * @returns {string} - Navigation HTML
     */
    generateNavigation(currentPage = '', basePath = '', navItems = []) {
        const defaultNavItems = ['home', 'services', 'portfolio', 'repositories', 'virtualAssistant', 'about', 'blog', 'contact'];
        const items = navItems.length > 0 ? navItems : defaultNavItems;
        
        let navHtml = '<ul class="nav-links">\n';
        
        items.forEach(item => {
            const url = this.getUrl(item, basePath);
            const label = this.getLabel(item);
            const activeClass = currentPage === item ? ' class="active"' : '';
            
            navHtml += `    <li><a href="${url}"${activeClass}>${label}</a></li>\n`;
        });
        
        navHtml += '</ul>';
        
        return navHtml;
    }

    /**
     * Update existing navigation links on a page
     * Call this after page load to ensure all links are correct
     */
    updateNavigationLinks(basePath = '') {
        // Update all blog links to use directory structure
        const blogLinks = document.querySelectorAll('a[href="blog.html"], a[href="./blog.html"]');
        blogLinks.forEach(link => {
            link.href = basePath + 'blog/';
        });

        // Update other navigation links if needed
        Object.keys(this.navigationConfig.links).forEach(key => {
            const selector = `a[href*="${key}"]`;
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                const correctUrl = this.getUrl(key, basePath);
                if (link.href !== correctUrl && !link.href.includes('#')) {
                    link.href = correctUrl;
                }
            });
        });
    }

    // Deprecation warning method
    showDeprecationWarning() {
        if (typeof document !== 'undefined') {
            // Create a visual warning banner
            const banner = document.createElement('div');
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #f59e0b;
                color: white;
                padding: 10px;
                text-align: center;
                font-weight: bold;
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
            `;
            banner.innerHTML = `
                ⚠️ DEPRECATED: NavigationManager is deprecated. Please migrate to Universal Components (js/universal-components.js)
                <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: white; color: #f59e0b; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer;">×</button>
            `;

            // Show banner for 10 seconds
            document.body.insertBefore(banner, document.body.firstChild);
            setTimeout(() => {
                if (banner.parentElement) {
                    banner.remove();
                }
            }, 10000);
        }

        console.group('🚨 NavigationManager Deprecation Notice');
        console.warn('This NavigationManager is DEPRECATED and will be removed in a future version.');
        console.info('Please migrate to the new Universal Components system:');
        console.info('• File: js/universal-components.js');
        console.info('• Migration guide: UNIVERSAL-COMPONENTS-MIGRATION.md');
        console.info('• Benefits: Responsive design, accessibility, consistent styling');
        console.groupEnd();
    }

    /**
     * Validate navigation consistency across the site
     * Returns array of issues found
     */
    validateNavigation() {
        const issues = [];
        
        // Check for blog.html references
        const blogHtmlLinks = document.querySelectorAll('a[href*="blog.html"]');
        if (blogHtmlLinks.length > 0) {
            issues.push({
                type: 'blog_html_reference',
                message: `Found ${blogHtmlLinks.length} links still pointing to blog.html instead of blog/`,
                elements: Array.from(blogHtmlLinks)
            });
        }

        // Check for broken navigation links
        const navLinks = document.querySelectorAll('nav a, .nav-links a, .nav-menu a');
        navLinks.forEach(link => {
            if (link.href.includes('undefined') || link.href === window.location.href + '#') {
                issues.push({
                    type: 'broken_link',
                    message: `Broken navigation link found: ${link.href}`,
                    element: link
                });
            }
        });

        return issues;
    }
}

// Create global navigation manager instance
window.NavigationManager = new NavigationManager();

// Auto-fix navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Determine base path based on current location
    const path = window.location.pathname;
    let basePath = '';
    
    if (path.includes('/blog/')) {
        basePath = '../';
    } else if (path.includes('/services/')) {
        basePath = '../';
    } else if (path.includes('/dashboard/')) {
        basePath = '../';
    }
    
    // Update navigation links
    window.NavigationManager.updateNavigationLinks(basePath);
    
    // Log any validation issues in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const issues = window.NavigationManager.validateNavigation();
        if (issues.length > 0) {
            console.warn('Navigation issues found:', issues);
        }
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}
