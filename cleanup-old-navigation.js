/**
 * Cleanup Script for Old Navigation Code
 * 
 * This script helps identify and clean up redundant navigation code
 * after migrating to Universal Components system.
 * 
 * Usage: Run this in browser console on each page to identify cleanup opportunities
 */

class NavigationCleanup {
    constructor() {
        this.issues = [];
        this.suggestions = [];
        this.redundantElements = [];
    }

    // Main cleanup analysis
    analyze() {
        console.group('🧹 Navigation Cleanup Analysis');
        
        this.checkForOldNavigation();
        this.checkForRedundantCSS();
        this.checkForOldJavaScript();
        this.checkForDuplicateElements();
        this.generateReport();
        
        console.groupEnd();
        return {
            issues: this.issues,
            suggestions: this.suggestions,
            redundantElements: this.redundantElements
        };
    }

    // Check for old navigation HTML elements
    checkForOldNavigation() {
        console.log('🔍 Checking for old navigation elements...');
        
        // Check for old header classes
        const oldHeaders = document.querySelectorAll('.header:not(.universal-header), header:not(.universal-header)');
        if (oldHeaders.length > 0) {
            this.issues.push({
                type: 'old_header',
                count: oldHeaders.length,
                elements: Array.from(oldHeaders),
                message: `Found ${oldHeaders.length} old header element(s) that can be removed`
            });
        }

        // Check for old navigation menus
        const oldNavMenus = document.querySelectorAll('.nav-menu:not(.universal-nav-menu), .nav-links:not(.universal-nav-links)');
        if (oldNavMenus.length > 0) {
            this.issues.push({
                type: 'old_nav_menu',
                count: oldNavMenus.length,
                elements: Array.from(oldNavMenus),
                message: `Found ${oldNavMenus.length} old navigation menu(s) that can be removed`
            });
        }

        // Check for old mobile toggles
        const oldMobileToggles = document.querySelectorAll('.mobile-menu-toggle:not(#universalMobileToggle)');
        if (oldMobileToggles.length > 0) {
            this.issues.push({
                type: 'old_mobile_toggle',
                count: oldMobileToggles.length,
                elements: Array.from(oldMobileToggles),
                message: `Found ${oldMobileToggles.length} old mobile toggle(s) that can be removed`
            });
        }

        // Check for old footers
        const oldFooters = document.querySelectorAll('.footer:not(.universal-footer), footer:not(.universal-footer)');
        if (oldFooters.length > 0) {
            this.issues.push({
                type: 'old_footer',
                count: oldFooters.length,
                elements: Array.from(oldFooters),
                message: `Found ${oldFooters.length} old footer element(s) that can be removed`
            });
        }
    }

    // Check for redundant CSS
    checkForRedundantCSS() {
        console.log('🎨 Checking for redundant CSS...');
        
        const styleSheets = Array.from(document.styleSheets);
        const redundantSelectors = [
            '.header', '.nav', '.nav-menu', '.nav-link', '.mobile-menu-toggle',
            '.footer', '.footer-content', '.footer-section'
        ];

        styleSheets.forEach((sheet, index) => {
            try {
                const rules = Array.from(sheet.cssRules || sheet.rules || []);
                rules.forEach(rule => {
                    if (rule.selectorText) {
                        redundantSelectors.forEach(selector => {
                            if (rule.selectorText.includes(selector) && 
                                !rule.selectorText.includes('universal')) {
                                this.suggestions.push({
                                    type: 'redundant_css',
                                    selector: rule.selectorText,
                                    stylesheet: index,
                                    message: `CSS rule "${rule.selectorText}" may be redundant`
                                });
                            }
                        });
                    }
                });
            } catch (e) {
                // Cross-origin stylesheets can't be accessed
                console.warn(`Cannot access stylesheet ${index} (likely cross-origin)`);
            }
        });
    }

    // Check for old JavaScript functions
    checkForOldJavaScript() {
        console.log('⚙️ Checking for old JavaScript functions...');
        
        // Check for old navigation functions
        const oldFunctions = [
            'initializeNavigation',
            'NavigationManager',
            'updateNavigationLinks',
            'validateNavigation'
        ];

        oldFunctions.forEach(funcName => {
            if (window[funcName] || this.findFunctionInScripts(funcName)) {
                this.suggestions.push({
                    type: 'old_javascript',
                    function: funcName,
                    message: `Function "${funcName}" may be redundant and can be removed`
                });
            }
        });

        // Check for navigation.js script
        const navScript = document.querySelector('script[src*="navigation.js"]');
        if (navScript) {
            this.issues.push({
                type: 'old_script',
                element: navScript,
                message: 'navigation.js script is still included and can be removed'
            });
        }
    }

    // Helper function to find functions in script tags
    findFunctionInScripts(funcName) {
        const scripts = document.querySelectorAll('script:not([src])');
        return Array.from(scripts).some(script => 
            script.textContent.includes(`function ${funcName}`) ||
            script.textContent.includes(`${funcName} =`) ||
            script.textContent.includes(`${funcName}:`)
        );
    }

    // Check for duplicate elements
    checkForDuplicateElements() {
        console.log('🔄 Checking for duplicate elements...');
        
        // Check for multiple headers
        const headers = document.querySelectorAll('header, .header');
        if (headers.length > 1) {
            this.issues.push({
                type: 'duplicate_header',
                count: headers.length,
                elements: Array.from(headers),
                message: `Found ${headers.length} header elements - should only have one universal header`
            });
        }

        // Check for multiple footers
        const footers = document.querySelectorAll('footer, .footer');
        if (footers.length > 1) {
            this.issues.push({
                type: 'duplicate_footer',
                count: footers.length,
                elements: Array.from(footers),
                message: `Found ${footers.length} footer elements - should only have one universal footer`
            });
        }
    }

    // Generate cleanup report
    generateReport() {
        console.log('📊 Generating cleanup report...');
        
        if (this.issues.length === 0 && this.suggestions.length === 0) {
            console.log('✅ No cleanup issues found! Page is clean.');
            return;
        }

        console.group('🚨 Issues Found');
        this.issues.forEach(issue => {
            console.warn(`${issue.type}: ${issue.message}`);
            if (issue.elements) {
                console.log('Elements:', issue.elements);
            }
        });
        console.groupEnd();

        if (this.suggestions.length > 0) {
            console.group('💡 Suggestions');
            this.suggestions.forEach(suggestion => {
                console.info(`${suggestion.type}: ${suggestion.message}`);
            });
            console.groupEnd();
        }

        // Provide cleanup instructions
        this.generateCleanupInstructions();
    }

    // Generate step-by-step cleanup instructions
    generateCleanupInstructions() {
        console.group('🛠️ Cleanup Instructions');
        
        const instructions = [];
        
        if (this.issues.some(i => i.type === 'old_header')) {
            instructions.push('1. Remove old <header> elements and related CSS');
        }
        
        if (this.issues.some(i => i.type === 'old_footer')) {
            instructions.push('2. Remove old <footer> elements and related CSS');
        }
        
        if (this.issues.some(i => i.type === 'old_script')) {
            instructions.push('3. Remove navigation.js script reference');
        }
        
        if (this.suggestions.some(s => s.type === 'redundant_css')) {
            instructions.push('4. Review and remove redundant CSS rules');
        }
        
        if (this.suggestions.some(s => s.type === 'old_javascript')) {
            instructions.push('5. Remove old navigation JavaScript functions');
        }

        instructions.push('6. Test page functionality after cleanup');
        instructions.push('7. Verify responsive design works correctly');
        
        instructions.forEach(instruction => console.log(instruction));
        console.groupEnd();
    }

    // Auto-cleanup function (use with caution!)
    autoCleanup(confirm = false) {
        if (!confirm) {
            console.warn('⚠️ Auto-cleanup disabled. Set confirm=true to enable.');
            console.info('Usage: cleanup.autoCleanup(true)');
            return;
        }

        console.group('🤖 Auto-cleanup started');
        
        let cleanedCount = 0;

        // Remove old headers (except universal)
        const oldHeaders = document.querySelectorAll('.header:not(.universal-header), header:not(.universal-header)');
        oldHeaders.forEach(header => {
            header.remove();
            cleanedCount++;
        });

        // Remove old footers (except universal)
        const oldFooters = document.querySelectorAll('.footer:not(.universal-footer), footer:not(.universal-footer)');
        oldFooters.forEach(footer => {
            footer.remove();
            cleanedCount++;
        });

        // Remove navigation.js script
        const navScript = document.querySelector('script[src*="navigation.js"]');
        if (navScript) {
            navScript.remove();
            cleanedCount++;
        }

        console.log(`✅ Auto-cleanup completed. Removed ${cleanedCount} elements.`);
        console.warn('⚠️ Please test the page thoroughly and save changes manually.');
        console.groupEnd();

        return cleanedCount;
    }
}

// Initialize and run cleanup analysis
const cleanup = new NavigationCleanup();

// Export for global use
window.NavigationCleanup = NavigationCleanup;
window.cleanup = cleanup;

// Auto-run analysis
console.log('🧹 Navigation Cleanup Tool Loaded');
console.log('Usage:');
console.log('  cleanup.analyze()           - Analyze current page');
console.log('  cleanup.autoCleanup(true)   - Auto-remove redundant elements');
console.log('');

// Run analysis automatically
cleanup.analyze();
