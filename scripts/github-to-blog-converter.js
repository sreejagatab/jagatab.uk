#!/usr/bin/env node

/**
 * GitHub README to Blog Post Converter
 * Converts GitHub README.md files to HTML blog posts following the site's format
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { marked } = require('marked');

class GitHubToBlogConverter {
    constructor() {
        this.blogDir = path.join(__dirname, '..', 'blog');
        this.setupMarked();
    }

    setupMarked() {
        // Configure marked for better HTML output
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });
    }

    /**
     * Fetch README content from GitHub
     */
    async fetchGitHubReadme(repoUrl) {
        // Convert GitHub repo URL to raw README URL
        const rawUrl = await this.convertToRawUrl(repoUrl);

        return new Promise((resolve, reject) => {
            https.get(rawUrl, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    if (response.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(new Error(`Failed to fetch README: ${response.statusCode}`));
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * Convert GitHub repo URL to raw README URL
     */
    async convertToRawUrl(repoUrl) {
        // Handle different GitHub URL formats
        let cleanUrl = repoUrl.replace(/\/$/, ''); // Remove trailing slash

        if (cleanUrl.includes('github.com')) {
            // Convert https://github.com/user/repo to raw URL
            const parts = cleanUrl.split('/');
            const user = parts[parts.length - 2];
            const repo = parts[parts.length - 1];

            // Try main branch first, then master
            const branches = ['main', 'master'];
            for (const branch of branches) {
                const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/README.md`;
                try {
                    await this.testUrl(url);
                    return url;
                } catch (error) {
                    continue;
                }
            }
            throw new Error('README.md not found in main or master branch');
        }

        throw new Error('Invalid GitHub URL format');
    }

    /**
     * Test if URL is accessible
     */
    testUrl(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (response) => {
                if (response.statusCode === 200) {
                    resolve(true);
                } else {
                    reject(new Error(`Status: ${response.statusCode}`));
                }
                response.destroy(); // Don't download content, just test
            }).on('error', reject);
        });
    }

    /**
     * Extract metadata from README content
     */
    extractMetadata(content, repoUrl) {
        const lines = content.split('\n');
        const title = this.extractTitle(lines);
        const description = this.extractDescription(lines);
        const repoName = this.extractRepoName(repoUrl);
        
        return {
            title: title || `${repoName} - Project Overview`,
            description: description || `Detailed overview of the ${repoName} project with implementation details and usage instructions.`,
            repoName,
            repoUrl,
            keywords: this.generateKeywords(title, description, repoName),
            filename: this.generateFilename(title, repoName)
        };
    }

    extractTitle(lines) {
        // Look for the first H1 heading
        for (const line of lines) {
            if (line.startsWith('# ')) {
                return line.substring(2).trim();
            }
        }
        return null;
    }

    extractDescription(lines) {
        // Look for the first paragraph after title
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

    extractRepoName(repoUrl) {
        const parts = repoUrl.split('/');
        return parts[parts.length - 1].replace('.git', '');
    }

    generateKeywords(title, description, repoName) {
        const keywords = [repoName, 'GitHub project', 'open source'];
        
        // Add technology keywords based on common patterns
        const content = `${title} ${description}`.toLowerCase();
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
            'chatbot': 'chatbot development'
        };
        
        for (const [tech, keyword] of Object.entries(techKeywords)) {
            if (content.includes(tech)) {
                keywords.push(keyword);
            }
        }
        
        return keywords.join(', ');
    }

    generateFilename(title, repoName) {
        const baseTitle = title || repoName;
        return baseTitle
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') + '.html';
    }

    /**
     * Convert markdown to HTML and enhance for blog format
     */
    convertMarkdownToHtml(markdown) {
        let html = marked(markdown);
        
        // Enhance code blocks with syntax highlighting classes
        html = html.replace(/<pre><code class="language-(\w+)">/g, '<pre class="language-$1"><code class="language-$1">');
        html = html.replace(/<pre><code>/g, '<pre class="language-text"><code>');
        
        // Add responsive classes to images
        html = html.replace(/<img /g, '<img class="blog-image" ');
        
        // Enhance tables
        html = html.replace(/<table>/g, '<div class="table-container"><table class="blog-table">');
        html = html.replace(/<\/table>/g, '</table></div>');
        
        return html;
    }

    /**
     * Generate complete blog post HTML
     */
    generateBlogPost(metadata, htmlContent) {
        const currentDate = new Date().toISOString().split('T')[0];
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title} | Jagatab</title>
    <meta name="description" content="${metadata.description}">
    <meta name="keywords" content="${metadata.keywords}">
    <link rel="canonical" href="https://jagatab.uk/blog/${metadata.filename}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${metadata.title}">
    <meta property="og:description" content="${metadata.description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://jagatab.uk/blog/${metadata.filename}">
    
    <!-- Article Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${metadata.title}",
        "description": "${metadata.description}",
        "author": {
            "@type": "Person",
            "name": "Sree Jagatab",
            "url": "https://jagatab.uk"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Jagatab.UK",
            "logo": {
                "@type": "ImageObject",
                "url": "https://jagatab.uk/logo.png"
            }
        },
        "datePublished": "${currentDate}",
        "dateModified": "${currentDate}",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://jagatab.uk/blog/${metadata.filename}"
        }
    }
    </script>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Prism.js for syntax highlighting -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">
    
    <style>
        :root {
            --primary-color: #1e40af;
            --secondary-color: #3b82f6;
            --accent-color: #10b981;
            --text-dark: #1f2937;
            --text-light: #6b7280;
            --background-light: #f8fafc;
            --white: #ffffff;
            --border-color: #e5e7eb;
            --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
            --border-radius: 8px;
            --border-radius-lg: 12px;
            --transition: all 0.3s ease;
            --font-primary: 'Inter', sans-serif;
            --font-heading: 'Poppins', sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-primary);
            line-height: 1.6;
            color: var(--text-dark);
            background-color: var(--white);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        /* Header */
        .header {
            background: var(--white);
            box-shadow: var(--shadow);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }

        .logo {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }

        .nav-links a {
            color: var(--text-dark);
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
        }

        .nav-links a:hover {
            color: var(--primary-color);
        }

        /* Article */
        .article {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            background: var(--white);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow);
        }

        .article-header {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--border-color);
        }

        .article-title {
            font-family: var(--font-heading);
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 1rem;
            line-height: 1.2;
        }

        .article-meta {
            display: flex;
            gap: 1rem;
            color: var(--text-light);
            font-size: 0.9rem;
        }

        .article-meta span {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .github-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--primary-color);
            color: var(--white);
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
            text-decoration: none;
            font-weight: 500;
            margin: 1rem 0;
            transition: var(--transition);
        }

        .github-link:hover {
            background: var(--secondary-color);
        }

        /* Content Styling */
        .article-content {
            font-size: 1.1rem;
            line-height: 1.8;
        }

        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
            font-family: var(--font-heading);
            margin: 2rem 0 1rem 0;
            color: var(--text-dark);
        }

        .article-content h1 { font-size: 2rem; }
        .article-content h2 { font-size: 1.75rem; }
        .article-content h3 { font-size: 1.5rem; }
        .article-content h4 { font-size: 1.25rem; }

        .article-content p {
            margin-bottom: 1.5rem;
        }

        .article-content ul,
        .article-content ol {
            margin: 1rem 0 1.5rem 2rem;
        }

        .article-content li {
            margin-bottom: 0.5rem;
        }

        .article-content pre {
            background: #2d3748;
            border-radius: var(--border-radius);
            padding: 1.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
        }

        .article-content code {
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.9rem;
        }

        .article-content p code {
            background: var(--background-light);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            color: var(--primary-color);
        }

        .blog-image {
            max-width: 100%;
            height: auto;
            border-radius: var(--border-radius);
            margin: 1.5rem 0;
            box-shadow: var(--shadow);
        }

        .table-container {
            overflow-x: auto;
            margin: 1.5rem 0;
        }

        .blog-table {
            width: 100%;
            border-collapse: collapse;
            background: var(--white);
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow);
        }

        .blog-table th,
        .blog-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        .blog-table th {
            background: var(--background-light);
            font-weight: 600;
            color: var(--text-dark);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .container {
                padding: 0 1rem;
            }
            
            .article {
                margin: 1rem;
                padding: 1.5rem;
            }
            
            .article-title {
                font-size: 2rem;
            }
            
            .nav-links {
                display: none;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="../index.html" class="logo">Jagatab.UK</a>
            <ul class="nav-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../services/python-automation-scripts.html">Services</a></li>
                <li><a href="../projects.html">Repositories</a></li>
                <li><a href="../blog/index.html">Blog</a></li>
                <li><a href="../index.html#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main class="container">
        <article class="article">
            <header class="article-header">
                <h1 class="article-title">${metadata.title}</h1>
                <div class="article-meta">
                    <span><i class="fas fa-calendar"></i> ${currentDate}</span>
                    <span><i class="fas fa-user"></i> Sree Jagatab</span>
                    <span><i class="fas fa-tag"></i> GitHub Project</span>
                </div>
                <a href="${metadata.repoUrl}" class="github-link" target="_blank" rel="noopener">
                    <i class="fab fa-github"></i>
                    View on GitHub
                </a>
            </header>
            
            <div class="article-content">
                ${htmlContent}
            </div>
        </article>
    </main>

    <!-- Prism.js for syntax highlighting -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
</body>
</html>`;
    }

    /**
     * Convert GitHub README to blog post
     */
    async convertToBlogPost(repoUrl) {
        try {
            console.log(`Fetching README from: ${repoUrl}`);
            const markdownContent = await this.fetchGitHubReadme(repoUrl);
            
            console.log('Extracting metadata...');
            const metadata = this.extractMetadata(markdownContent, repoUrl);
            
            console.log('Converting markdown to HTML...');
            const htmlContent = this.convertMarkdownToHtml(markdownContent);
            
            console.log('Generating blog post...');
            const blogPostHtml = this.generateBlogPost(metadata, htmlContent);
            
            const outputPath = path.join(this.blogDir, metadata.filename);
            fs.writeFileSync(outputPath, blogPostHtml, 'utf8');
            
            console.log(`✅ Blog post created: ${outputPath}`);
            console.log(`📝 Title: ${metadata.title}`);
            console.log(`🔗 Filename: ${metadata.filename}`);
            
            return {
                success: true,
                metadata,
                outputPath
            };
            
        } catch (error) {
            console.error('❌ Conversion failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// CLI Usage
if (require.main === module) {
    const converter = new GitHubToBlogConverter();
    const repoUrl = process.argv[2];
    
    if (!repoUrl) {
        console.log('Usage: node github-to-blog-converter.js <github-repo-url>');
        console.log('Example: node github-to-blog-converter.js https://github.com/username/repository');
        process.exit(1);
    }
    
    converter.convertToBlogPost(repoUrl)
        .then(result => {
            if (result.success) {
                console.log('\n🎉 Conversion completed successfully!');
                console.log('\nNext steps:');
                console.log('1. Review the generated blog post');
                console.log('2. Add it to your blog index page');
                console.log('3. Update your sitemap if needed');
            } else {
                console.log('\n❌ Conversion failed');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = GitHubToBlogConverter;
