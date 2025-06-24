#!/usr/bin/env python3
"""
AI Assistant Email Processor for Jagatabuk Contact Forms
This script processes incoming emails and generates AI-powered responses
"""

import smtplib
import imaplib
import email
import json
import re
import os
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, List, Optional

# Configuration
CONFIG = {
    'IMAP_SERVER': 'imap.gmail.com',
    'SMTP_SERVER': 'smtp.gmail.com',
    'EMAIL_USER': os.getenv('AI_EMAIL_USER', 'ai-assistant@jagatabuk.com'),
    'EMAIL_PASS': os.getenv('AI_EMAIL_PASS', 'your-app-password'),
    'MAIN_EMAIL': 'sreejagatab@yahoo.com',
    'CHECK_INTERVAL': 300,  # 5 minutes
}

class AIEmailProcessor:
    def __init__(self):
        self.imap_server = None
        self.smtp_server = None
        
    def connect_imap(self):
        """Connect to IMAP server"""
        try:
            self.imap_server = imaplib.IMAP4_SSL(CONFIG['IMAP_SERVER'])
            self.imap_server.login(CONFIG['EMAIL_USER'], CONFIG['EMAIL_PASS'])
            return True
        except Exception as e:
            print(f"IMAP connection error: {e}")
            return False
    
    def connect_smtp(self):
        """Connect to SMTP server"""
        try:
            self.smtp_server = smtplib.SMTP(CONFIG['SMTP_SERVER'], 587)
            self.smtp_server.starttls()
            self.smtp_server.login(CONFIG['EMAIL_USER'], CONFIG['EMAIL_PASS'])
            return True
        except Exception as e:
            print(f"SMTP connection error: {e}")
            return False
    
    def parse_contact_form_email(self, email_content: str) -> Optional[Dict]:
        """Parse contact form data from email content"""
        try:
            # Extract form data using regex patterns
            patterns = {
                'name': r'Name:\s*(.+)',
                'email': r'Email:\s*(.+)',
                'phone': r'Phone:\s*(.+)',
                'company': r'Company:\s*(.+)',
                'service': r'Service:\s*(.+)',
                'message': r'Message:\s*(.+?)(?=\n\n|\n[A-Z]|$)',
            }
            
            form_data = {}
            for field, pattern in patterns.items():
                match = re.search(pattern, email_content, re.IGNORECASE | re.DOTALL)
                if match:
                    form_data[field] = match.group(1).strip()
            
            return form_data if form_data else None
            
        except Exception as e:
            print(f"Error parsing email content: {e}")
            return None
    
    def analyze_inquiry(self, form_data: Dict) -> Dict:
        """Analyze the inquiry and generate AI insights"""
        message = form_data.get('message', '').lower()
        service = form_data.get('service', '').lower()
        
        # Categorize inquiry type
        inquiry_type = 'general'
        if any(word in message for word in ['quote', 'price', 'cost', 'budget']):
            inquiry_type = 'pricing'
        elif any(word in message for word in ['consultation', 'meeting', 'call', 'discuss']):
            inquiry_type = 'consultation'
        elif any(word in message for word in ['help', 'support', 'problem', 'issue']):
            inquiry_type = 'support'
        elif any(word in message for word in ['python', 'automation', 'ai', 'chatbot']):
            inquiry_type = 'technical'
        
        # Assess complexity
        complexity = 'medium'
        if any(word in message for word in ['simple', 'basic', 'small']):
            complexity = 'low'
        elif any(word in message for word in ['complex', 'enterprise', 'large', 'advanced']):
            complexity = 'high'
        
        # Determine urgency
        urgency = 'normal'
        if any(word in message for word in ['urgent', 'asap', 'immediately', 'rush']):
            urgency = 'high'
        elif any(word in message for word in ['when possible', 'no rush', 'flexible']):
            urgency = 'low'
        
        # Generate response suggestions
        response_suggestions = self.generate_response_suggestions(inquiry_type, complexity, form_data)
        
        return {
            'inquiry_type': inquiry_type,
            'complexity': complexity,
            'urgency': urgency,
            'estimated_hours': self.estimate_project_hours(complexity, service),
            'estimated_cost': self.estimate_project_cost(complexity, service),
            'response_suggestions': response_suggestions,
            'recommended_next_steps': self.get_recommended_next_steps(inquiry_type),
            'analysis_timestamp': datetime.now().isoformat()
        }
    
    def generate_response_suggestions(self, inquiry_type: str, complexity: str, form_data: Dict) -> List[str]:
        """Generate AI-powered response suggestions"""
        name = form_data.get('name', 'there')
        service = form_data.get('service', 'our services')
        
        suggestions = []
        
        if inquiry_type == 'pricing':
            suggestions.extend([
                f"Hi {name}, thank you for your interest in {service}. Based on your requirements, I'd estimate this project would range from £{self.estimate_project_cost(complexity, service)}.",
                f"I'd love to provide you with a detailed quote. Could we schedule a 15-minute call to discuss your specific needs?",
                "I'll also send you some case studies of similar projects we've completed."
            ])
        
        elif inquiry_type == 'consultation':
            suggestions.extend([
                f"Hi {name}, I'd be happy to schedule a consultation to discuss {service}.",
                "I have availability this week for a 30-minute discovery call. What times work best for you?",
                "I'll prepare some initial ideas and questions based on your message."
            ])
        
        elif inquiry_type == 'technical':
            suggestions.extend([
                f"Hi {name}, thanks for reaching out about {service}. This sounds like an interesting technical challenge.",
                "I'd recommend starting with a technical assessment to understand your current setup and requirements.",
                "I can provide some initial recommendations and a roadmap for implementation."
            ])
        
        else:  # general
            suggestions.extend([
                f"Hi {name}, thank you for your message about {service}.",
                "I'd be happy to discuss how we can help with your project.",
                "Let me know if you'd like to schedule a call or if you have any specific questions."
            ])
        
        return suggestions
    
    def estimate_project_hours(self, complexity: str, service: str) -> str:
        """Estimate project hours based on complexity and service type"""
        base_hours = {
            'python automation': {'low': '10-20', 'medium': '20-40', 'high': '40-80'},
            'ai chatbot': {'low': '15-25', 'medium': '25-50', 'high': '50-100'},
            'web development': {'low': '20-40', 'medium': '40-80', 'high': '80-160'},
            'seo automation': {'low': '8-15', 'medium': '15-30', 'high': '30-60'},
        }
        
        service_key = next((key for key in base_hours.keys() if key in service.lower()), 'python automation')
        return base_hours[service_key].get(complexity, '20-40')
    
    def estimate_project_cost(self, complexity: str, service: str) -> str:
        """Estimate project cost based on complexity and service type"""
        base_costs = {
            'python automation': {'low': '500-1000', 'medium': '1000-2000', 'high': '2000-4000'},
            'ai chatbot': {'low': '800-1500', 'medium': '1500-3000', 'high': '3000-6000'},
            'web development': {'low': '1000-2000', 'medium': '2000-4000', 'high': '4000-8000'},
            'seo automation': {'low': '400-800', 'medium': '800-1500', 'high': '1500-3000'},
        }
        
        service_key = next((key for key in base_costs.keys() if key in service.lower()), 'python automation')
        return base_costs[service_key].get(complexity, '1000-2000')
    
    def get_recommended_next_steps(self, inquiry_type: str) -> List[str]:
        """Get recommended next steps based on inquiry type"""
        next_steps = {
            'pricing': [
                'Schedule discovery call to understand requirements',
                'Prepare detailed quote with project breakdown',
                'Send relevant case studies and testimonials'
            ],
            'consultation': [
                'Book consultation call',
                'Prepare agenda and questions',
                'Send calendar invite with meeting details'
            ],
            'technical': [
                'Conduct technical assessment',
                'Review current systems and requirements',
                'Provide technical recommendations and roadmap'
            ],
            'support': [
                'Understand the specific issue',
                'Provide immediate assistance if possible',
                'Schedule follow-up if needed'
            ],
            'general': [
                'Clarify specific requirements',
                'Provide relevant information about services',
                'Suggest appropriate next steps'
            ]
        }
        
        return next_steps.get(inquiry_type, next_steps['general'])
    
    def send_analysis_email(self, form_data: Dict, analysis: Dict):
        """Send AI analysis email to main email address"""
        try:
            msg = MIMEMultipart()
            msg['From'] = CONFIG['EMAIL_USER']
            msg['To'] = CONFIG['MAIN_EMAIL']
            msg['Subject'] = f"🤖 AI Analysis: Contact from {form_data.get('name', 'Unknown')}"
            
            # Create HTML email content
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2 style="margin: 0;">🤖 AI Analysis Complete</h2>
                    <p style="margin: 5px 0 0 0;">Contact Form Submission Analysis</p>
                </div>
                
                <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
                    <h3>Contact Information</h3>
                    <p><strong>Name:</strong> {form_data.get('name', 'N/A')}</p>
                    <p><strong>Email:</strong> {form_data.get('email', 'N/A')}</p>
                    <p><strong>Service:</strong> {form_data.get('service', 'N/A')}</p>
                </div>
                
                <div style="background: white; padding: 20px; border: 1px solid #e5e7eb;">
                    <h3>AI Analysis Results</h3>
                    <p><strong>Inquiry Type:</strong> {analysis['inquiry_type'].title()}</p>
                    <p><strong>Complexity:</strong> {analysis['complexity'].title()}</p>
                    <p><strong>Urgency:</strong> {analysis['urgency'].title()}</p>
                    <p><strong>Estimated Hours:</strong> {analysis['estimated_hours']}</p>
                    <p><strong>Estimated Cost:</strong> £{analysis['estimated_cost']}</p>
                </div>
                
                <div style="background: #dbeafe; padding: 20px; border: 1px solid #3b82f6;">
                    <h3>Suggested Response</h3>
                    {'<br>'.join(analysis['response_suggestions'])}
                </div>
                
                <div style="background: #fef3c7; padding: 20px; border: 1px solid #f59e0b; border-radius: 0 0 8px 8px;">
                    <h3>Recommended Next Steps</h3>
                    <ul>
                        {''.join(f'<li>{step}</li>' for step in analysis['recommended_next_steps'])}
                    </ul>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(html_content, 'html'))
            
            if self.connect_smtp():
                self.smtp_server.send_message(msg)
                self.smtp_server.quit()
                print("AI analysis email sent successfully")
            
        except Exception as e:
            print(f"Error sending analysis email: {e}")
    
    def process_new_emails(self):
        """Process new contact form emails"""
        try:
            if not self.connect_imap():
                return
            
            self.imap_server.select('INBOX')
            
            # Search for unread emails from Formspree
            status, messages = self.imap_server.search(None, 'UNSEEN FROM "noreply@formspree.io"')
            
            if status == 'OK':
                for msg_id in messages[0].split():
                    # Fetch email
                    status, msg_data = self.imap_server.fetch(msg_id, '(RFC822)')
                    
                    if status == 'OK':
                        email_body = msg_data[0][1]
                        email_message = email.message_from_bytes(email_body)
                        
                        # Extract email content
                        content = ""
                        if email_message.is_multipart():
                            for part in email_message.walk():
                                if part.get_content_type() == "text/plain":
                                    content = part.get_payload(decode=True).decode()
                                    break
                        else:
                            content = email_message.get_payload(decode=True).decode()
                        
                        # Parse and analyze
                        form_data = self.parse_contact_form_email(content)
                        if form_data:
                            analysis = self.analyze_inquiry(form_data)
                            self.send_analysis_email(form_data, analysis)
                        
                        # Mark as read
                        self.imap_server.store(msg_id, '+FLAGS', '\\Seen')
            
            self.imap_server.close()
            self.imap_server.logout()
            
        except Exception as e:
            print(f"Error processing emails: {e}")

def main():
    """Main function to run the email processor"""
    processor = AIEmailProcessor()
    
    print("Starting AI Email Processor...")
    print(f"Checking for new emails every {CONFIG['CHECK_INTERVAL']} seconds")
    
    import time
    while True:
        try:
            processor.process_new_emails()
            time.sleep(CONFIG['CHECK_INTERVAL'])
        except KeyboardInterrupt:
            print("Stopping AI Email Processor...")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
            time.sleep(60)  # Wait 1 minute before retrying

if __name__ == "__main__":
    main()
