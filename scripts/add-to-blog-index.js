#!/usr/bin/env node

/**
 * Add Blog Post to Index
 * Automatically adds a new blog post to the blog index page
 */

const fs = require('fs');
const path = require('path');

class BlogIndexUpdater {
    constructor() {
        this.blogIndexPath = path.join(__dirname, '..', 'blog', 'index.html');
    }

    /**
     * Add a new blog post to the index
     */
    addPostToIndex(postData) {
        try {
            // Read the current blog index
            const indexContent = fs.readFileSync(this.blogIndexPath, 'utf8');
            
            // Generate the new blog card HTML
            const newBlogCard = this.generateBlogCard(postData);
            
            // Find the insertion point (after the first blog card)
            const insertionPoint = indexContent.indexOf('</article>') + '</article>'.length;
            
            if (insertionPoint === -1) {
                throw new Error('Could not find insertion point in blog index');
            }
            
            // Insert the new blog card
            const updatedContent = 
                indexContent.slice(0, insertionPoint) + 
                '\n\n                ' + newBlogCard + 
                indexContent.slice(insertionPoint);
            
            // Write the updated content back
            fs.writeFileSync(this.blogIndexPath, updatedContent, 'utf8');
            
            console.log('✅ Blog post added to index successfully!');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to add post to index:', error.message);
            return false;
        }
    }

    /**
     * Generate HTML for a blog card
     */
    generateBlogCard(postData) {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Determine icon based on content
        const icon = this.getIconForPost(postData);
        const category = this.getCategoryForPost(postData);

        return `<!-- GitHub Project Blog Post -->
                <article class="blog-card">
                    <div class="blog-image">
                        <i class="${icon}"></i>
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span><i class="fas fa-calendar"></i> ${currentDate}</span>
                            <span><i class="fas fa-user"></i> Sree Jagatab</span>
                            <span><i class="fas fa-tag"></i> ${category}</span>
                        </div>
                        <h2 class="blog-title">${postData.title}</h2>
                        <p class="blog-excerpt">${postData.description}</p>
                        <a href="${postData.filename}" class="read-more">
                            View Project Details <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </article>`;
    }

    /**
     * Get appropriate icon based on post content
     */
    getIconForPost(postData) {
        const title = postData.title.toLowerCase();
        const description = postData.description.toLowerCase();
        const content = `${title} ${description}`;

        if (content.includes('python')) return 'fab fa-python';
        if (content.includes('javascript') || content.includes('js')) return 'fab fa-js-square';
        if (content.includes('react')) return 'fab fa-react';
        if (content.includes('node')) return 'fab fa-node-js';
        if (content.includes('api')) return 'fas fa-plug';
        if (content.includes('bot') || content.includes('chatbot')) return 'fas fa-robot';
        if (content.includes('ai') || content.includes('machine learning')) return 'fas fa-brain';
        if (content.includes('automation')) return 'fas fa-cogs';
        if (content.includes('web')) return 'fas fa-globe';
        if (content.includes('database') || content.includes('db')) return 'fas fa-database';
        if (content.includes('security')) return 'fas fa-shield-alt';
        if (content.includes('mobile')) return 'fas fa-mobile-alt';
        
        return 'fab fa-github'; // Default GitHub icon
    }

    /**
     * Get appropriate category based on post content
     */
    getCategoryForPost(postData) {
        const title = postData.title.toLowerCase();
        const description = postData.description.toLowerCase();
        const content = `${title} ${description}`;

        if (content.includes('python')) return 'Python Development';
        if (content.includes('javascript') || content.includes('js')) return 'JavaScript Development';
        if (content.includes('react')) return 'React Development';
        if (content.includes('api')) return 'API Development';
        if (content.includes('bot') || content.includes('chatbot')) return 'Bot Development';
        if (content.includes('ai') || content.includes('machine learning')) return 'AI Development';
        if (content.includes('automation')) return 'Automation Tools';
        if (content.includes('web')) return 'Web Development';
        if (content.includes('mobile')) return 'Mobile Development';
        
        return 'GitHub Project';
    }

    /**
     * Extract post data from a blog HTML file
     */
    extractPostDataFromFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract title from HTML
            const titleMatch = content.match(/<title>(.*?)\s*\|\s*Jagatab<\/title>/);
            const title = titleMatch ? titleMatch[1] : 'Untitled Project';
            
            // Extract description from meta tag
            const descMatch = content.match(/<meta name="description" content="(.*?)"/);
            const description = descMatch ? descMatch[1] : 'Project description not available.';
            
            // Get filename
            const filename = path.basename(filePath);
            
            return {
                title,
                description,
                filename
            };
            
        } catch (error) {
            throw new Error(`Failed to extract post data: ${error.message}`);
        }
    }
}

// CLI Usage
if (require.main === module) {
    const updater = new BlogIndexUpdater();
    const blogFilePath = process.argv[2];
    
    if (!blogFilePath) {
        console.log('Usage: node add-to-blog-index.js <blog-post-file-path>');
        console.log('Example: node add-to-blog-index.js blog/my-project.html');
        process.exit(1);
    }
    
    try {
        // Check if file exists
        if (!fs.existsSync(blogFilePath)) {
            console.error('❌ Blog post file not found:', blogFilePath);
            process.exit(1);
        }
        
        // Extract post data and add to index
        const postData = updater.extractPostDataFromFile(blogFilePath);
        const success = updater.addPostToIndex(postData);
        
        if (success) {
            console.log('\n🎉 Blog post successfully added to index!');
            console.log(`📝 Title: ${postData.title}`);
            console.log(`🔗 File: ${postData.filename}`);
            console.log('\nYour blog index has been updated automatically.');
        } else {
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

module.exports = BlogIndexUpdater;
