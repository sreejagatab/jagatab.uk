/**
 * Blog Manager - Dynamic Blog Content Management
 * Feeds blog content from blog-data.json to blog/index.html
 */

class BlogManager {
    constructor() {
        this.blogData = null;
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.postsPerPage = 12;
        this.currentPage = 1;
        
        this.init();
    }

    async init() {
        try {
            await this.loadBlogData();
            this.renderBlogPosts();
            this.setupEventListeners();
            console.log('✅ Blog Manager initialized successfully');
        } catch (error) {
            console.error('❌ Blog Manager initialization failed:', error);
            this.showError('Failed to load blog content');
        }
    }

    async loadBlogData() {
        try {
            const response = await fetch('blog-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.blogData = await response.json();
            console.log(`📚 Loaded ${this.blogData.posts.length} blog posts`);
        } catch (error) {
            console.error('Failed to load blog data:', error);
            throw error;
        }
    }

    renderBlogPosts() {
        if (!this.blogData) {
            console.warn('No blog data available');
            return;
        }

        const blogGrid = document.querySelector('.blog-grid');
        if (!blogGrid) {
            console.warn('Blog grid container not found');
            return;
        }

        // Filter and sort posts
        let posts = this.filterPosts(this.blogData.posts);
        posts = this.sortPosts(posts);

        // Paginate posts
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const paginatedPosts = posts.slice(startIndex, endIndex);

        // Generate HTML
        const postsHTML = paginatedPosts.map(post => this.generatePostHTML(post)).join('');
        
        // Update the blog grid
        blogGrid.innerHTML = postsHTML;

        // Update pagination if needed
        this.updatePagination(posts.length);

        console.log(`📝 Rendered ${paginatedPosts.length} blog posts`);
    }

    filterPosts(posts) {
        if (this.currentFilter === 'all') {
            return posts.filter(post => post.status === 'published');
        }
        
        return posts.filter(post => 
            post.status === 'published' && 
            (post.category.toLowerCase().includes(this.currentFilter.toLowerCase()) ||
             post.tags.some(tag => tag.toLowerCase().includes(this.currentFilter.toLowerCase())))
        );
    }

    sortPosts(posts) {
        switch (this.currentSort) {
            case 'date-desc':
                return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date-asc':
                return posts.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'title-asc':
                return posts.sort((a, b) => a.title.localeCompare(b.title));
            case 'title-desc':
                return posts.sort((a, b) => b.title.localeCompare(a.title));
            case 'featured':
                return posts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            default:
                return posts;
        }
    }

    generatePostHTML(post) {
        const formattedDate = this.formatDate(post.date);
        const featuredBadge = post.featured ? '<span class="featured-badge">Featured</span>' : '';
        
        return `
            <article class="blog-card" data-category="${post.category}" data-id="${post.id}">
                <div class="blog-image">
                    <i class="${post.icon}"></i>
                    ${featuredBadge}
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="fas fa-user"></i> ${post.author}</span>
                        <span><i class="fas fa-tag"></i> ${post.category}</span>
                    </div>
                    <h2 class="blog-title">${post.title}</h2>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="${post.filename}" class="read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    setupEventListeners() {
        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                this.handleFilterClick(e.target);
            }
        });

        // Sort dropdown
        const sortSelect = document.getElementById('blog-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.currentPage = 1; // Reset to first page
                this.renderBlogPosts();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    handleFilterClick(button) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        
        // Update filter and re-render
        this.currentFilter = button.dataset.filter;
        this.currentPage = 1; // Reset to first page
        this.renderBlogPosts();
    }

    handleSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.renderBlogPosts();
            return;
        }

        const blogGrid = document.querySelector('.blog-grid');
        if (!blogGrid) return;

        const filteredPosts = this.blogData.posts.filter(post => 
            post.status === 'published' &&
            (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
             post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        );

        const postsHTML = filteredPosts.map(post => this.generatePostHTML(post)).join('');
        blogGrid.innerHTML = postsHTML;

        console.log(`🔍 Search results: ${filteredPosts.length} posts found for "${searchTerm}"`);
    }

    updatePagination(totalPosts) {
        const totalPages = Math.ceil(totalPosts / this.postsPerPage);
        const paginationContainer = document.querySelector('.pagination');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        
        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage - 1}">Previous</button>`;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage + 1}">Next</button>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
        
        // Add pagination event listeners
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.matches('.page-btn')) {
                this.currentPage = parseInt(e.target.dataset.page);
                this.renderBlogPosts();
            }
        });
    }

    showError(message) {
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            blogGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Blog Posts</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="retry-btn">Retry</button>
                </div>
            `;
        }
    }

    // Public methods for dashboard integration
    addPost(postData) {
        if (!this.blogData) return false;
        
        const newPost = {
            id: postData.id || this.generatePostId(postData.title),
            ...postData,
            status: postData.status || 'published'
        };
        
        this.blogData.posts.unshift(newPost);
        this.renderBlogPosts();
        this.saveBlogData();
        
        console.log(`✅ Added new blog post: ${newPost.title}`);
        return true;
    }

    updatePost(postId, postData) {
        if (!this.blogData) return false;
        
        const postIndex = this.blogData.posts.findIndex(post => post.id === postId);
        if (postIndex === -1) return false;
        
        this.blogData.posts[postIndex] = { ...this.blogData.posts[postIndex], ...postData };
        this.renderBlogPosts();
        this.saveBlogData();
        
        console.log(`✅ Updated blog post: ${postId}`);
        return true;
    }

    deletePost(postId) {
        if (!this.blogData) return false;
        
        const postIndex = this.blogData.posts.findIndex(post => post.id === postId);
        if (postIndex === -1) return false;
        
        this.blogData.posts.splice(postIndex, 1);
        this.renderBlogPosts();
        this.saveBlogData();
        
        console.log(`✅ Deleted blog post: ${postId}`);
        return true;
    }

    async saveBlogData() {
        // In a real implementation, this would save to a server
        // For now, we'll just update localStorage as a backup
        try {
            localStorage.setItem('blog-data-backup', JSON.stringify(this.blogData));
            console.log('💾 Blog data backed up to localStorage');
        } catch (error) {
            console.error('Failed to backup blog data:', error);
        }
    }

    generatePostId(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}
