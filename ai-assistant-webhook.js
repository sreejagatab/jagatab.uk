/**
 * AI Assistant Webhook Handler for Contact Form Submissions
 * This script processes contact form submissions and sends notifications to AI assistant
 */

// Configuration
const CONFIG = {
    AI_ASSISTANT_EMAIL: 'ai-assistant@jagatabuk.com',
    SMTP_CONFIG: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER || 'sreejagatab@yahoo.com',
            pass: process.env.SMTP_PASS || 'your-app-password'
        }
    },
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'your-webhook-secret'
};

// Email templates
const EMAIL_TEMPLATES = {
    aiNotification: (data) => ({
        subject: `🤖 AI Analysis Required: New Contact Form Submission - ${data.service || 'General Inquiry'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2 style="margin: 0;">🤖 New Contact Form Submission</h2>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">AI Analysis and Response Required</p>
                </div>
                
                <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
                    <h3 style="color: #1f2937; margin-top: 0;">Contact Information</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${data.name || 'Not provided'}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${data.email || 'Not provided'}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${data.phone || 'Not provided'}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Company:</td><td>${data.company || 'Not provided'}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Service Interest:</td><td>${data.service || 'General Inquiry'}</td></tr>
                    </table>
                </div>
                
                <div style="background: white; padding: 20px; border: 1px solid #e5e7eb;">
                    <h3 style="color: #1f2937; margin-top: 0;">Message Content</h3>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
                        <p style="margin: 0; line-height: 1.6;">${data.message || 'No message provided'}</p>
                    </div>
                </div>
                
                <div style="background: #fef3c7; padding: 20px; border: 1px solid #f59e0b;">
                    <h3 style="color: #92400e; margin-top: 0;">🤖 AI Analysis Tasks</h3>
                    <ul style="color: #92400e; margin: 0;">
                        <li>Categorize inquiry type (consultation, quote, support, technical)</li>
                        <li>Identify service requirements and project complexity</li>
                        <li>Assess urgency level and recommended response time</li>
                        <li>Generate personalized response suggestions</li>
                        <li>Identify upselling or cross-selling opportunities</li>
                        <li>Flag any technical requirements or special considerations</li>
                    </ul>
                </div>
                
                <div style="background: #dbeafe; padding: 20px; border: 1px solid #3b82f6;">
                    <h3 style="color: #1e40af; margin-top: 0;">📊 Submission Metadata</h3>
                    <table style="width: 100%; border-collapse: collapse; color: #1e40af;">
                        <tr><td style="padding: 4px 0; font-weight: bold;">Timestamp:</td><td>${data.timestamp || new Date().toISOString()}</td></tr>
                        <tr><td style="padding: 4px 0; font-weight: bold;">Source Page:</td><td>${data.page_url || 'Unknown'}</td></tr>
                        <tr><td style="padding: 4px 0; font-weight: bold;">User Agent:</td><td style="font-size: 12px;">${data.user_agent || 'Unknown'}</td></tr>
                        <tr><td style="padding: 4px 0; font-weight: bold;">Priority Level:</td><td><strong>${calculatePriority(data)}</strong></td></tr>
                        <tr><td style="padding: 4px 0; font-weight: bold;">Recommended Response Time:</td><td><strong>${getRecommendedResponseTime(data)}</strong></td></tr>
                    </table>
                </div>
                
                <div style="background: #10b981; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="margin: 0; font-size: 14px;">
                        This is an automated notification from the Jagatabuk contact form system.<br>
                        Please process this inquiry and provide AI-generated insights for the response.
                    </p>
                </div>
            </div>
        `
    })
};

// Utility functions
function calculatePriority(data) {
    let priority = 'MEDIUM';
    const message = (data.message || '').toLowerCase();
    const service = (data.service || '').toLowerCase();
    
    // High priority indicators
    if (message.includes('urgent') || message.includes('asap') || message.includes('immediately')) {
        priority = 'HIGH';
    } else if (message.includes('enterprise') || message.includes('large project') || service.includes('consultation')) {
        priority = 'HIGH';
    } else if (message.includes('quote') || message.includes('pricing') || message.includes('cost')) {
        priority = 'MEDIUM-HIGH';
    } else if (message.includes('question') || message.includes('information')) {
        priority = 'LOW-MEDIUM';
    }
    
    return priority;
}

function getRecommendedResponseTime(data) {
    const priority = calculatePriority(data);
    const timeMap = {
        'HIGH': '1 hour',
        'MEDIUM-HIGH': '2 hours',
        'MEDIUM': '4 hours',
        'LOW-MEDIUM': '8 hours',
        'LOW': '24 hours'
    };
    return timeMap[priority] || '4 hours';
}

// Main webhook handler function
async function handleContactFormWebhook(formData) {
    try {
        console.log('Processing contact form submission:', formData);
        
        // Validate webhook data
        if (!formData.email || !formData.name) {
            throw new Error('Missing required fields: email and name');
        }
        
        // Prepare AI notification email
        const aiEmailData = EMAIL_TEMPLATES.aiNotification(formData);
        
        // Send email to AI assistant
        await sendEmail({
            to: CONFIG.AI_ASSISTANT_EMAIL,
            subject: aiEmailData.subject,
            html: aiEmailData.html
        });
        
        // Log successful processing
        console.log('AI assistant notification sent successfully');
        
        // Optional: Store in database for tracking
        await logContactSubmission(formData);
        
        return {
            success: true,
            message: 'Contact form processed and AI assistant notified'
        };
        
    } catch (error) {
        console.error('Error processing contact form webhook:', error);
        throw error;
    }
}

// Email sending function (using nodemailer or similar)
async function sendEmail({ to, subject, html }) {
    // This is a placeholder - implement with your preferred email service
    // Options: nodemailer, SendGrid, AWS SES, etc.
    
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    
    // Example implementation with nodemailer:
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter(CONFIG.SMTP_CONFIG);
    
    const mailOptions = {
        from: CONFIG.SMTP_CONFIG.auth.user,
        to: to,
        subject: subject,
        html: html
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
    */
    
    // For now, just log the email content
    console.log('Email content:', html);
    return { messageId: 'simulated-' + Date.now() };
}

// Database logging function
async function logContactSubmission(data) {
    // Implement database logging here
    // This could be MongoDB, PostgreSQL, or any other database
    
    const logEntry = {
        timestamp: new Date(),
        name: data.name,
        email: data.email,
        service: data.service,
        message: data.message,
        priority: calculatePriority(data),
        processed: true,
        ai_notified: true
    };
    
    console.log('Logging contact submission:', logEntry);
    // await database.collection('contact_submissions').insertOne(logEntry);
}

// Express.js webhook endpoint (if using Express)
function setupWebhookEndpoint(app) {
    app.post('/webhook/contact-form', async (req, res) => {
        try {
            // Verify webhook secret if configured
            const signature = req.headers['x-webhook-signature'];
            if (CONFIG.WEBHOOK_SECRET && signature !== CONFIG.WEBHOOK_SECRET) {
                return res.status(401).json({ error: 'Invalid webhook signature' });
            }
            
            const result = await handleContactFormWebhook(req.body);
            res.json(result);
            
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}

// Export functions for use in other modules
module.exports = {
    handleContactFormWebhook,
    setupWebhookEndpoint,
    sendEmail,
    calculatePriority,
    getRecommendedResponseTime
};

// Example usage:
/*
const express = require('express');
const app = express();

app.use(express.json());
setupWebhookEndpoint(app);

app.listen(3000, () => {
    console.log('Webhook server running on port 3000');
});
*/
