/**
 * Universal Navigation and Footer Components for Jagatab.UK
 * Responsive, accessible, and consistent across all pages
 *
 * Performance optimized for Core Web Vitals:
 * - Lazy loading of non-critical features
 * - Efficient DOM manipulation
 * - Minimal layout shifts
 * - Fast interaction responses
 *
 * @version 1.1.0
 * @author Jagatab.UK
 */

class UniversalComponents {
    constructor() {
        // Performance: Cache DOM queries and calculations
        this.cache = new Map();
        this.currentPage = this.getCurrentPage();
        this.basePath = this.getBasePath();

        // Performance: Use requestAnimationFrame for smooth initialization
        requestAnimationFrame(() => this.init());
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('/blog/')) return 'blog';
        if (path.includes('/projects')) return 'projects';
        if (path.includes('/virtual-assistant')) return 'virtual-assistant';
        return 'home';
    }

    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/blog/')) return '../';
        return '';
    }

    init() {
        // Performance: Batch DOM operations to minimize layout thrashing
        this.batchDOMOperations();
    }

    batchDOMOperations() {
        // Use DocumentFragment for efficient DOM manipulation
        const fragment = document.createDocumentFragment();

        // Inject CSS first to prevent FOUC (Flash of Unstyled Content)
        this.injectCSS();

        // Create components in optimal order
        this.createNavigation();
        this.createFooter();

        // Initialize event listeners after DOM is ready
        this.initializeEventListeners();

        // Performance: Preload critical resources
        this.preloadCriticalResources();
    }

    injectCSS() {
        // Performance: Check if CSS is already injected to avoid duplicates
        if (document.querySelector('#universal-components-styles')) {
            return;
        }

        const css = `
        /* Universal Navigation Styles */
        .universal-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transition: all 0.3s ease;
        }

        .universal-header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 30px rgba(0, 0, 0, 0.15);
        }

        .universal-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .universal-logo {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e40af;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .universal-logo:hover {
            color: #3b82f6;
            transform: scale(1.05);
        }

        .universal-nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
            margin: 0;
            padding: 0;
            align-items: center;
        }

        .universal-nav-link {
            color: #374151;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            transition: all 0.3s ease;
            position: relative;
        }

        .universal-nav-link:hover {
            color: #1e40af;
            background: rgba(59, 130, 246, 0.1);
        }

        .universal-nav-link.active {
            color: #1e40af;
            background: rgba(59, 130, 246, 0.15);
            font-weight: 600;
        }

        .universal-nav-link.external::after {
            content: '↗';
            font-size: 0.8rem;
            margin-left: 0.25rem;
            opacity: 0.7;
        }

        .universal-mobile-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #1e40af;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .universal-mobile-toggle:hover {
            background: rgba(59, 130, 246, 0.1);
        }

        /* Mobile Navigation */
        @media (max-width: 768px) {
            .universal-nav {
                padding: 1rem;
            }

            .universal-mobile-toggle {
                display: block;
            }

            .universal-nav-menu {
                position: fixed;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                flex-direction: column;
                padding: 2rem;
                gap: 1rem;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }

            .universal-nav-menu.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }

            .universal-nav-link {
                padding: 1rem;
                text-align: center;
                border-radius: 8px;
                min-height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        /* Universal Footer Styles */
        .universal-footer {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 3rem 0 1rem;
            margin-top: 4rem;
        }

        .universal-footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }

        .universal-footer-section h3 {
            margin-bottom: 1rem;
            font-size: 1.25rem;
            font-weight: 600;
        }

        .universal-footer-section p {
            line-height: 1.6;
            opacity: 1;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.95);
        }

        .universal-footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .universal-footer-links li {
            margin-bottom: 0.5rem;
        }

        .universal-footer-links a {
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            opacity: 1;
            transition: all 0.3s ease;
        }

        .universal-footer-links a:hover {
            opacity: 1;
            transform: translateX(5px);
        }

        .universal-social-links {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .universal-social-link {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .universal-social-link:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-3px);
        }

        .universal-footer-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            margin-top: 2rem;
            padding-top: 1rem;
            text-align: center;
            opacity: 1;
            color: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 768px) {
            .universal-footer-content {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .universal-social-links {
                justify-content: center;
            }
        }
        `;

        // Performance: Create style element with ID for tracking
        const style = document.createElement('style');
        style.id = 'universal-components-styles';
        style.textContent = css;

        // Performance: Insert CSS as early as possible to prevent FOUC
        const firstStyleOrLink = document.head.querySelector('style, link[rel="stylesheet"]');
        if (firstStyleOrLink) {
            document.head.insertBefore(style, firstStyleOrLink);
        } else {
            document.head.appendChild(style);
        }
    }

    createNavigation() {
        const navigation = {
            home: { url: `${this.basePath}index.html`, label: 'Home', section: '#home' },
            services: { url: `${this.basePath}index.html#services`, label: 'Services', section: '#services' },
            portfolio: { url: `${this.basePath}index.html#portfolio`, label: 'Portfolio', section: '#portfolio' },
            projects: { url: `${this.basePath}projects.html`, label: 'Repositories' },
            virtualAssistant: { url: `${this.basePath}virtual-assistant.html`, label: 'V.Assistant' },
            about: { url: `${this.basePath}index.html#about`, label: 'About', section: '#about' },
            // testimonials: { url: `${this.basePath}index.html#testimonials`, label: 'Testimonials', section: '#testimonials' },
            blog: { url: `${this.basePath}blog/`, label: 'Blog' },
            uniblog: { url: 'https://universal-blog-platform.vercel.app/', label: 'UniBlog' },
            contact: { url: `${this.basePath}index.html#contact`, label: 'Contact', section: '#contact' }
        };

        // Debug: Log navigation items in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🔍 Navigation items:', Object.keys(navigation));
            console.log('🔗 UniBlog URL:', navigation.uniblog.url);
        }

        const navHTML = `
        <header class="universal-header" id="universalHeader">
            <nav class="universal-nav">
                <a href="${this.basePath}index.html" class="universal-logo" data-scroll-to-top="true">Jagatab.UK</a>
                <ul class="universal-nav-menu" id="universalNavMenu">
                    ${Object.entries(navigation).map(([key, item]) => `
                        <li>
                            <a href="${item.url}" 
                               class="universal-nav-link ${this.isActive(key) ? 'active' : ''} ${item.external ? 'external' : ''}"
                               ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}
                               data-section="${item.section || ''}"
                               aria-label="${item.label}">
                                ${item.label}${item.external ? ' <i class="fas fa-external-link-alt" style="font-size: 0.8em; margin-left: 0.3em;"></i>' : ''}
                            </a>
                        </li>
                    `).join('')}
                </ul>
                <button class="universal-mobile-toggle" id="universalMobileToggle" aria-label="Toggle navigation menu">
                    <i class="fas fa-bars"></i>
                </button>
            </nav>
        </header>
        `;

        // Debug: Log navigation HTML in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🏗️ Navigation HTML generated');
            // Check if UniBlog is in the HTML
            if (navHTML.includes('UniBlog')) {
                console.log('✅ UniBlog found in navigation HTML');
            } else {
                console.warn('❌ UniBlog NOT found in navigation HTML');
            }
        }

        // Insert navigation at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', navHTML);

        // Performance: Use CSS custom property for dynamic header height
        const headerHeight = '80px';
        document.documentElement.style.setProperty('--header-height', headerHeight);
        document.body.style.paddingTop = headerHeight;
    }

    preloadCriticalResources() {
        // Performance: Preload critical fonts and icons
        const preloadLinks = [
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap', as: 'style' },
            { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', as: 'style' }
        ];

        preloadLinks.forEach(link => {
            if (!document.querySelector(`link[href="${link.href}"]`)) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.href = link.href;
                preloadLink.as = link.as;
                preloadLink.crossOrigin = 'anonymous';
                document.head.appendChild(preloadLink);
            }
        });
    }

    createFooter() {
        const footerHTML = `
        <footer class="universal-footer">
            <div class="universal-footer-content">
                <div class="universal-footer-section">
                    <h3>Jagatab.UK</h3>
                    <p>Transforming businesses across Cambridgeshire with AI automation and Python development solutions. Based in Wisbech, serving the UK and international clients.</p>
                    <div class="universal-social-links">
                        <a href="https://www.linkedin.com/in/sreejagatab/" class="universal-social-link" title="LinkedIn" target="_blank" rel="noopener">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://github.com/sreejagatab" class="universal-social-link" title="GitHub" target="_blank" rel="noopener">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="https://x.com/SavingBargain" class="universal-social-link" title="X (Twitter)" target="_blank" rel="noopener">
                            <i class="fab fa-x-twitter"></i>
                        </a>
                        <a href="https://www.facebook.com/Jagatabandsonsukltd/" class="universal-social-link" title="Facebook" target="_blank" rel="noopener">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/gotvan_savingbargainsltd/" class="universal-social-link" title="Instagram" target="_blank" rel="noopener">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>

                <div class="universal-footer-section">
                    <h3>Services</h3>
                    <ul class="universal-footer-links">
                        <li><a href="${this.basePath}index.html#services">AI Automation</a></li>
                        <li><a href="${this.basePath}index.html#services">Python Development</a></li>
                        <li><a href="${this.basePath}virtual-assistant.html">Virtual Assistant</a></li>
                        <li><a href="${this.basePath}index.html#services">Business Process Automation</a></li>
                        <li><a href="${this.basePath}index.html#services">Data Analysis & Visualization</a></li>
                    </ul>
                </div>

                <div class="universal-footer-section">
                    <h3>Resources</h3>
                    <ul class="universal-footer-links">
                        <li><a href="${this.basePath}blog/">Blog</a></li>
                        <li><a href="${this.basePath}projects.html">Portfolio</a></li>
                        <li><a href="https://universal-blog-platform.vercel.app/" target="_blank" rel="noopener">UniBlog Platform</a></li>
                        <li><a href="${this.basePath}index.html#testimonials">Case Studies</a></li>
                        <li><a href="${this.basePath}index.html#about">About</a></li>
                    </ul>
                </div>

                <div class="universal-footer-section">
                    <h3>Contact</h3>
                    <ul class="universal-footer-links">
                        <li><a href="tel:+447864880790">📞 +44 7864 880790</a></li>
                        <li><a href="mailto:sreejagatab@yahoo.com">✉️ sreejagatab@yahoo.com</a></li>
                        <li>📍 Wisbech, Cambridgeshire, UK</li>
                        <li><a href="${this.basePath}index.html#contact">Get Free Consultation</a></li>
                    </ul>
                </div>
            </div>

            <div class="universal-footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Jagatab.UK - AI Automation & Python Development. All rights reserved. |
                   <a href="${this.basePath}privacy-policy.html" style="color: rgba(255, 255, 255, 0.9); text-decoration: underline;">Privacy Policy</a> |
                   <a href="${this.basePath}terms-of-service.html" style="color: rgba(255, 255, 255, 0.9); text-decoration: underline;">Terms of Service</a>
                </p>
            </div>
        </footer>
        `;

        // Insert footer at the end of body
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    isActive(navKey) {
        const activeMap = {
            'home': this.currentPage === 'home',
            'projects': this.currentPage === 'projects',
            'virtualAssistant': this.currentPage === 'virtual-assistant',
            'blog': this.currentPage === 'blog'
        };
        return activeMap[navKey] || false;
    }

    initializeEventListeners() {
        const header = document.getElementById('universalHeader');
        const mobileToggle = document.getElementById('universalMobileToggle');
        const navMenu = document.getElementById('universalNavMenu');
        const navLinks = document.querySelectorAll('.universal-nav-link');

        // Performance: Throttle scroll events for better performance
        let scrollTimeout;
        const handleScroll = () => {
            if (scrollTimeout) return;

            scrollTimeout = requestAnimationFrame(() => {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                scrollTimeout = null;
            });
        };

        // Performance: Use passive event listener for scroll
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Mobile menu toggle
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                mobileToggle.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle logo click for scroll to top
        const logo = document.querySelector('.universal-logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                const isHomePage = window.location.pathname === '/' ||
                                 window.location.pathname.endsWith('/index.html') ||
                                 window.location.pathname.endsWith('/');

                if (isHomePage) {
                    e.preventDefault();
                    // Scroll to top of page smoothly
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                // If not on homepage, let the default link behavior work (navigate to homepage)
            });
        }

        // Smooth scrolling for internal links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const section = link.getAttribute('data-section');
                const isExternal = link.classList.contains('external');
                const isCurrentPage = link.href.includes(window.location.pathname.split('/').pop() || 'index.html');

                // Close mobile menu
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileToggle.setAttribute('aria-expanded', 'false');

                // Handle smooth scrolling for same-page sections
                if (section && isCurrentPage && !isExternal) {
                    e.preventDefault();
                    const targetElement = document.querySelector(section);
                    if (targetElement) {
                        // Performance: Cache header height calculation
                        const headerHeight = this.cache.get('headerHeight') || (() => {
                            const height = header.offsetHeight;
                            this.cache.set('headerHeight', height);
                            return height;
                        })();

                        const targetPosition = targetElement.offsetTop - headerHeight - 20;

                        // Performance: Use requestAnimationFrame for smooth scrolling
                        requestAnimationFrame(() => {
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        });
                    }
                }
            });
        });

        // ESC key closes mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Analytics tracking for navigation
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'navigation_click', {
                        'event_category': 'Navigation',
                        'event_label': link.textContent.trim()
                    });
                }
            });
        });
    }
}

// Performance: Optimize initialization timing
function initializeUniversalComponents() {
    // Performance: Check if already initialized
    if (window.universalComponentsInitialized) {
        return;
    }

    // Performance: Mark as initialized to prevent duplicate initialization
    window.universalComponentsInitialized = true;

    // Performance: Use performance API for monitoring
    if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark('universal-components-start');
    }

    const components = new UniversalComponents();

    // Performance: Log initialization time in development
    if (typeof performance !== 'undefined' && performance.measure) {
        performance.mark('universal-components-end');
        performance.measure('universal-components-init', 'universal-components-start', 'universal-components-end');

        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const measure = performance.getEntriesByName('universal-components-init')[0];
            console.log(`🚀 Universal Components initialized in ${measure.duration.toFixed(2)}ms`);
        }
    }

    return components;
}

// Performance: Use multiple initialization strategies for optimal loading
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', initializeUniversalComponents);
} else if (document.readyState === 'interactive') {
    // DOM is loaded but resources might still be loading
    requestAnimationFrame(initializeUniversalComponents);
} else {
    // DOM and resources are fully loaded
    initializeUniversalComponents();
}

// Export for manual initialization if needed
window.UniversalComponents = UniversalComponents;
window.initializeUniversalComponents = initializeUniversalComponents;

// Performance: Add resize handler with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Clear cached values that depend on viewport size
        if (window.universalComponentsInstance) {
            window.universalComponentsInstance.cache.delete('headerHeight');
        }
    }, 250);
}, { passive: true });
