#!/bin/bash

# Email Configuration Setup Script for Jagatabuk
# This script helps set up the email configurations for contact forms

echo "🚀 Jagatabuk Email Configuration Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required files exist
echo ""
echo "Checking configuration files..."

if [ -f "index.html" ]; then
    print_status "index.html found"
else
    print_error "index.html not found"
    exit 1
fi

if [ -f "js/contact-enhancement.js" ]; then
    print_status "contact-enhancement.js found"
else
    print_error "contact-enhancement.js not found"
    exit 1
fi

if [ -f "thank-you.html" ]; then
    print_status "thank-you.html found"
else
    print_warning "thank-you.html not found - will be created"
fi

# Check Formspree configuration
echo ""
echo "Checking Formspree configuration..."

if grep -q "https://formspree.io/f/xpwzgkqr" index.html; then
    print_status "Formspree endpoint configured in HTML"
else
    print_error "Formspree endpoint not configured in HTML"
fi

if grep -q "_cc.*ai-assistant@jagatabuk.com" index.html; then
    print_status "AI assistant CC configured"
else
    print_warning "AI assistant CC not found in form"
fi

# Environment variables check
echo ""
echo "Checking environment variables..."

if [ -f ".env" ]; then
    print_status ".env file found"
    
    # Check for required variables
    if grep -q "AI_EMAIL_USER" .env; then
        print_status "AI_EMAIL_USER configured"
    else
        print_warning "AI_EMAIL_USER not found in .env"
    fi
    
    if grep -q "SMTP_USER" .env; then
        print_status "SMTP_USER configured"
    else
        print_warning "SMTP_USER not found in .env"
    fi
else
    print_warning ".env file not found - creating template"
    
    cat > .env << EOF
# Email Configuration
AI_EMAIL_USER=ai-assistant@jagatabuk.com
AI_EMAIL_PASS=your-app-password-here
SMTP_USER=sreejagatab@yahoo.com
SMTP_PASS=your-app-password-here
WEBHOOK_SECRET=your-webhook-secret-here

# Formspree Configuration
FORMSPREE_ENDPOINT=https://formspree.io/f/xpwzgkqr

# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# reCAPTCHA
RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EOF
    
    print_status ".env template created - please update with your actual values"
fi

# Check Node.js dependencies (if using webhook)
echo ""
echo "Checking Node.js setup for webhook..."

if [ -f "package.json" ]; then
    print_status "package.json found"
else
    print_warning "package.json not found - creating for webhook setup"
    
    cat > package.json << EOF
{
  "name": "jagatabuk-email-config",
  "version": "1.0.0",
  "description": "Email configuration for Jagatabuk contact forms",
  "main": "ai-assistant-webhook.js",
  "scripts": {
    "start": "node ai-assistant-webhook.js",
    "dev": "nodemon ai-assistant-webhook.js",
    "email-processor": "python3 ai-email-processor.py"
  },
  "dependencies": {
    "express": "^4.18.2",
    "nodemailer": "^6.9.7",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF
    
    print_status "package.json created"
fi

# Python dependencies check
echo ""
echo "Checking Python setup for email processor..."

if command -v python3 &> /dev/null; then
    print_status "Python 3 found"
else
    print_error "Python 3 not found - required for email processor"
fi

if [ -f "requirements.txt" ]; then
    print_status "requirements.txt found"
else
    print_warning "requirements.txt not found - creating"
    
    cat > requirements.txt << EOF
# Email processing dependencies
imaplib2==3.6
python-dotenv==1.0.0
email-validator==2.1.0
EOF
    
    print_status "requirements.txt created"
fi

# Setup instructions
echo ""
echo "📋 Setup Instructions"
echo "===================="

echo ""
print_info "1. Formspree Setup:"
echo "   - Go to https://formspree.io and create an account"
echo "   - Create a new form with ID: xpwzgkqr"
echo "   - Configure notification email: sreejagatab@yahoo.com"
echo "   - Enable spam protection and reCAPTCHA"
echo "   - Set redirect URL: https://jagatabuk.com/thank-you.html"

echo ""
print_info "2. Email Setup:"
echo "   - Create email alias: ai-assistant@jagatabuk.com"
echo "   - Configure email forwarding or IMAP access"
echo "   - Update .env file with actual email credentials"

echo ""
print_info "3. Webhook Setup (Optional but Recommended):"
echo "   - Install Node.js dependencies: npm install"
echo "   - Configure webhook endpoint in Formspree dashboard"
echo "   - Run webhook server: npm start"

echo ""
print_info "4. Email Processor Setup (Alternative):"
echo "   - Install Python dependencies: pip install -r requirements.txt"
echo "   - Configure IMAP access for ai-assistant@jagatabuk.com"
echo "   - Run email processor: python3 ai-email-processor.py"

echo ""
print_info "5. Testing:"
echo "   - Submit a test form on your website"
echo "   - Check that emails are received at sreejagatab@yahoo.com"
echo "   - Verify AI assistant notifications are working"
echo "   - Test redirect to thank-you page"

echo ""
print_status "Email configuration setup complete!"
print_warning "Remember to update .env file with your actual credentials"

# Create a test script
echo ""
echo "Creating test script..."

cat > test-email-config.sh << 'EOF'
#!/bin/bash

echo "🧪 Testing Email Configuration"
echo "============================="

# Test form submission
echo "Testing form submission..."
curl -X POST https://formspree.io/f/xpwzgkqr \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from the email configuration setup",
    "service": "Python Automation",
    "_subject": "Test submission from jagatabuk.com"
  }'

echo ""
echo "Test submission sent. Check your email for notifications."
EOF

chmod +x test-email-config.sh
print_status "Test script created: test-email-config.sh"

echo ""
echo "🎉 Setup complete! Run ./test-email-config.sh to test the configuration."
