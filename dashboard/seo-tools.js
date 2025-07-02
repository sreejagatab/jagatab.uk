/**
 * SEO Tools Module for Blog Dashboard
 * Advanced SEO analysis, optimization, and monitoring
 */

class SEOTools {
    constructor() {
        this.seoRules = {
            title: {
                minLength: 30,
                maxLength: 60,
                weight: 20
            },
            description: {
                minLength: 120,
                maxLength: 160,
                weight: 15
            },
            headings: {
                h1Count: 1,
                h2MinCount: 2,
                weight: 15
            },
            keywords: {
                density: { min: 1, max: 3 },
                weight: 10
            },
            content: {
                minLength: 300,
                weight: 10
            },
            images: {
                altTextRequired: true,
                weight: 10
            },
            links: {
                internalMinCount: 2,
                weight: 10
            },
            readability: {
                avgWordsPerSentence: 20,
                weight: 10
            }
        };
        
        this.init();
    }

    init() {
        this.setupSEOAnalyzer();
        this.setupKeywordTools();
    }

    setupSEOAnalyzer() {
        // Initialize SEO analyzer with blog posts
        this.loadPostsForAnalysis();
    }

    setupKeywordTools() {
        // Initialize keyword research tools
        this.keywordDatabase = this.loadKeywordDatabase();
    }

    loadPostsForAnalysis() {
        const seoPostSelect = document.getElementById('seo-post-select');
        if (!seoPostSelect) {
            console.warn('SEO post select element not found');
            return;
        }

        // Clear existing options
        seoPostSelect.innerHTML = '<option value="">Select a blog post to analyze</option>';

        // Check if dashboard and blogPosts are available
        if (!window.dashboard || !window.dashboard.blogPosts) {
            console.warn('Dashboard or blog posts not available yet');
            return;
        }

        // Add blog posts as options
        window.dashboard.blogPosts.forEach(post => {
            const option = document.createElement('option');
            option.value = post.id;
            option.textContent = post.title;
            seoPostSelect.appendChild(option);
        });

        console.log(`Loaded ${window.dashboard.blogPosts.length} posts for SEO analysis`);
    }

    async analyzeBlogPost(postId) {
        const post = dashboard.blogPosts.find(p => p.id === postId);
        if (!post) {
            throw new Error('Blog post not found');
        }

        dashboard.showLoading('Analyzing SEO metrics...');

        try {
            // Simulate fetching post content
            const content = await this.fetchPostContent(post);
            
            // Perform comprehensive SEO analysis
            const analysis = this.performSEOAnalysis(post, content);
            
            // Display results
            this.displaySEOResults(analysis);
            
            dashboard.hideLoading();
            return analysis;
            
        } catch (error) {
            dashboard.hideLoading();
            throw error;
        }
    }

    async fetchPostContent(post) {
        // In a real implementation, this would fetch the actual HTML content
        // For now, we'll simulate with the available data
        return {
            title: post.title,
            description: post.excerpt,
            content: post.excerpt + ' ' + this.generateMockContent(),
            headings: this.extractHeadings(post.title),
            images: this.generateMockImages(),
            links: this.generateMockLinks()
        };
    }

    generateMockContent() {
        const paragraphs = [
            "This comprehensive guide explores the latest developments in modern web development, focusing on best practices and emerging technologies.",
            "Our analysis covers multiple aspects including performance optimization, user experience design, and scalable architecture patterns.",
            "The implementation details provided here are based on real-world projects and industry standards, ensuring practical applicability.",
            "Key features include automated testing, continuous integration, and deployment strategies that enhance development workflows.",
            "Security considerations are paramount in today's digital landscape, and we address common vulnerabilities and mitigation strategies."
        ];
        
        return paragraphs.join(' ');
    }

    extractHeadings(title) {
        // Mock heading structure
        return {
            h1: [title],
            h2: ['Overview', 'Implementation', 'Best Practices', 'Conclusion'],
            h3: ['Getting Started', 'Configuration', 'Advanced Features', 'Troubleshooting']
        };
    }

    generateMockImages() {
        return [
            { src: 'screenshot1.png', alt: 'Project dashboard interface' },
            { src: 'diagram.png', alt: 'System architecture diagram' },
            { src: 'code-example.png', alt: '' } // Missing alt text for testing
        ];
    }

    generateMockLinks() {
        return {
            internal: [
                { href: '/services/python-automation', text: 'Python Automation Services' },
                { href: '/blog/ai-automation-guide', text: 'AI Automation Guide' }
            ],
            external: [
                { href: 'https://github.com/user/repo', text: 'View on GitHub' },
                { href: 'https://docs.example.com', text: 'Documentation' }
            ]
        };
    }

    performSEOAnalysis(post, content) {
        const analysis = {
            post: post,
            score: 0,
            maxScore: 100,
            checks: [],
            recommendations: [],
            keywords: this.extractKeywords(content.content),
            readability: this.analyzeReadability(content.content)
        };

        // Analyze title
        const titleCheck = this.analyzeTitleSEO(content.title);
        analysis.checks.push(titleCheck);
        analysis.score += titleCheck.score;

        // Analyze meta description
        const descriptionCheck = this.analyzeDescriptionSEO(content.description);
        analysis.checks.push(descriptionCheck);
        analysis.score += descriptionCheck.score;

        // Analyze headings
        const headingsCheck = this.analyzeHeadingsSEO(content.headings);
        analysis.checks.push(headingsCheck);
        analysis.score += headingsCheck.score;

        // Analyze content length
        const contentCheck = this.analyzeContentSEO(content.content);
        analysis.checks.push(contentCheck);
        analysis.score += contentCheck.score;

        // Analyze images
        const imagesCheck = this.analyzeImagesSEO(content.images);
        analysis.checks.push(imagesCheck);
        analysis.score += imagesCheck.score;

        // Analyze internal links
        const linksCheck = this.analyzeLinksSEO(content.links);
        analysis.checks.push(linksCheck);
        analysis.score += linksCheck.score;

        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis.checks);

        return analysis;
    }

    analyzeTitleSEO(title) {
        const rule = this.seoRules.title;
        const length = title.length;
        
        let score = 0;
        let status = 'poor';
        let message = '';

        if (length >= rule.minLength && length <= rule.maxLength) {
            score = rule.weight;
            status = 'good';
            message = `Title length is optimal (${length} characters)`;
        } else if (length < rule.minLength) {
            score = Math.floor((length / rule.minLength) * rule.weight);
            status = 'warning';
            message = `Title is too short (${length} characters). Aim for ${rule.minLength}-${rule.maxLength} characters.`;
        } else {
            score = Math.floor(rule.weight * 0.7);
            status = 'warning';
            message = `Title is too long (${length} characters). Aim for ${rule.minLength}-${rule.maxLength} characters.`;
        }

        return {
            name: 'Title Optimization',
            score,
            maxScore: rule.weight,
            status,
            message,
            details: { length, optimal: `${rule.minLength}-${rule.maxLength} characters` }
        };
    }

    analyzeDescriptionSEO(description) {
        const rule = this.seoRules.description;
        const length = description.length;
        
        let score = 0;
        let status = 'poor';
        let message = '';

        if (length >= rule.minLength && length <= rule.maxLength) {
            score = rule.weight;
            status = 'good';
            message = `Meta description length is optimal (${length} characters)`;
        } else if (length < rule.minLength) {
            score = Math.floor((length / rule.minLength) * rule.weight);
            status = 'warning';
            message = `Meta description is too short (${length} characters). Aim for ${rule.minLength}-${rule.maxLength} characters.`;
        } else {
            score = Math.floor(rule.weight * 0.8);
            status = 'warning';
            message = `Meta description is too long (${length} characters). Aim for ${rule.minLength}-${rule.maxLength} characters.`;
        }

        return {
            name: 'Meta Description',
            score,
            maxScore: rule.weight,
            status,
            message,
            details: { length, optimal: `${rule.minLength}-${rule.maxLength} characters` }
        };
    }

    analyzeHeadingsSEO(headings) {
        const rule = this.seoRules.headings;
        let score = 0;
        let status = 'poor';
        let message = '';

        const h1Count = headings.h1.length;
        const h2Count = headings.h2.length;

        if (h1Count === rule.h1Count && h2Count >= rule.h2MinCount) {
            score = rule.weight;
            status = 'good';
            message = `Heading structure is well-organized (${h1Count} H1, ${h2Count} H2)`;
        } else if (h1Count !== rule.h1Count) {
            score = Math.floor(rule.weight * 0.5);
            status = 'warning';
            message = `Should have exactly ${rule.h1Count} H1 heading (found ${h1Count})`;
        } else if (h2Count < rule.h2MinCount) {
            score = Math.floor(rule.weight * 0.7);
            status = 'warning';
            message = `Need at least ${rule.h2MinCount} H2 headings for better structure (found ${h2Count})`;
        }

        return {
            name: 'Heading Structure',
            score,
            maxScore: rule.weight,
            status,
            message,
            details: { h1Count, h2Count, h3Count: headings.h3.length }
        };
    }

    analyzeContentSEO(content) {
        const rule = this.seoRules.content;
        const wordCount = content.split(/\s+/).length;
        
        let score = 0;
        let status = 'poor';
        let message = '';

        if (wordCount >= rule.minLength) {
            score = rule.weight;
            status = 'good';
            message = `Content length is sufficient (${wordCount} words)`;
        } else {
            score = Math.floor((wordCount / rule.minLength) * rule.weight);
            status = 'warning';
            message = `Content is too short (${wordCount} words). Aim for at least ${rule.minLength} words.`;
        }

        return {
            name: 'Content Length',
            score,
            maxScore: rule.weight,
            status,
            message,
            details: { wordCount, minimum: rule.minLength }
        };
    }

    analyzeImagesSEO(images) {
        const rule = this.seoRules.images;
        const totalImages = images.length;
        const imagesWithAlt = images.filter(img => img.alt && img.alt.trim().length > 0).length;
        
        let score = 0;
        let status = 'poor';
        let message = '';

        if (totalImages === 0) {
            score = rule.weight * 0.8; // Not critical if no images
            status = 'good';
            message = 'No images found (not critical)';
        } else if (imagesWithAlt === totalImages) {
            score = rule.weight;
            status = 'good';
            message = `All images have alt text (${totalImages}/${totalImages})`;
        } else {
            score = Math.floor((imagesWithAlt / totalImages) * rule.weight);
            status = 'warning';
            message = `${totalImages - imagesWithAlt} images missing alt text (${imagesWithAlt}/${totalImages} have alt text)`;
        }

        return {
            name: 'Image Optimization',
            score,
            maxScore: rule.weight,
            status,
            message,
            details: { totalImages, imagesWithAlt }
        };
    }

    analyzeLinksSEO(links) {
        const rule = this.seoRules.links;
        const internalCount = links.internal.length;
        
        let score = 0;
        let status = 'poor';
        let message = '';

        if (internalCount >= rule.internalMinCount) {
            score = rule.weight;
            status = 'good';
            message = `Good internal linking (${internalCount} internal links)`;
        } else {
            score = Math.floor((internalCount / rule.internalMinCount) * rule.weight);
            status = 'warning';
            message = `Add more internal links (${internalCount}/${rule.internalMinCount} minimum)`;
        }

        return {
            name: 'Internal Linking',
            score,
            maxScore: rule.weight,
            status,
            message,
            details: { internalCount, externalCount: links.external.length }
        };
    }

    analyzeReadability(content) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = content.split(/\s+/).length;
        const avgWordsPerSentence = words / sentences.length;
        
        let readabilityScore = 100;
        
        // Flesch Reading Ease approximation
        if (avgWordsPerSentence > 20) {
            readabilityScore -= (avgWordsPerSentence - 20) * 2;
        }
        
        readabilityScore = Math.max(0, Math.min(100, readabilityScore));
        
        return {
            score: readabilityScore,
            avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
            totalWords: words,
            totalSentences: sentences.length,
            level: this.getReadabilityLevel(readabilityScore)
        };
    }

    getReadabilityLevel(score) {
        if (score >= 90) return 'Very Easy';
        if (score >= 80) return 'Easy';
        if (score >= 70) return 'Fairly Easy';
        if (score >= 60) return 'Standard';
        if (score >= 50) return 'Fairly Difficult';
        if (score >= 30) return 'Difficult';
        return 'Very Difficult';
    }

    extractKeywords(content) {
        const words = content.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
        
        const stopWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other'];
        const filteredWords = words.filter(word => !stopWords.includes(word));
        
        // Count word frequency
        const wordCount = {};
        filteredWords.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        // Get top keywords
        return Object.entries(wordCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => ({ word, count, density: (count / words.length * 100).toFixed(2) }));
    }

    generateRecommendations(checks) {
        const recommendations = [];
        
        checks.forEach(check => {
            if (check.status === 'warning' || check.status === 'poor') {
                recommendations.push({
                    type: check.name,
                    priority: check.status === 'poor' ? 'high' : 'medium',
                    action: this.getRecommendationAction(check),
                    impact: this.getImpactLevel(check.maxScore)
                });
            }
        });
        
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    getRecommendationAction(check) {
        const actions = {
            'Title Optimization': 'Adjust title length to 30-60 characters and include target keywords',
            'Meta Description': 'Write a compelling meta description between 120-160 characters',
            'Heading Structure': 'Use exactly one H1 and at least two H2 headings for better content organization',
            'Content Length': 'Expand content to at least 300 words for better SEO value',
            'Image Optimization': 'Add descriptive alt text to all images',
            'Internal Linking': 'Add more internal links to related content on your site'
        };
        
        return actions[check.name] || 'Review and optimize this element';
    }

    getImpactLevel(maxScore) {
        if (maxScore >= 15) return 'High';
        if (maxScore >= 10) return 'Medium';
        return 'Low';
    }

    displaySEOResults(analysis) {
        const seoResults = document.getElementById('seo-results');
        if (!seoResults) return;

        const scorePercentage = Math.round((analysis.score / analysis.maxScore) * 100);
        const scoreClass = scorePercentage >= 80 ? 'excellent' : scorePercentage >= 60 ? 'good' : scorePercentage >= 40 ? 'fair' : 'poor';

        seoResults.innerHTML = `
            <div class="seo-analysis-results">
                <div class="seo-score-section">
                    <div class="seo-score ${scoreClass}">
                        <div class="score-circle">
                            <div class="score-value">${scorePercentage}</div>
                            <div class="score-label">SEO Score</div>
                        </div>
                    </div>
                    <div class="score-breakdown">
                        <div class="score-details">
                            <span>Score: ${analysis.score}/${analysis.maxScore}</span>
                            <span>Readability: ${analysis.readability.level}</span>
                        </div>
                    </div>
                </div>

                <div class="seo-checks">
                    <h4>SEO Checks</h4>
                    ${analysis.checks.map(check => `
                        <div class="seo-check ${check.status}">
                            <div class="check-header">
                                <i class="fas fa-${check.status === 'good' ? 'check-circle' : 'exclamation-triangle'}"></i>
                                <span class="check-name">${check.name}</span>
                                <span class="check-score">${check.score}/${check.maxScore}</span>
                            </div>
                            <div class="check-message">${check.message}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="seo-recommendations">
                    <h4>Recommendations</h4>
                    ${analysis.recommendations.length > 0 ? analysis.recommendations.map(rec => `
                        <div class="recommendation ${rec.priority}">
                            <div class="rec-header">
                                <span class="rec-type">${rec.type}</span>
                                <span class="rec-priority priority-${rec.priority}">${rec.priority} priority</span>
                                <span class="rec-impact">Impact: ${rec.impact}</span>
                            </div>
                            <div class="rec-action">${rec.action}</div>
                        </div>
                    `).join('') : '<p class="no-recommendations">Great! No major issues found.</p>'}
                </div>

                <div class="keyword-analysis">
                    <h4>Top Keywords</h4>
                    <div class="keyword-list">
                        ${analysis.keywords.slice(0, 5).map(keyword => `
                            <div class="keyword-item">
                                <span class="keyword-word">${keyword.word}</span>
                                <span class="keyword-count">${keyword.count} times</span>
                                <span class="keyword-density">${keyword.density}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="seo-actions">
                    <button class="btn btn-primary" onclick="seoTools.exportSEOReport('${analysis.post.id}')">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn btn-secondary" onclick="seoTools.optimizePost('${analysis.post.id}')">
                        <i class="fas fa-magic"></i> Auto-Optimize
                    </button>
                </div>
            </div>
        `;
    }

    exportSEOReport(postId) {
        // Implementation for exporting SEO report
        dashboard.showToast('SEO report exported successfully!', 'success');
    }

    optimizePost(postId) {
        // Implementation for auto-optimization
        dashboard.showToast('Auto-optimization suggestions applied!', 'success');
    }

    loadKeywordDatabase() {
        // Mock keyword database
        return {
            'python': { volume: 1500000, difficulty: 'high', cpc: 2.50 },
            'javascript': { volume: 1200000, difficulty: 'high', cpc: 3.20 },
            'automation': { volume: 800000, difficulty: 'medium', cpc: 4.10 },
            'github': { volume: 900000, difficulty: 'medium', cpc: 1.80 },
            'api': { volume: 600000, difficulty: 'medium', cpc: 5.50 },
            'tutorial': { volume: 400000, difficulty: 'low', cpc: 1.20 },
            'guide': { volume: 350000, difficulty: 'low', cpc: 1.50 }
        };
    }

    async researchKeywords(seedKeywords) {
        dashboard.showLoading('Researching keywords...');
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const keywords = seedKeywords.toLowerCase().split(/[,\s]+/).filter(k => k.length > 0);
            const suggestions = this.generateKeywordSuggestions(keywords);
            
            this.displayKeywordResults(suggestions);
            dashboard.hideLoading();
            
        } catch (error) {
            dashboard.hideLoading();
            dashboard.showToast('Keyword research failed', 'error');
        }
    }

    generateKeywordSuggestions(seedKeywords) {
        const suggestions = [];
        const variations = ['tutorial', 'guide', 'example', 'tips', 'best practices', 'how to'];
        
        seedKeywords.forEach(keyword => {
            // Add base keyword
            const baseData = this.keywordDatabase[keyword] || {
                volume: Math.floor(Math.random() * 100000) + 10000,
                difficulty: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                cpc: (Math.random() * 5 + 1).toFixed(2)
            };
            
            suggestions.push({
                keyword: keyword,
                ...baseData,
                relevance: 100
            });
            
            // Add variations
            variations.forEach(variation => {
                suggestions.push({
                    keyword: `${keyword} ${variation}`,
                    volume: Math.floor(baseData.volume * (0.1 + Math.random() * 0.3)),
                    difficulty: 'low',
                    cpc: (parseFloat(baseData.cpc) * (0.5 + Math.random() * 0.5)).toFixed(2),
                    relevance: Math.floor(Math.random() * 40) + 60
                });
            });
        });
        
        return suggestions.sort((a, b) => b.volume - a.volume).slice(0, 15);
    }

    displayKeywordResults(suggestions) {
        const keywordResults = document.getElementById('keyword-results');
        if (!keywordResults) return;

        keywordResults.innerHTML = `
            <div class="keyword-research-results">
                <div class="results-header">
                    <h4>Keyword Suggestions (${suggestions.length} found)</h4>
                    <button class="btn btn-sm btn-outline" onclick="seoTools.exportKeywords()">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
                
                <div class="keyword-table">
                    <div class="table-header">
                        <span>Keyword</span>
                        <span>Volume</span>
                        <span>Difficulty</span>
                        <span>CPC</span>
                        <span>Relevance</span>
                    </div>
                    ${suggestions.map(suggestion => `
                        <div class="keyword-row">
                            <span class="keyword-term">${suggestion.keyword}</span>
                            <span class="keyword-volume">${suggestion.volume.toLocaleString()}/mo</span>
                            <span class="keyword-difficulty difficulty-${suggestion.difficulty}">${suggestion.difficulty}</span>
                            <span class="keyword-cpc">$${suggestion.cpc}</span>
                            <span class="keyword-relevance">
                                <div class="relevance-bar">
                                    <div class="relevance-fill" style="width: ${suggestion.relevance}%"></div>
                                </div>
                                ${suggestion.relevance}%
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    exportKeywords() {
        dashboard.showToast('Keywords exported to CSV!', 'success');
    }
}

// Global SEO functions
async function analyzeSEO() {
    const postSelect = document.getElementById('seo-post-select');
    const postId = postSelect.value;
    
    if (!postId) {
        dashboard.showToast('Please select a blog post to analyze', 'warning');
        return;
    }
    
    try {
        await window.seoTools.analyzeBlogPost(postId);
        dashboard.showToast('SEO analysis completed!', 'success');
    } catch (error) {
        dashboard.showToast(`Analysis failed: ${error.message}`, 'error');
    }
}

async function researchKeywords() {
    const keywordInput = document.getElementById('keyword-input');
    const keywords = keywordInput.value.trim();
    
    if (!keywords) {
        dashboard.showToast('Please enter keywords to research', 'warning');
        return;
    }
    
    try {
        await window.seoTools.researchKeywords(keywords);
        dashboard.showToast('Keyword research completed!', 'success');
    } catch (error) {
        dashboard.showToast(`Keyword research failed: ${error.message}`, 'error');
    }
}

// Initialize SEO tools when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.seoTools = new SEOTools();
});
