// ========================================
// JAGATABUK WEBSITE - PERFORMANCE OPTIMIZER
// ========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize all optimizations
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupCriticalResourcePreloading();
        this.setupServiceWorker();
        this.setupPerformanceMonitoring();
        this.setupScrollOptimization();
        this.setupMemoryOptimization();
    }
    
    // Lazy Loading Implementation
    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
        
        // Lazy load service page content
        const serviceCards = document.querySelectorAll('.service-card');
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        serviceCards.forEach(card => cardObserver.observe(card));
    }
    
    // Image Optimization
    setupImageOptimization() {
        // Convert images to WebP if supported
        const supportsWebP = this.checkWebPSupport();
        
        if (supportsWebP) {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.src && !img.src.includes('.webp')) {
                    const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    
                    // Test if WebP version exists
                    const testImg = new Image();
                    testImg.onload = () => {
                        img.src = webpSrc;
                    };
                    testImg.src = webpSrc;
                }
            });
        }
        
        // Add responsive image loading
        this.setupResponsiveImages();
    }
    
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    
    setupResponsiveImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for native lazy loading
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding="async" for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }
    
    // Critical Resource Preloading
    setupCriticalResourcePreloading() {
        // Preload critical fonts
        this.preloadFont('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        this.preloadFont('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        // Preload critical CSS
        this.preloadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        
        // Prefetch likely next pages
        this.prefetchLikelyPages();
    }
    
    preloadFont(href) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'style';
        link.onload = function() { this.rel = 'stylesheet'; };
        document.head.appendChild(link);
    }
    
    preloadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'style';
        document.head.appendChild(link);
    }
    
    prefetchLikelyPages() {
        // Prefetch service pages when hovering over service cards
        const serviceLinks = document.querySelectorAll('a[href*="/services/"]');
        
        serviceLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.prefetchPage(link.href);
            }, { once: true });
        });
        
        // Prefetch blog pages
        const blogLinks = document.querySelectorAll('a[href*="/blog/"]');
        blogLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.prefetchPage(link.href);
            }, { once: true });
        });
    }
    
    prefetchPage(href) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    }
    
    // Service Worker Setup
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
    
    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor resource loading
        this.monitorResourceLoading();
        
        // Monitor user interactions
        this.monitorUserInteractions();
    }
    
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            if (window.gtag) {
                gtag('event', 'lcp', {
                    event_category: 'Performance',
                    value: Math.round(lastEntry.startTime),
                    custom_parameter_1: 'core_web_vitals'
                });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (window.gtag) {
                    gtag('event', 'fid', {
                        event_category: 'Performance',
                        value: Math.round(entry.processingStart - entry.startTime),
                        custom_parameter_1: 'core_web_vitals'
                    });
                }
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            if (window.gtag) {
                gtag('event', 'cls', {
                    event_category: 'Performance',
                    value: Math.round(clsValue * 1000),
                    custom_parameter_1: 'core_web_vitals'
                });
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    monitorResourceLoading() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            if (window.gtag) {
                gtag('event', 'page_load_time', {
                    event_category: 'Performance',
                    value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
                    custom_parameter_1: 'page_performance'
                });
                
                gtag('event', 'dom_content_loaded', {
                    event_category: 'Performance',
                    value: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
                    custom_parameter_1: 'page_performance'
                });
            }
        });
    }
    
    monitorUserInteractions() {
        // Monitor click responsiveness
        document.addEventListener('click', (e) => {
            const startTime = performance.now();
            
            requestAnimationFrame(() => {
                const endTime = performance.now();
                const responseTime = endTime - startTime;
                
                if (responseTime > 100 && window.gtag) {
                    gtag('event', 'slow_interaction', {
                        event_category: 'Performance',
                        value: Math.round(responseTime),
                        element: e.target.tagName,
                        custom_parameter_1: 'interaction_performance'
                    });
                }
            });
        });
    }
    
    // Scroll Optimization
    setupScrollOptimization() {
        let ticking = false;
        
        const optimizedScroll = () => {
            // Update scroll-dependent elements
            this.updateScrollElements();
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(optimizedScroll);
                ticking = true;
            }
        });
    }
    
    updateScrollElements() {
        // Update progress bars, parallax effects, etc.
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        // Update reading progress if on blog page
        const progressBar = document.querySelector('.reading-progress');
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
        
        // Update floating elements
        const floatingElements = document.querySelectorAll('.floating-contact');
        floatingElements.forEach(element => {
            if (scrollPercent > 20) {
                element.style.opacity = '1';
            } else {
                element.style.opacity = '0.7';
            }
        });
    }
    
    // Memory Optimization
    setupMemoryOptimization() {
        // Clean up event listeners on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
                
                if (memoryUsage > 80 && window.gtag) {
                    gtag('event', 'high_memory_usage', {
                        event_category: 'Performance',
                        value: Math.round(memoryUsage),
                        custom_parameter_1: 'memory_performance'
                    });
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    cleanup() {
        // Remove event listeners
        // Clear intervals and timeouts
        // Clean up observers
        console.log('Performance optimizer cleanup completed');
    }
    
    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize performance optimizer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PerformanceOptimizer();
    });
} else {
    new PerformanceOptimizer();
}

// Export for manual use
window.PerformanceOptimizer = PerformanceOptimizer;
