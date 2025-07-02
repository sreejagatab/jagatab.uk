/**
 * Jagatab Blog Dashboard - Main JavaScript
 * Handles navigation, UI interactions, and core functionality
 */

class BlogDashboard {
    constructor() {
        this.currentSection = 'converter';
        this.queue = [];
        this.blogPosts = [];
        this.templates = [];
        this.analytics = {
            totalViews: 0,
            totalPosts: 0,
            githubPosts: 0,
            avgSeoScore: 0
        };
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadBlogPosts();
        this.loadTemplates();
        this.loadAnalytics();
        this.setupEventListeners();
        this.showSection('converter');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
                this.setActiveNav(item);
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Load section-specific data
        this.loadSectionData(sectionId);
    }

    setActiveNav(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'posts':
                this.renderBlogPosts();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'templates':
                this.renderTemplates();
                break;
            case 'queue':
                this.renderQueue();
                break;
            case 'seo':
                this.loadSEOPosts();
                break;
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-menu-toggle')) {
                this.toggleMobileMenu();
            }
        });

        // Search functionality
        const postsSearch = document.getElementById('posts-search');
        if (postsSearch) {
            postsSearch.addEventListener('input', (e) => {
                this.filterPosts(e.target.value);
            });
        }

        // Filter functionality
        const postsFilter = document.getElementById('posts-filter');
        if (postsFilter) {
            postsFilter.addEventListener('change', (e) => {
                this.filterPostsByType(e.target.value);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.showSection('converter');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showSection('queue');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showSection('posts');
                        break;
                }
            }
        });
    }

    async loadBlogPosts() {
        try {
            // Try to load existing blog posts from the blog directory
            const response = await fetch('../blog/index.html');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();

            // Parse blog posts from the HTML
            this.blogPosts = this.parseBlogPostsFromHTML(html);
            this.analytics.totalPosts = this.blogPosts.length;
            this.analytics.githubPosts = this.blogPosts.filter(post => post.isGithubProject).length;

            console.log(`Loaded ${this.blogPosts.length} blog posts`);

        } catch (error) {
            console.warn('Could not load blog posts from file, using mock data:', error.message);

            // Fallback to mock data for demonstration
            this.blogPosts = this.generateMockBlogPosts();
            this.analytics.totalPosts = this.blogPosts.length;
            this.analytics.githubPosts = this.blogPosts.filter(post => post.isGithubProject).length;

            this.showToast('Using demo data - blog posts loaded successfully', 'info');
        }
    }

    generateMockBlogPosts() {
        return [
            {
                id: 'post-1',
                title: 'Universal Video Scraper & AI Analysis Platform',
                excerpt: 'A comprehensive, production-ready web application that automatically scrapes, downloads, processes, and performs AI-powered analysis on videos from any target URL.',
                link: 'videoprocessing-demo.html',
                date: 'July 2, 2025',
                category: 'AI Development',
                isGithubProject: true,
                status: 'published'
            },
            {
                id: 'post-2',
                title: 'AI Automation Guide for Cambridgeshire Businesses',
                excerpt: 'Complete guide to implementing AI automation solutions for local businesses in Cambridgeshire, including case studies and practical examples.',
                link: 'ai-automation-guide-cambridgeshire.html',
                date: 'June 28, 2025',
                category: 'AI Development',
                isGithubProject: false,
                status: 'published'
            },
            {
                id: 'post-3',
                title: 'Python Automation Scripts Collection',
                excerpt: 'A curated collection of Python automation scripts for common business tasks, including email automation, data processing, and web scraping.',
                link: 'python-automation-scripts.html',
                date: 'June 25, 2025',
                category: 'Python Development',
                isGithubProject: true,
                status: 'published'
            }
        ];
    }

    parseBlogPostsFromHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const blogCards = doc.querySelectorAll('.blog-card');
        
        return Array.from(blogCards).map((card, index) => {
            const title = card.querySelector('.blog-title')?.textContent || 'Untitled';
            const excerpt = card.querySelector('.blog-excerpt')?.textContent || '';
            const link = card.querySelector('.read-more')?.getAttribute('href') || '';
            const date = card.querySelector('.blog-meta span')?.textContent || '';
            const category = card.querySelector('.blog-meta span:nth-child(3)')?.textContent || '';
            
            return {
                id: `post-${index}`,
                title,
                excerpt,
                link,
                date,
                category,
                isGithubProject: link.includes('github') || category.includes('GitHub'),
                status: 'published'
            };
        });
    }

    renderBlogPosts() {
        const postsGrid = document.getElementById('posts-grid');
        if (!postsGrid) return;

        if (this.blogPosts.length === 0) {
            postsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No blog posts found</h3>
                    <p>Start by converting a GitHub repository to create your first blog post.</p>
                </div>
            `;
            return;
        }

        postsGrid.innerHTML = this.blogPosts.map(post => `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-card-header">
                    <div>
                        <h3 class="post-title">${post.title}</h3>
                        <div class="post-meta">
                            <span><i class="fas fa-calendar"></i> ${post.date}</span>
                            <span><i class="fas fa-tag"></i> ${post.category}</span>
                            ${post.isGithubProject ? '<span><i class="fab fa-github"></i> GitHub Project</span>' : ''}
                        </div>
                    </div>
                    <div class="post-actions">
                        <button class="btn btn-sm btn-outline" onclick="dashboard.editPost('${post.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="dashboard.previewPost('${post.id}')" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="dashboard.deletePost('${post.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-footer">
                    <span class="post-status status-${post.status}">${post.status}</span>
                    ${post.link ? `<a href="../blog/${post.link}" target="_blank" class="btn btn-sm btn-primary">View Post</a>` : ''}
                </div>
            </div>
        `).join('');
    }

    loadTemplates() {
        this.templates = [
            {
                id: 'default',
                name: 'Default Template',
                description: 'Clean and professional design matching your website',
                preview: 'fas fa-file-alt',
                active: true
            },
            {
                id: 'github-focused',
                name: 'GitHub Focused',
                description: 'Emphasizes code blocks and technical content',
                preview: 'fab fa-github',
                active: false
            },
            {
                id: 'minimal',
                name: 'Minimal',
                description: 'Clean, distraction-free reading experience',
                preview: 'fas fa-align-left',
                active: false
            },
            {
                id: 'showcase',
                name: 'Project Showcase',
                description: 'Perfect for highlighting project features',
                preview: 'fas fa-star',
                active: false
            }
        ];
    }

    renderTemplates() {
        const templatesGrid = document.querySelector('.templates-grid');
        if (!templatesGrid) return;

        templatesGrid.innerHTML = this.templates.map(template => `
            <div class="template-card ${template.active ? 'active' : ''}" onclick="dashboard.selectTemplate('${template.id}')">
                <div class="template-preview">
                    <i class="${template.preview}"></i>
                </div>
                <div class="template-info">
                    <h4 class="template-name">${template.name}</h4>
                    <p class="template-description">${template.description}</p>
                    ${template.active ? '<span class="template-status">Active</span>' : ''}
                </div>
            </div>
        `).join('');
    }

    loadAnalytics() {
        // Simulate analytics data - in a real implementation, this would come from actual analytics
        this.analytics = {
            totalViews: Math.floor(Math.random() * 10000) + 1000,
            totalPosts: this.blogPosts.length,
            githubPosts: this.blogPosts.filter(post => post.isGithubProject).length,
            avgSeoScore: Math.floor(Math.random() * 30) + 70
        };
    }

    renderAnalytics() {
        // Update analytics cards
        document.getElementById('total-views').textContent = this.analytics.totalViews.toLocaleString();
        document.getElementById('total-posts').textContent = this.analytics.totalPosts;
        document.getElementById('github-posts').textContent = this.analytics.githubPosts;
        document.getElementById('avg-seo-score').textContent = this.analytics.avgSeoScore;

        // Render top posts
        const topPostsList = document.getElementById('top-posts-list');
        if (topPostsList) {
            const topPosts = this.blogPosts.slice(0, 5);
            topPostsList.innerHTML = topPosts.map((post, index) => `
                <div class="top-post-item">
                    <span class="post-rank">${index + 1}</span>
                    <div class="post-info">
                        <h4>${post.title}</h4>
                        <p>${Math.floor(Math.random() * 1000) + 100} views</p>
                    </div>
                </div>
            `).join('');
        }
    }

    renderQueue() {
        const queueList = document.getElementById('queue-list');
        if (!queueList) return;

        if (this.queue.length === 0) {
            queueList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-list-ul"></i>
                    <h3>No items in queue</h3>
                    <p>Add GitHub repositories to start processing.</p>
                </div>
            `;
            return;
        }

        queueList.innerHTML = this.queue.map(item => `
            <div class="queue-item" data-queue-id="${item.id}">
                <div class="queue-item-info">
                    <h4 class="queue-item-title">${item.title || 'Processing...'}</h4>
                    <p class="queue-item-url">${item.url}</p>
                </div>
                <div class="queue-item-status status-${item.status}">
                    <i class="fas fa-${this.getStatusIcon(item.status)}"></i>
                    <span>${item.status}</span>
                </div>
                <div class="queue-item-actions">
                    ${item.status === 'failed' ? `<button class="btn btn-sm btn-warning" onclick="dashboard.retryQueueItem('${item.id}')">Retry</button>` : ''}
                    <button class="btn btn-sm btn-outline" onclick="dashboard.removeQueueItem('${item.id}')">Remove</button>
                </div>
            </div>
        `).join('');
    }

    getStatusIcon(status) {
        const icons = {
            'queued': 'clock',
            'processing': 'spinner fa-spin',
            'completed': 'check-circle',
            'failed': 'exclamation-circle'
        };
        return icons[status] || 'question-circle';
    }

    loadSEOPosts() {
        const seoPostSelect = document.getElementById('seo-post-select');
        if (!seoPostSelect) return;

        seoPostSelect.innerHTML = '<option value="">Select a blog post to analyze</option>' +
            this.blogPosts.map(post => `
                <option value="${post.id}">${post.title}</option>
            `).join('');
    }

    // Utility methods
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    showLoading(text = 'Processing...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');
        loadingText.textContent = text;
        overlay.classList.add('active');
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('active');
    }

    // Post management methods
    editPost(postId) {
        const post = this.blogPosts.find(p => p.id === postId);
        if (!post) return;
        
        // Open edit modal or redirect to edit page
        this.showToast(`Edit functionality for "${post.title}" - Coming soon!`, 'info');
    }

    previewPost(postId) {
        const post = this.blogPosts.find(p => p.id === postId);
        if (!post) return;
        
        if (post.link) {
            window.open(`../blog/${post.link}`, '_blank');
        } else {
            this.showToast('Preview not available', 'warning');
        }
    }

    deletePost(postId) {
        const post = this.blogPosts.find(p => p.id === postId);
        if (!post) return;
        
        if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
            // In a real implementation, this would delete the actual file
            this.blogPosts = this.blogPosts.filter(p => p.id !== postId);
            this.renderBlogPosts();
            this.showToast('Post deleted successfully', 'success');
        }
    }

    // Template management
    selectTemplate(templateId) {
        this.templates.forEach(template => {
            template.active = template.id === templateId;
        });
        this.renderTemplates();
        this.showToast(`Template "${templateId}" selected`, 'success');
    }

    // Queue management
    retryQueueItem(itemId) {
        const item = this.queue.find(q => q.id === itemId);
        if (item) {
            item.status = 'queued';
            this.renderQueue();
            this.showToast('Item added back to queue', 'info');
        }
    }

    removeQueueItem(itemId) {
        this.queue = this.queue.filter(q => q.id !== itemId);
        this.renderQueue();
        this.showToast('Item removed from queue', 'info');
    }

    // Filter methods
    filterPosts(searchTerm) {
        const filteredPosts = this.blogPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderFilteredPosts(filteredPosts);
    }

    filterPostsByType(type) {
        let filteredPosts;
        switch(type) {
            case 'github':
                filteredPosts = this.blogPosts.filter(post => post.isGithubProject);
                break;
            case 'published':
                filteredPosts = this.blogPosts.filter(post => post.status === 'published');
                break;
            case 'draft':
                filteredPosts = this.blogPosts.filter(post => post.status === 'draft');
                break;
            default:
                filteredPosts = this.blogPosts;
        }
        this.renderFilteredPosts(filteredPosts);
    }

    renderFilteredPosts(posts) {
        const postsGrid = document.getElementById('posts-grid');
        if (!postsGrid) return;

        // Temporarily replace blogPosts for rendering
        const originalPosts = this.blogPosts;
        this.blogPosts = posts;
        this.renderBlogPosts();
        this.blogPosts = originalPosts;
    }

    // View management
    setPostsView(view) {
        const postsGrid = document.getElementById('posts-grid');
        const viewButtons = document.querySelectorAll('[data-view]');
        
        viewButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        if (view === 'list') {
            postsGrid.classList.add('list-view');
        } else {
            postsGrid.classList.remove('list-view');
        }
    }
}

// Global functions for HTML onclick handlers
function refreshDashboard() {
    dashboard.showLoading('Refreshing dashboard...');
    setTimeout(() => {
        dashboard.loadBlogPosts();
        dashboard.loadAnalytics();
        dashboard.hideLoading();
        dashboard.showToast('Dashboard refreshed', 'success');
    }, 1000);
}

function openSettings() {
    dashboard.showToast('Settings panel - Coming soon!', 'info');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function setPostsView(view) {
    dashboard.setPostsView(view);
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new BlogDashboard();

    // Notify other modules that dashboard is ready
    setTimeout(() => {
        if (window.seoTools && typeof window.seoTools.loadPostsForAnalysis === 'function') {
            window.seoTools.loadPostsForAnalysis();
        }

        if (window.analytics && typeof window.analytics.updateAnalytics === 'function') {
            window.analytics.updateAnalytics();
        }

        console.log('Dashboard initialization complete');
    }, 500);
});
