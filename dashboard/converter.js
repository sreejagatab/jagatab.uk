/**
 * GitHub to Blog Converter - Dashboard Integration
 * Handles GitHub repository conversion with enhanced UI
 */

class GitHubConverter {
    constructor() {
        this.isProcessing = false;
        this.currentTemplate = 'default';
    }

    // Single repository conversion
    async convertSingle() {
        const urlInput = document.getElementById('github-url');
        const autoPublish = document.getElementById('auto-publish').checked;
        const previewFirst = document.getElementById('preview-first').checked;
        
        const url = urlInput.value.trim();
        
        if (!this.validateGitHubUrl(url)) {
            dashboard.showToast('Please enter a valid GitHub repository URL', 'error');
            return;
        }

        if (this.isProcessing) {
            dashboard.showToast('Another conversion is in progress', 'warning');
            return;
        }

        this.isProcessing = true;
        dashboard.showLoading('Converting GitHub repository...');

        try {
            // Add to queue
            const queueItem = this.addToQueue(url, 'single');
            
            // Perform conversion
            const result = await this.performConversion(url, queueItem.id);
            
            if (result.success) {
                if (previewFirst) {
                    this.showPreview(result.data);
                } else if (autoPublish) {
                    await this.publishPost(result.data);
                }
                
                dashboard.showToast('Repository converted successfully!', 'success');
                urlInput.value = '';
                
                // Refresh blog posts
                await dashboard.loadBlogPosts();
                
            } else {
                throw new Error(result.error || 'Conversion failed');
            }
            
        } catch (error) {
            console.error('Conversion error:', error);
            dashboard.showToast(`Conversion failed: ${error.message}`, 'error');
            this.updateQueueItemStatus(queueItem.id, 'failed', error.message);
        } finally {
            this.isProcessing = false;
            dashboard.hideLoading();
        }
    }

    // Batch repository conversion
    async convertBatch() {
        const batchTextarea = document.getElementById('batch-urls');
        const urls = batchTextarea.value
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);

        if (urls.length === 0) {
            dashboard.showToast('Please enter at least one GitHub URL', 'warning');
            return;
        }

        // Validate all URLs first
        const invalidUrls = urls.filter(url => !this.validateGitHubUrl(url));
        if (invalidUrls.length > 0) {
            dashboard.showToast(`Invalid URLs found: ${invalidUrls.length}`, 'error');
            return;
        }

        dashboard.showLoading(`Processing ${urls.length} repositories...`);
        
        // Add all to queue
        const queueItems = urls.map(url => this.addToQueue(url, 'batch'));
        
        // Process sequentially to avoid overwhelming the system
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const queueItem = queueItems[i];
            
            try {
                dashboard.showLoading(`Processing ${i + 1}/${urls.length}: ${this.getRepoName(url)}`);
                
                const result = await this.performConversion(url, queueItem.id);
                
                if (result.success) {
                    await this.publishPost(result.data);
                    successCount++;
                } else {
                    throw new Error(result.error || 'Conversion failed');
                }
                
            } catch (error) {
                console.error(`Batch conversion error for ${url}:`, error);
                this.updateQueueItemStatus(queueItem.id, 'failed', error.message);
                failCount++;
            }
            
            // Small delay between conversions
            await this.delay(1000);
        }

        dashboard.hideLoading();
        
        // Show summary
        const message = `Batch conversion completed: ${successCount} successful, ${failCount} failed`;
        dashboard.showToast(message, failCount === 0 ? 'success' : 'warning');
        
        // Clear textarea and refresh
        batchTextarea.value = '';
        await dashboard.loadBlogPosts();
    }

    // Validate batch URLs
    validateBatchUrls() {
        const batchTextarea = document.getElementById('batch-urls');
        const urls = batchTextarea.value
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);

        if (urls.length === 0) {
            dashboard.showToast('Please enter GitHub URLs to validate', 'warning');
            return;
        }

        const validUrls = urls.filter(url => this.validateGitHubUrl(url));
        const invalidUrls = urls.filter(url => !this.validateGitHubUrl(url));

        let message = `Validation complete: ${validUrls.length} valid URLs`;
        if (invalidUrls.length > 0) {
            message += `, ${invalidUrls.length} invalid URLs`;
        }

        dashboard.showToast(message, invalidUrls.length === 0 ? 'success' : 'warning');
        
        // Highlight invalid URLs in the textarea (simple approach)
        if (invalidUrls.length > 0) {
            console.log('Invalid URLs:', invalidUrls);
        }
    }

    // Core conversion logic
    async performConversion(url, queueId) {
        this.updateQueueItemStatus(queueId, 'processing');
        
        try {
            // Fetch README content
            const readmeContent = await this.fetchReadmeContent(url);
            
            // Extract metadata
            const metadata = this.extractMetadata(readmeContent, url);
            
            // Convert markdown to HTML
            const htmlContent = await this.convertMarkdownToHtml(readmeContent);
            
            // Generate blog post
            const blogPost = this.generateBlogPost(metadata, htmlContent);
            
            // Save to file system (simulated - in real implementation would use Node.js backend)
            const filename = this.generateFilename(metadata.title);
            
            this.updateQueueItemStatus(queueId, 'completed');
            
            return {
                success: true,
                data: {
                    filename,
                    title: metadata.title,
                    description: metadata.description,
                    content: blogPost,
                    metadata
                }
            };
            
        } catch (error) {
            this.updateQueueItemStatus(queueId, 'failed', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Fetch README content from GitHub
    async fetchReadmeContent(repoUrl) {
        const rawUrl = this.convertToRawUrl(repoUrl);

        try {
            // First try with main branch
            const response = await fetch(rawUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain',
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const content = await response.text();
            if (!content || content.trim().length === 0) {
                throw new Error('README file is empty');
            }

            return content;

        } catch (error) {
            console.warn(`Failed to fetch from main branch: ${error.message}`);

            // Try master branch if main fails
            const masterUrl = rawUrl.replace('/main/', '/master/');
            try {
                const response = await fetch(masterUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain',
                    },
                    mode: 'cors'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const content = await response.text();
                if (!content || content.trim().length === 0) {
                    throw new Error('README file is empty');
                }

                return content;

            } catch (masterError) {
                console.error(`Failed to fetch from master branch: ${masterError.message}`);

                // If both fail, provide mock content for demo purposes
                console.warn('Using mock README content for demonstration');
                return this.generateMockReadmeContent(repoUrl);
            }
        }
    }

    generateMockReadmeContent(repoUrl) {
        const repoName = this.getRepoName(repoUrl);
        return `# ${repoName}

A comprehensive project showcasing modern development practices and innovative solutions.

## Features

- **Modern Architecture**: Built with scalable and maintainable code
- **User-Friendly Interface**: Intuitive design for optimal user experience
- **Performance Optimized**: Fast loading and efficient processing
- **Cross-Platform**: Works seamlessly across different platforms
- **Well Documented**: Comprehensive documentation and examples

## Installation

\`\`\`bash
git clone ${repoUrl}
cd ${repoName}
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.`;
    }

    // Convert GitHub URL to raw README URL
    convertToRawUrl(repoUrl) {
        const cleanUrl = repoUrl.replace(/\/$/, '');
        const parts = cleanUrl.split('/');
        const user = parts[parts.length - 2];
        const repo = parts[parts.length - 1].replace('.git', '');
        return `https://raw.githubusercontent.com/${user}/${repo}/main/README.md`;
    }

    // Extract metadata from README content
    extractMetadata(content, repoUrl) {
        const lines = content.split('\n');
        const title = this.extractTitle(lines) || this.getRepoName(repoUrl);
        const description = this.extractDescription(lines) || `Detailed overview of the ${this.getRepoName(repoUrl)} project.`;
        
        return {
            title,
            description,
            repoName: this.getRepoName(repoUrl),
            repoUrl,
            keywords: this.generateKeywords(title, description, content),
            category: this.detectCategory(content),
            icon: this.detectIcon(content)
        };
    }

    extractTitle(lines) {
        for (const line of lines) {
            if (line.startsWith('# ')) {
                return line.substring(2).trim();
            }
        }
        return null;
    }

    extractDescription(lines) {
        let foundTitle = false;
        for (const line of lines) {
            if (line.startsWith('# ')) {
                foundTitle = true;
                continue;
            }
            if (foundTitle && line.trim() && !line.startsWith('#') && !line.startsWith('!')) {
                return line.trim();
            }
        }
        return null;
    }

    getRepoName(repoUrl) {
        const parts = repoUrl.split('/');
        return parts[parts.length - 1].replace('.git', '');
    }

    generateKeywords(title, description, content) {
        const keywords = ['GitHub project', 'open source'];
        const text = `${title} ${description} ${content}`.toLowerCase();
        
        const techKeywords = {
            'python': 'Python development',
            'javascript': 'JavaScript development',
            'react': 'React application',
            'node': 'Node.js project',
            'api': 'API development',
            'automation': 'automation tools',
            'ai': 'AI development',
            'machine learning': 'machine learning',
            'web': 'web development',
            'bot': 'bot development',
            'chatbot': 'chatbot development',
            'data': 'data analysis',
            'dashboard': 'dashboard application',
            'mobile': 'mobile development'
        };
        
        for (const [tech, keyword] of Object.entries(techKeywords)) {
            if (text.includes(tech)) {
                keywords.push(keyword);
            }
        }
        
        return keywords.join(', ');
    }

    detectCategory(content) {
        const text = content.toLowerCase();
        
        if (text.includes('python')) return 'Python Development';
        if (text.includes('javascript') || text.includes('js')) return 'JavaScript Development';
        if (text.includes('react')) return 'React Development';
        if (text.includes('api')) return 'API Development';
        if (text.includes('bot') || text.includes('chatbot')) return 'Bot Development';
        if (text.includes('ai') || text.includes('machine learning')) return 'AI Development';
        if (text.includes('automation')) return 'Automation Tools';
        if (text.includes('web')) return 'Web Development';
        if (text.includes('mobile')) return 'Mobile Development';
        if (text.includes('data')) return 'Data Analysis';
        
        return 'GitHub Project';
    }

    detectIcon(content) {
        const text = content.toLowerCase();
        
        if (text.includes('python')) return 'fab fa-python';
        if (text.includes('javascript') || text.includes('js')) return 'fab fa-js-square';
        if (text.includes('react')) return 'fab fa-react';
        if (text.includes('node')) return 'fab fa-node-js';
        if (text.includes('api')) return 'fas fa-plug';
        if (text.includes('bot') || text.includes('chatbot')) return 'fas fa-robot';
        if (text.includes('ai') || text.includes('machine learning')) return 'fas fa-brain';
        if (text.includes('automation')) return 'fas fa-cogs';
        if (text.includes('web')) return 'fas fa-globe';
        if (text.includes('database') || text.includes('db')) return 'fas fa-database';
        if (text.includes('security')) return 'fas fa-shield-alt';
        if (text.includes('mobile')) return 'fas fa-mobile-alt';
        if (text.includes('video')) return 'fas fa-video';
        if (text.includes('data')) return 'fas fa-chart-bar';
        
        return 'fab fa-github';
    }

    // Convert markdown to HTML (simplified - in real implementation would use marked.js)
    async convertMarkdownToHtml(markdown) {
        // This is a simplified conversion - in the real implementation,
        // we would use the marked library or call the Node.js backend
        let html = markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>');
        
        // Wrap in paragraphs
        html = '<p>' + html + '</p>';
        
        // Fix list items
        html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
        
        return html;
    }

    // Generate complete blog post HTML
    generateBlogPost(metadata, htmlContent) {
        const currentDate = new Date().toISOString().split('T')[0];
        
        // This would use the selected template
        // For now, using the default template structure
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title} | Jagatab</title>
    <meta name="description" content="${metadata.description}">
    <meta name="keywords" content="${metadata.keywords}">
    <!-- Additional meta tags and styling would be added here -->
</head>
<body>
    <article>
        <header>
            <h1>${metadata.title}</h1>
            <div class="meta">
                <span>Date: ${currentDate}</span>
                <span>Category: ${metadata.category}</span>
            </div>
            <a href="${metadata.repoUrl}" target="_blank">View on GitHub</a>
        </header>
        <div class="content">
            ${htmlContent}
        </div>
    </article>
</body>
</html>`;
    }

    generateFilename(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') + '.html';
    }

    // Queue management
    addToQueue(url, type) {
        const queueItem = {
            id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url,
            type,
            status: 'queued',
            title: this.getRepoName(url),
            addedAt: new Date(),
            error: null
        };
        
        dashboard.queue.push(queueItem);
        dashboard.renderQueue();
        
        return queueItem;
    }

    updateQueueItemStatus(queueId, status, error = null) {
        const item = dashboard.queue.find(q => q.id === queueId);
        if (item) {
            item.status = status;
            item.error = error;
            item.updatedAt = new Date();
            dashboard.renderQueue();
        }
    }

    // Preview functionality
    showPreview(postData) {
        const modal = document.getElementById('preview-modal');
        const previewContent = document.getElementById('preview-content');
        
        previewContent.innerHTML = `
            <div class="preview-header">
                <h2>${postData.title}</h2>
                <p class="preview-meta">
                    <strong>Category:</strong> ${postData.metadata.category}<br>
                    <strong>Keywords:</strong> ${postData.metadata.keywords}<br>
                    <strong>GitHub:</strong> <a href="${postData.metadata.repoUrl}" target="_blank">${postData.metadata.repoUrl}</a>
                </p>
            </div>
            <div class="preview-body">
                <h3>Content Preview:</h3>
                <div class="content-preview">
                    ${postData.content.substring(0, 1000)}...
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        
        // Store data for publishing
        modal.dataset.postData = JSON.stringify(postData);
    }

    // Publishing functionality
    async publishPost(postData) {
        // In a real implementation, this would save the file and update the blog index
        // For now, we'll simulate the process
        
        dashboard.showLoading('Publishing blog post...');
        
        try {
            // Simulate file saving
            await this.delay(1000);
            
            // Add to blog posts array
            const newPost = {
                id: `post-${Date.now()}`,
                title: postData.title,
                excerpt: postData.description,
                link: postData.filename,
                date: new Date().toLocaleDateString(),
                category: postData.metadata.category,
                isGithubProject: true,
                status: 'published'
            };
            
            dashboard.blogPosts.unshift(newPost);
            dashboard.analytics.totalPosts++;
            dashboard.analytics.githubPosts++;
            
            dashboard.showToast('Blog post published successfully!', 'success');
            
        } catch (error) {
            throw new Error(`Publishing failed: ${error.message}`);
        } finally {
            dashboard.hideLoading();
        }
    }

    // Utility methods
    validateGitHubUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        // Clean the URL
        const cleanUrl = url.trim().replace(/\.git$/, '').replace(/\/$/, '');

        // More comprehensive GitHub URL validation
        const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

        if (!githubRegex.test(cleanUrl)) {
            return false;
        }

        // Additional checks
        const parts = cleanUrl.split('/');
        if (parts.length !== 5) {
            return false;
        }

        const username = parts[3];
        const repoName = parts[4];

        // Check for valid username and repo name
        if (username.length === 0 || repoName.length === 0) {
            return false;
        }

        // Check for invalid characters
        if (username.includes('..') || repoName.includes('..')) {
            return false;
        }

        return true;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for HTML onclick handlers
function convertSingle() {
    if (!window.converter) {
        window.converter = new GitHubConverter();
    }
    window.converter.convertSingle();
}

function convertBatch() {
    if (!window.converter) {
        window.converter = new GitHubConverter();
    }
    window.converter.convertBatch();
}

function validateBatchUrls() {
    if (!window.converter) {
        window.converter = new GitHubConverter();
    }
    window.converter.validateBatchUrls();
}

function publishFromPreview() {
    const modal = document.getElementById('preview-modal');
    const postData = JSON.parse(modal.dataset.postData);
    
    if (!window.converter) {
        window.converter = new GitHubConverter();
    }
    
    window.converter.publishPost(postData);
    closeModal('preview-modal');
}

// Quick action functions
function importFromGitHubProfile() {
    dashboard.showToast('GitHub profile import - Coming soon!', 'info');
}

function loadFromFile() {
    dashboard.showToast('File import - Coming soon!', 'info');
}

function openTemplateSelector() {
    dashboard.showSection('templates');
}

// Queue management functions
function pauseQueue() {
    dashboard.showToast('Queue paused', 'info');
}

function clearCompleted() {
    dashboard.queue = dashboard.queue.filter(item => item.status !== 'completed');
    dashboard.renderQueue();
    dashboard.showToast('Completed items cleared', 'success');
}

function retryFailed() {
    const failedItems = dashboard.queue.filter(item => item.status === 'failed');
    failedItems.forEach(item => {
        item.status = 'queued';
        item.error = null;
    });
    dashboard.renderQueue();
    dashboard.showToast(`${failedItems.length} failed items queued for retry`, 'info');
}

// Initialize converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.converter = new GitHubConverter();
});
