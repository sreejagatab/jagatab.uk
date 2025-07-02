/**
 * Analytics Module for Blog Dashboard
 * Handles performance tracking, charts, and insights
 */

class BlogAnalytics {
    constructor() {
        this.chart = null;
        this.activityData = [];
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        this.generateMockData();
        this.setupChart();
    }

    generateMockData() {
        // Generate mock activity data for the last 30 days
        const today = new Date();
        this.activityData = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            this.activityData.push({
                date: date.toISOString().split('T')[0],
                conversions: Math.floor(Math.random() * 5) + 1,
                views: Math.floor(Math.random() * 100) + 50,
                githubClicks: Math.floor(Math.random() * 20) + 5
            });
        }

        // Generate performance metrics
        this.performanceMetrics = {
            avgConversionTime: Math.floor(Math.random() * 30) + 15, // seconds
            successRate: Math.floor(Math.random() * 20) + 80, // percentage
            totalConversions: this.activityData.reduce((sum, day) => sum + day.conversions, 0),
            avgSeoScore: Math.floor(Math.random() * 30) + 70,
            topKeywords: [
                'Python automation',
                'GitHub projects',
                'AI development',
                'Web development',
                'API integration'
            ]
        };
    }

    setupChart() {
        const canvas = document.getElementById('activity-chart');
        if (!canvas) {
            console.warn('Activity chart canvas not found');
            return;
        }

        try {
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.warn('Could not get 2D context for chart');
                return;
            }

            // Simple chart implementation (in production, you'd use Chart.js)
            this.drawChart(ctx, canvas);
        } catch (error) {
            console.error('Error setting up chart:', error);
        }
    }

    drawChart(ctx, canvas) {
        try {
            // Set canvas size with proper scaling
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.scale(dpr, dpr);

            const chartWidth = rect.width - 80;
            const chartHeight = rect.height - 80;
            const startX = 40;
            const startY = 40;

            // Clear canvas
            ctx.clearRect(0, 0, rect.width, rect.height);

            // Draw background
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, rect.width, rect.height);

            // Get data for chart
            const data = this.activityData.slice(-7); // Last 7 days
            if (data.length === 0) {
                // Draw "No data" message
                ctx.fillStyle = '#6b7280';
                ctx.font = '14px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('No data available', rect.width / 2, rect.height / 2);
                return;
            }

            const maxValue = Math.max(...data.map(d => d.conversions), 1); // Ensure at least 1

            // Draw grid lines
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 1;

            for (let i = 0; i <= 5; i++) {
                const y = startY + (chartHeight / 5) * i;
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.lineTo(startX + chartWidth, y);
                ctx.stroke();
            }

            // Draw bars
            const barWidth = Math.max(chartWidth / data.length - 10, 20);

            data.forEach((day, index) => {
                const barHeight = (day.conversions / maxValue) * chartHeight;
                const x = startX + (chartWidth / data.length) * index + 5;
                const y = startY + chartHeight - barHeight;

                // Draw bar
                ctx.fillStyle = '#1e40af';
                ctx.fillRect(x, y, barWidth, barHeight);

                // Draw label
                ctx.fillStyle = '#6b7280';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                const dayLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                ctx.fillText(dayLabel, x + barWidth / 2, startY + chartHeight + 20);

                // Draw value
                ctx.fillStyle = '#1f2937';
                ctx.fillText(day.conversions.toString(), x + barWidth / 2, y - 5);
            });

            // Draw title
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'left';
            ctx.fillText('Daily Conversions (Last 7 Days)', startX, 25);

        } catch (error) {
            console.error('Error drawing chart:', error);

            // Fallback: draw error message
            ctx.fillStyle = '#dc2626';
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Chart rendering error', canvas.offsetWidth / 2, canvas.offsetHeight / 2);
        }
    }

    updateAnalytics() {
        // Update analytics cards
        this.updateAnalyticsCards();
        
        // Update top posts
        this.updateTopPosts();
        
        // Refresh chart
        this.setupChart();
    }

    updateAnalyticsCards() {
        const cards = {
            'total-views': this.calculateTotalViews(),
            'total-posts': dashboard.blogPosts.length,
            'github-posts': dashboard.blogPosts.filter(post => post.isGithubProject).length,
            'avg-seo-score': this.performanceMetrics.avgSeoScore
        };

        Object.entries(cards).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                this.animateNumber(element, parseInt(element.textContent) || 0, value);
            }
        });
    }

    calculateTotalViews() {
        return this.activityData.reduce((sum, day) => sum + day.views, 0);
    }

    animateNumber(element, start, end) {
        const duration = 1000; // 1 second
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateTopPosts() {
        const topPostsList = document.getElementById('top-posts-list');
        if (!topPostsList) return;

        const topPosts = dashboard.blogPosts
            .slice(0, 5)
            .map((post, index) => ({
                ...post,
                views: Math.floor(Math.random() * 1000) + 100,
                rank: index + 1
            }));

        topPostsList.innerHTML = topPosts.map(post => `
            <div class="top-post-item">
                <div class="post-rank">${post.rank}</div>
                <div class="post-info">
                    <h4 class="post-title">${post.title}</h4>
                    <div class="post-stats">
                        <span class="views">
                            <i class="fas fa-eye"></i>
                            ${post.views.toLocaleString()} views
                        </span>
                        <span class="category">
                            <i class="fas fa-tag"></i>
                            ${post.category}
                        </span>
                    </div>
                </div>
                <div class="post-actions">
                    <button class="btn btn-sm btn-outline" onclick="analytics.viewPostDetails('${post.id}')" title="View Details">
                        <i class="fas fa-chart-line"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    viewPostDetails(postId) {
        const post = dashboard.blogPosts.find(p => p.id === postId);
        if (!post) return;

        // Show detailed analytics for this post
        this.showPostAnalytics(post);
    }

    showPostAnalytics(post) {
        const modal = document.getElementById('preview-modal');
        const previewContent = document.getElementById('preview-content');
        
        // Generate mock analytics data for this post
        const analytics = this.generatePostAnalytics(post);
        
        previewContent.innerHTML = `
            <div class="post-analytics">
                <div class="analytics-header">
                    <h3>${post.title}</h3>
                    <span class="post-category">${post.category}</span>
                </div>
                
                <div class="analytics-grid">
                    <div class="metric-card">
                        <div class="metric-value">${analytics.views.toLocaleString()}</div>
                        <div class="metric-label">Total Views</div>
                        <div class="metric-change positive">+${analytics.viewsGrowth}%</div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value">${analytics.githubClicks}</div>
                        <div class="metric-label">GitHub Clicks</div>
                        <div class="metric-change positive">+${analytics.clicksGrowth}%</div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value">${analytics.avgTimeOnPage}s</div>
                        <div class="metric-label">Avg. Time on Page</div>
                        <div class="metric-change ${analytics.timeGrowth > 0 ? 'positive' : 'negative'}">${analytics.timeGrowth > 0 ? '+' : ''}${analytics.timeGrowth}%</div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value">${analytics.seoScore}</div>
                        <div class="metric-label">SEO Score</div>
                        <div class="metric-change ${analytics.seoScore > 80 ? 'positive' : 'neutral'}">
                            ${analytics.seoScore > 80 ? 'Good' : 'Needs Work'}
                        </div>
                    </div>
                </div>
                
                <div class="analytics-sections">
                    <div class="section">
                        <h4>Top Referrers</h4>
                        <div class="referrer-list">
                            ${analytics.referrers.map(ref => `
                                <div class="referrer-item">
                                    <span class="referrer-name">${ref.name}</span>
                                    <span class="referrer-count">${ref.count} visits</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h4>Keywords</h4>
                        <div class="keyword-tags">
                            ${analytics.keywords.map(keyword => `
                                <span class="keyword-tag">${keyword}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="analytics-actions">
                    <button class="btn btn-primary" onclick="analytics.optimizePost('${post.id}')">
                        <i class="fas fa-magic"></i> Optimize SEO
                    </button>
                    <button class="btn btn-secondary" onclick="analytics.sharePost('${post.id}')">
                        <i class="fas fa-share"></i> Share Post
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    generatePostAnalytics(post) {
        return {
            views: Math.floor(Math.random() * 2000) + 500,
            viewsGrowth: Math.floor(Math.random() * 50) + 10,
            githubClicks: Math.floor(Math.random() * 100) + 20,
            clicksGrowth: Math.floor(Math.random() * 30) + 5,
            avgTimeOnPage: Math.floor(Math.random() * 180) + 60,
            timeGrowth: Math.floor(Math.random() * 40) - 20,
            seoScore: Math.floor(Math.random() * 30) + 70,
            referrers: [
                { name: 'Google Search', count: Math.floor(Math.random() * 100) + 50 },
                { name: 'GitHub', count: Math.floor(Math.random() * 50) + 20 },
                { name: 'Direct', count: Math.floor(Math.random() * 30) + 10 },
                { name: 'Social Media', count: Math.floor(Math.random() * 20) + 5 }
            ],
            keywords: this.extractKeywords(post.title + ' ' + post.excerpt)
        };
    }

    extractKeywords(text) {
        const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3 && !commonWords.includes(word));
        
        // Get unique words and return top 5
        return [...new Set(words)].slice(0, 5);
    }

    optimizePost(postId) {
        dashboard.showToast('SEO optimization suggestions generated!', 'success');
        closeModal('preview-modal');
        
        // Switch to SEO section
        dashboard.showSection('seo');
        
        // Pre-select the post in SEO analyzer
        const seoSelect = document.getElementById('seo-post-select');
        if (seoSelect) {
            seoSelect.value = postId;
        }
    }

    sharePost(postId) {
        const post = dashboard.blogPosts.find(p => p.id === postId);
        if (!post) return;

        // Generate share URLs
        const postUrl = `https://jagatab.uk/blog/${post.link}`;
        const shareText = `Check out this blog post: ${post.title}`;
        
        const shareOptions = [
            {
                name: 'Twitter',
                url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`
            },
            {
                name: 'LinkedIn',
                url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
            },
            {
                name: 'Copy Link',
                action: () => {
                    navigator.clipboard.writeText(postUrl);
                    dashboard.showToast('Link copied to clipboard!', 'success');
                }
            }
        ];

        // Show share options
        const shareMenu = shareOptions.map(option => {
            if (option.action) {
                return `<button class="btn btn-outline" onclick="(${option.action.toString()})()">${option.name}</button>`;
            } else {
                return `<a href="${option.url}" target="_blank" class="btn btn-outline">${option.name}</a>`;
            }
        }).join('');

        dashboard.showToast(`Share options: ${shareMenu}`, 'info');
    }

    exportAnalytics() {
        const data = {
            summary: {
                totalPosts: dashboard.blogPosts.length,
                githubPosts: dashboard.blogPosts.filter(post => post.isGithubProject).length,
                totalViews: this.calculateTotalViews(),
                avgSeoScore: this.performanceMetrics.avgSeoScore
            },
            activityData: this.activityData,
            performanceMetrics: this.performanceMetrics,
            posts: dashboard.blogPosts.map(post => ({
                ...post,
                analytics: this.generatePostAnalytics(post)
            }))
        };

        // Create and download JSON file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blog-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        dashboard.showToast('Analytics data exported successfully!', 'success');
    }

    // Performance monitoring
    trackConversion(repoUrl, success, duration) {
        const event = {
            timestamp: new Date().toISOString(),
            repoUrl,
            success,
            duration,
            type: 'conversion'
        };

        // Store in local storage for persistence
        const events = JSON.parse(localStorage.getItem('blog-analytics-events') || '[]');
        events.push(event);
        
        // Keep only last 1000 events
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }
        
        localStorage.setItem('blog-analytics-events', JSON.stringify(events));
        
        // Update real-time metrics
        this.updateRealTimeMetrics();
    }

    updateRealTimeMetrics() {
        const events = JSON.parse(localStorage.getItem('blog-analytics-events') || '[]');
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = events.filter(event => event.timestamp.startsWith(today));
        
        // Update today's conversion count
        const conversions = todayEvents.filter(event => event.type === 'conversion' && event.success).length;
        
        // Update activity data
        const todayData = this.activityData.find(day => day.date === today);
        if (todayData) {
            todayData.conversions = conversions;
        }
        
        // Refresh chart
        this.setupChart();
    }

    // Initialize analytics
    static init() {
        return new BlogAnalytics();
    }
}

// Global analytics functions
function analyzeSEO() {
    const postSelect = document.getElementById('seo-post-select');
    const postId = postSelect.value;
    
    if (!postId) {
        dashboard.showToast('Please select a blog post to analyze', 'warning');
        return;
    }
    
    const post = dashboard.blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    dashboard.showLoading('Analyzing SEO...');
    
    setTimeout(() => {
        const seoResults = document.getElementById('seo-results');
        const score = Math.floor(Math.random() * 30) + 70;
        
        seoResults.innerHTML = `
            <div class="seo-analysis">
                <div class="seo-score ${score > 80 ? 'good' : score > 60 ? 'fair' : 'poor'}">
                    <div class="score-circle">
                        <span class="score-value">${score}</span>
                        <span class="score-label">SEO Score</span>
                    </div>
                </div>
                
                <div class="seo-recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                        <li class="${score > 75 ? 'good' : 'warning'}">
                            <i class="fas fa-${score > 75 ? 'check' : 'exclamation-triangle'}"></i>
                            Title optimization: ${score > 75 ? 'Good' : 'Needs improvement'}
                        </li>
                        <li class="${score > 70 ? 'good' : 'warning'}">
                            <i class="fas fa-${score > 70 ? 'check' : 'exclamation-triangle'}"></i>
                            Meta description: ${score > 70 ? 'Optimized' : 'Too short'}
                        </li>
                        <li class="${score > 65 ? 'good' : 'warning'}">
                            <i class="fas fa-${score > 65 ? 'check' : 'exclamation-triangle'}"></i>
                            Keyword density: ${score > 65 ? 'Balanced' : 'Low'}
                        </li>
                        <li class="good">
                            <i class="fas fa-check"></i>
                            Mobile-friendly design
                        </li>
                    </ul>
                </div>
            </div>
        `;
        
        dashboard.hideLoading();
        dashboard.showToast('SEO analysis completed!', 'success');
    }, 2000);
}

function researchKeywords() {
    const keywordInput = document.getElementById('keyword-input');
    const keywords = keywordInput.value.trim();
    
    if (!keywords) {
        dashboard.showToast('Please enter keywords to research', 'warning');
        return;
    }
    
    dashboard.showLoading('Researching keywords...');
    
    setTimeout(() => {
        const keywordResults = document.getElementById('keyword-results');
        const suggestions = [
            'python automation tools',
            'github project showcase',
            'web development portfolio',
            'api integration guide',
            'machine learning projects'
        ];
        
        keywordResults.innerHTML = `
            <div class="keyword-research">
                <h4>Keyword Suggestions:</h4>
                <div class="keyword-list">
                    ${suggestions.map(keyword => `
                        <div class="keyword-item">
                            <span class="keyword">${keyword}</span>
                            <span class="difficulty ${Math.random() > 0.5 ? 'low' : 'medium'}">
                                ${Math.random() > 0.5 ? 'Low' : 'Medium'} difficulty
                            </span>
                            <span class="volume">${Math.floor(Math.random() * 1000) + 100}/month</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        dashboard.hideLoading();
        dashboard.showToast('Keyword research completed!', 'success');
    }, 1500);
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = BlogAnalytics.init();
});
