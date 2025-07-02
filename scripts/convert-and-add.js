#!/usr/bin/env node

/**
 * Convert GitHub README to Blog Post and Add to Index
 * One-command solution to convert and add to blog index
 */

const GitHubToBlogConverter = require('./github-to-blog-converter');
const BlogIndexUpdater = require('./add-to-blog-index');

async function convertAndAdd(repoUrl) {
    console.log('🚀 Starting GitHub to Blog conversion process...\n');
    
    // Step 1: Convert README to blog post
    const converter = new GitHubToBlogConverter();
    const conversionResult = await converter.convertToBlogPost(repoUrl);
    
    if (!conversionResult.success) {
        console.error('❌ Conversion failed, stopping process');
        return false;
    }
    
    console.log('\n📝 Conversion completed, now adding to blog index...\n');
    
    // Step 2: Add to blog index
    const updater = new BlogIndexUpdater();
    const postData = {
        title: conversionResult.metadata.title,
        description: conversionResult.metadata.description,
        filename: conversionResult.metadata.filename
    };
    
    const indexSuccess = updater.addPostToIndex(postData);
    
    if (indexSuccess) {
        console.log('\n🎉 Complete! Your GitHub README has been converted to a blog post and added to your blog index.');
        console.log('\n📋 Summary:');
        console.log(`   📝 Title: ${postData.title}`);
        console.log(`   🔗 File: blog/${postData.filename}`);
        console.log(`   📊 GitHub: ${repoUrl}`);
        console.log('\n✅ Next steps:');
        console.log('   1. Review the generated blog post');
        console.log('   2. Customize content if needed');
        console.log('   3. Update sitemap.xml if required');
        console.log('   4. Test the new blog post in your browser');
        
        return true;
    } else {
        console.log('\n⚠️  Blog post was created but failed to add to index.');
        console.log('   You can manually add it to blog/index.html');
        return false;
    }
}

// CLI Usage
if (require.main === module) {
    const repoUrl = process.argv[2];
    
    if (!repoUrl) {
        console.log('🔧 GitHub README to Blog Converter');
        console.log('=====================================\n');
        console.log('Usage: node convert-and-add.js <github-repo-url>');
        console.log('\nExamples:');
        console.log('  node convert-and-add.js https://github.com/username/awesome-project');
        console.log('  node convert-and-add.js https://github.com/username/python-automation-tool');
        console.log('\nThis will:');
        console.log('  ✓ Fetch the README.md from GitHub');
        console.log('  ✓ Convert it to a styled HTML blog post');
        console.log('  ✓ Add it to your blog index automatically');
        console.log('  ✓ Include proper SEO metadata');
        process.exit(1);
    }
    
    convertAndAdd(repoUrl)
        .then(success => {
            if (!success) {
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('❌ Unexpected error:', error.message);
            process.exit(1);
        });
}

module.exports = convertAndAdd;
