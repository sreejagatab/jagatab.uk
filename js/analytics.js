// ========================================
// JAGATABUK WEBSITE - ANALYTICS & TRACKING
// ========================================

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 Measurement ID

// Initialize Google Analytics
function initializeGoogleAnalytics() {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Make gtag globally available
    window.gtag = gtag;
}

// Track Service Page Views
function trackServicePageView(serviceName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: `Service: ${serviceName}`,
            page_location: window.location.href,
            custom_parameter_1: 'service_page',
            service_name: serviceName
        });
    }
}

// Track Contact Form Interactions
function trackContactFormEvent(eventType, formLocation = 'unknown') {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventType, {
            event_category: 'Contact',
            event_label: formLocation,
            custom_parameter_1: 'lead_generation'
        });
    }
}

// Track Phone Number Clicks
function trackPhoneClick(phoneNumber) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_click', {
            event_category: 'Contact',
            event_label: phoneNumber,
            custom_parameter_1: 'phone_lead'
        });
    }
}

// Track Email Clicks
function trackEmailClick(emailAddress) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'email_click', {
            event_category: 'Contact',
            event_label: emailAddress,
            custom_parameter_1: 'email_lead'
        });
    }
}

// Track Service Interest (Learn More clicks)
function trackServiceInterest(serviceName, sourceLocation = 'homepage') {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'service_interest', {
            event_category: 'Services',
            event_label: serviceName,
            source_location: sourceLocation,
            custom_parameter_1: 'service_engagement'
        });
    }
}

// Track Blog Article Engagement
function trackBlogEngagement(articleTitle, engagementType = 'view') {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'blog_engagement', {
            event_category: 'Content',
            event_label: articleTitle,
            engagement_type: engagementType,
            custom_parameter_1: 'content_engagement'
        });
    }
}

// Track Scroll Depth
function trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 90];
    let trackedMilestones = [];
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.includes(milestone)) {
                    trackedMilestones.push(milestone);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            event_category: 'Engagement',
                            event_label: `${milestone}%`,
                            value: milestone,
                            custom_parameter_1: 'page_engagement'
                        });
                    }
                }
            });
        }
    });
}

// Track Time on Page
function trackTimeOnPage() {
    const startTime = Date.now();
    const pageName = document.title;
    
    // Track time milestones
    const timeMilestones = [30, 60, 120, 300]; // seconds
    let trackedTimes = [];
    
    timeMilestones.forEach(seconds => {
        setTimeout(() => {
            if (!trackedTimes.includes(seconds)) {
                trackedTimes.push(seconds);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'time_on_page', {
                        event_category: 'Engagement',
                        event_label: `${seconds}s`,
                        value: seconds,
                        page_name: pageName,
                        custom_parameter_1: 'time_engagement'
                    });
                }
            }
        }, seconds * 1000);
    });
    
    // Track total time when user leaves
    window.addEventListener('beforeunload', function() {
        const totalTime = Math.round((Date.now() - startTime) / 1000);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_exit', {
                event_category: 'Engagement',
                event_label: 'total_time',
                value: totalTime,
                page_name: pageName,
                custom_parameter_1: 'session_data'
            });
        }
    });
}

// Track CTA Button Clicks
function trackCTAClick(ctaText, ctaLocation, targetService = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            event_category: 'Conversion',
            event_label: ctaText,
            cta_location: ctaLocation,
            target_service: targetService,
            custom_parameter_1: 'conversion_action'
        });
    }
}

// Track External Link Clicks
function trackExternalLink(linkUrl, linkText) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'external_link_click', {
            event_category: 'Outbound',
            event_label: linkUrl,
            link_text: linkText,
            custom_parameter_1: 'external_engagement'
        });
    }
}

// Track Search Console Integration
function trackSearchConsoleData() {
    // This would integrate with Google Search Console API
    // For now, we'll track internal search if implemented
    const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'internal_search', {
                        event_category: 'Search',
                        event_label: this.value.trim(),
                        custom_parameter_1: 'site_search'
                    });
                }
            }
        });
    });
}

// Enhanced Contact Form Tracking
function setupContactFormTracking() {
    const contactForms = document.querySelectorAll('form[id*="contact"], .contact-form');
    
    contactForms.forEach(form => {
        const formLocation = form.closest('.service-page') ? 'service_page' : 
                           form.closest('.homepage') ? 'homepage' : 'unknown';
        
        // Track form start (first input focus)
        const inputs = form.querySelectorAll('input, textarea, select');
        let formStarted = false;
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (!formStarted) {
                    formStarted = true;
                    trackContactFormEvent('form_start', formLocation);
                }
            });
        });
        
        // Track form submission
        form.addEventListener('submit', function(e) {
            trackContactFormEvent('form_submit', formLocation);
            
            // Track which service was inquired about
            const serviceInput = form.querySelector('input[name*="service"], select[name*="service"]');
            if (serviceInput && serviceInput.value) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'service_inquiry', {
                        event_category: 'Lead',
                        event_label: serviceInput.value,
                        form_location: formLocation,
                        custom_parameter_1: 'qualified_lead'
                    });
                }
            }
        });
    });
}

// Setup Phone and Email Tracking
function setupContactTracking() {
    // Track phone number clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.href.replace('tel:', '');
            trackPhoneClick(phoneNumber);
        });
    });
    
    // Track email clicks
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            const emailAddress = this.href.replace('mailto:', '');
            trackEmailClick(emailAddress);
        });
    });
}

// Setup Service Interest Tracking
function setupServiceTracking() {
    // Track "Learn More" button clicks
    const learnMoreButtons = document.querySelectorAll('a[href*="/services/"]');
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.href.split('/services/')[1].replace('.html', '').replace(/-/g, ' ');
            const sourceLocation = this.closest('.service-card') ? 'homepage_service_card' : 'other';
            trackServiceInterest(serviceName, sourceLocation);
        });
    });
    
    // Track service page CTA clicks
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ctaText = this.textContent.trim();
            const ctaLocation = this.closest('.sidebar') ? 'sidebar' : 'main_content';
            const servicePage = document.querySelector('h1') ? document.querySelector('h1').textContent : '';
            trackCTAClick(ctaText, ctaLocation, servicePage);
        });
    });
}

// Initialize all tracking
function initializeTracking() {
    // Initialize Google Analytics
    initializeGoogleAnalytics();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupAllTracking();
        });
    } else {
        setupAllTracking();
    }
}

function setupAllTracking() {
    // Setup various tracking functions
    trackScrollDepth();
    trackTimeOnPage();
    setupContactFormTracking();
    setupContactTracking();
    setupServiceTracking();
    trackSearchConsoleData();
    
    // Track page type
    const pageType = window.location.pathname.includes('/services/') ? 'service_page' :
                    window.location.pathname.includes('/blog/') ? 'blog_page' :
                    window.location.pathname === '/' ? 'homepage' : 'other';
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_type_view', {
            event_category: 'Navigation',
            event_label: pageType,
            custom_parameter_1: 'page_classification'
        });
    }
    
    // Track service page specifically
    if (pageType === 'service_page') {
        const serviceName = window.location.pathname.split('/services/')[1].replace('.html', '').replace(/-/g, ' ');
        trackServicePageView(serviceName);
    }
    
    // Track blog page specifically
    if (pageType === 'blog_page') {
        const articleTitle = document.querySelector('h1') ? document.querySelector('h1').textContent : 'Unknown Article';
        trackBlogEngagement(articleTitle, 'view');
    }
}

// Initialize tracking when script loads
initializeTracking();

// Export functions for manual tracking
window.JagatabukAnalytics = {
    trackServiceInterest,
    trackContactFormEvent,
    trackPhoneClick,
    trackEmailClick,
    trackCTAClick,
    trackBlogEngagement,
    trackExternalLink
};
