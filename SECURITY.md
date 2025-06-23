# 🛡️ Security Guide for Jagatabuk Website

This document outlines comprehensive security measures and best practices for the Jagatabuk website to protect against common web vulnerabilities and ensure data privacy compliance.

## 📋 Table of Contents

- [🔒 Security Overview](#-security-overview)
- [🛡️ Frontend Security](#️-frontend-security)
- [🔐 Backend Security](#-backend-security)
- [🌐 Hosting Security](#-hosting-security)
- [📊 Monitoring & Logging](#-monitoring--logging)
- [🔄 Regular Maintenance](#-regular-maintenance)
- [📞 Incident Response](#-incident-response)

## 🔒 Security Overview

### Security Principles
- **Defense in Depth**: Multiple layers of security
- **Least Privilege**: Minimal access rights
- **Zero Trust**: Verify everything
- **Privacy by Design**: GDPR compliance built-in

### Threat Model
- **XSS Attacks**: Cross-site scripting prevention
- **CSRF Attacks**: Cross-site request forgery protection
- **Data Breaches**: Personal data protection
- **DDoS Attacks**: Distributed denial of service mitigation
- **Bot Attacks**: Automated spam and scraping prevention

## 🛡️ Frontend Security

### Content Security Policy (CSP)
Implement strict CSP headers to prevent XSS attacks:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM_NONCE}' 
    https://www.googletagmanager.com 
    https://www.google-analytics.com
    https://connect.facebook.net
    https://www.recaptcha.net;
  style-src 'self' 'unsafe-inline' 
    https://fonts.googleapis.com
    https://cdnjs.cloudflare.com;
  font-src 'self' 
    https://fonts.gstatic.com
    https://cdnjs.cloudflare.com;
  img-src 'self' data: 
    https://www.google-analytics.com
    https://www.facebook.com;
  connect-src 'self' 
    https://www.google-analytics.com
    https://formspree.io;
  frame-src 
    https://www.google.com
    https://www.recaptcha.net;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://formspree.io;
  upgrade-insecure-requests;
">
```

### Input Validation & Sanitization
```javascript
// Client-side validation (never trust client-side only)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

function sanitizeInput(input) {
    return input
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim()
        .substring(0, 1000); // Limit length
}

// Form validation
function validateContactForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!validateEmail(formData.email)) {
        errors.push('Valid email address required');
    }
    
    if (!formData.message || formData.message.length < 10) {
        errors.push('Message must be at least 10 characters');
    }
    
    return errors;
}
```

### reCAPTCHA v3 Integration
```javascript
// reCAPTCHA v3 implementation
function executeRecaptcha(action) {
    return new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
            grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
                .then(token => {
                    if (token) {
                        resolve(token);
                    } else {
                        reject('reCAPTCHA failed');
                    }
                })
                .catch(reject);
        });
    });
}

// Use in form submission
async function submitContactForm(formData) {
    try {
        const recaptchaToken = await executeRecaptcha('contact_form');
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Recaptcha-Token': recaptchaToken
            },
            body: JSON.stringify(formData)
        });
        
        return response.json();
    } catch (error) {
        console.error('Form submission failed:', error);
        throw error;
    }
}
```

### Secure Cookie Configuration
```javascript
// Secure cookie settings
document.cookie = "sessionId=value; Secure; HttpOnly; SameSite=Strict; Max-Age=3600";

// GDPR-compliant cookie consent
function setCookieConsent(consent) {
    const cookieValue = JSON.stringify({
        necessary: true,
        analytics: consent.analytics,
        marketing: consent.marketing,
        timestamp: Date.now()
    });
    
    document.cookie = `cookieConsent=${cookieValue}; Secure; SameSite=Strict; Max-Age=31536000; Path=/`;
}
```

## 🔐 Backend Security

### Server Configuration
```nginx
# Nginx security headers
server {
    listen 443 ssl http2;
    server_name jagatabuk.com www.jagatabuk.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=contact:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/m;
    
    location /contact {
        limit_req zone=contact burst=3 nodelay;
        # Contact form handling
    }
    
    location / {
        limit_req zone=general burst=10 nodelay;
        # General content
    }
    
    # Hide server information
    server_tokens off;
    
    # Prevent access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log|config)$ {
        deny all;
    }
}
```

### API Security (if using backend)
```javascript
// Express.js security middleware
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'nonce-{RANDOM_NONCE}'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Rate limiting
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many contact form submissions, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/contact', contactLimiter);

// Input validation middleware
function validateContactInput(req, res, next) {
    const { name, email, message } = req.body;
    const errors = [];
    
    if (!name || !validator.isLength(name, { min: 2, max: 100 })) {
        errors.push('Name must be 2-100 characters');
    }
    
    if (!email || !validator.isEmail(email)) {
        errors.push('Valid email required');
    }
    
    if (!message || !validator.isLength(message, { min: 10, max: 5000 })) {
        errors.push('Message must be 10-5000 characters');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    // Sanitize inputs
    req.body.name = validator.escape(name);
    req.body.email = validator.normalizeEmail(email);
    req.body.message = validator.escape(message);
    
    next();
}

// reCAPTCHA verification
async function verifyRecaptcha(token, action) {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    
    const data = await response.json();
    return data.success && data.score >= 0.5 && data.action === action;
}
```

## 🌐 Hosting Security

### Cloudflare Security Settings
```javascript
// Cloudflare security configuration
const cloudflareSettings = {
    // DDoS Protection
    ddosProtection: 'high',
    
    // Web Application Firewall
    waf: {
        enabled: true,
        mode: 'challenge',
        rules: [
            'OWASP Core Rule Set',
            'Cloudflare Managed Rules',
            'Custom Rules for Contact Form'
        ]
    },
    
    // Bot Management
    botManagement: {
        enabled: true,
        mode: 'fight',
        allowedBots: ['Googlebot', 'Bingbot']
    },
    
    // SSL/TLS Settings
    ssl: {
        mode: 'strict',
        minTlsVersion: '1.2',
        hsts: {
            enabled: true,
            maxAge: 31536000,
            includeSubdomains: true,
            preload: true
        }
    },
    
    // Page Rules
    pageRules: [
        {
            url: '*/admin/*',
            action: 'block'
        },
        {
            url: '*/.env',
            action: 'block'
        }
    ]
};
```

### DNS Security
```bash
# DNS security records
# Add these to your DNS configuration

# CAA Record (Certificate Authority Authorization)
jagatabuk.com. CAA 0 issue "letsencrypt.org"
jagatabuk.com. CAA 0 issuewild ";"
jagatabuk.com. CAA 0 iodef "mailto:security@jagatabuk.com"

# SPF Record (Email security)
jagatabuk.com. TXT "v=spf1 include:_spf.google.com ~all"

# DMARC Record (Email authentication)
_dmarc.jagatabuk.com. TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@jagatabuk.com"

# DKIM Record (Email signing)
# Generated by your email provider
```

## 📊 Monitoring & Logging

### Security Monitoring
```javascript
// Security event logging
class SecurityLogger {
    static logSecurityEvent(event, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            ip: this.getClientIP(),
            url: window.location.href
        };
        
        // Send to monitoring service
        this.sendToMonitoring(logEntry);
    }
    
    static logFailedLogin(email) {
        this.logSecurityEvent('failed_login', { email });
    }
    
    static logSuspiciousActivity(activity) {
        this.logSecurityEvent('suspicious_activity', activity);
    }
    
    static logFormSubmission(formType) {
        this.logSecurityEvent('form_submission', { type: formType });
    }
}

// Monitor for suspicious activity
function monitorSuspiciousActivity() {
    // Detect rapid form submissions
    let formSubmissions = 0;
    const resetInterval = 60000; // 1 minute
    
    setInterval(() => {
        formSubmissions = 0;
    }, resetInterval);
    
    document.addEventListener('submit', (e) => {
        formSubmissions++;
        if (formSubmissions > 3) {
            SecurityLogger.logSuspiciousActivity({
                type: 'rapid_form_submissions',
                count: formSubmissions
            });
        }
    });
    
    // Detect console usage (potential developer tools)
    let devtools = false;
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || 
            window.outerWidth - window.innerWidth > 200) {
            if (!devtools) {
                SecurityLogger.logSuspiciousActivity({
                    type: 'developer_tools_detected'
                });
                devtools = true;
            }
        } else {
            devtools = false;
        }
    }, 1000);
}
```

### Performance & Security Monitoring
```javascript
// Monitor Core Web Vitals and security metrics
function initializeMonitoring() {
    // Performance monitoring
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                // Log page load times
                console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
            }
        }
    }).observe({ entryTypes: ['navigation'] });
    
    // Security monitoring
    window.addEventListener('error', (e) => {
        SecurityLogger.logSecurityEvent('javascript_error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno
        });
    });
    
    // CSP violation reporting
    document.addEventListener('securitypolicyviolation', (e) => {
        SecurityLogger.logSecurityEvent('csp_violation', {
            violatedDirective: e.violatedDirective,
            blockedURI: e.blockedURI,
            originalPolicy: e.originalPolicy
        });
    });
}
```
