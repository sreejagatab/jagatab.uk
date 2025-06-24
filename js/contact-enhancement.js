// ========================================
// JAGATABUK WEBSITE - CONTACT FORM ENHANCEMENTS
// ========================================

// Enhanced Contact Form Functionality
class ContactFormEnhancer {
    constructor() {
        this.forms = document.querySelectorAll('form[id*="contact"], .contact-form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            this.enhanceForm(form);
        });
        this.setupServicePageForms();
        this.setupQuickContactButtons();
    }
    
    enhanceForm(form) {
        // Add service selection if on service page
        this.addServiceSelection(form);
        
        // Add form validation
        this.addValidation(form);
        
        // Add progress indicators
        this.addProgressIndicator(form);
        
        // Add auto-save functionality
        this.addAutoSave(form);
        
        // Add submission handling
        this.addSubmissionHandling(form);
    }
    
    addServiceSelection(form) {
        // Detect if we're on a service page
        const servicePage = window.location.pathname.includes('/services/');
        if (servicePage) {
            const serviceName = window.location.pathname
                .split('/services/')[1]
                .replace('.html', '')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            
            // Add hidden field with service name
            const serviceInput = document.createElement('input');
            serviceInput.type = 'hidden';
            serviceInput.name = 'service_interest';
            serviceInput.value = serviceName;
            form.appendChild(serviceInput);
            
            // Add visible service indicator
            const serviceIndicator = document.createElement('div');
            serviceIndicator.className = 'service-indicator';
            serviceIndicator.innerHTML = `
                <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: #059669; font-weight: 600;">
                        <i class="fas fa-check-circle"></i>
                        <span>Inquiry about: ${serviceName}</span>
                    </div>
                </div>
            `;
            form.insertBefore(serviceIndicator, form.firstChild);
        }
    }
    
    addValidation(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // Form submission validation
        form.addEventListener('submit', (e) => {
            if (!this.validateForm(form)) {
                e.preventDefault();
                this.showFormErrors(form);
            }
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Name validation
        if (field.name === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
        }
        
        // Message validation
        if (field.name === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
        }
        
        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    showFieldValidation(field, isValid, errorMessage) {
        // Remove existing error
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Update field styling
        field.style.borderColor = isValid ? '#10b981' : '#ef4444';
        
        // Show error message if invalid
        if (!isValid && errorMessage) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
    }
    
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    addProgressIndicator(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        const totalFields = inputs.length;
        
        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress';
        progressContainer.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.875rem; color: #6b7280;">Form Progress</span>
                    <span class="progress-text" style="font-size: 0.875rem; color: #6b7280;">0%</span>
                </div>
                <div style="background: #e5e7eb; height: 4px; border-radius: 2px; overflow: hidden;">
                    <div class="progress-bar" style="background: #10b981; height: 100%; width: 0%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;
        
        form.insertBefore(progressContainer, form.firstChild);
        
        // Update progress on input
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateProgress(form));
            input.addEventListener('change', () => this.updateProgress(form));
        });
    }
    
    updateProgress(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        const filledInputs = Array.from(inputs).filter(input => input.value.trim() !== '');
        const progress = Math.round((filledInputs.length / inputs.length) * 100);
        
        const progressBar = form.querySelector('.progress-bar');
        const progressText = form.querySelector('.progress-text');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}%`;
    }
    
    addAutoSave(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        const formId = form.id || 'contact-form';
        
        // Load saved data
        this.loadSavedData(form, formId);
        
        // Save data on input
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormData(form, formId);
            });
        });
        
        // Clear saved data on successful submission
        form.addEventListener('submit', () => {
            setTimeout(() => {
                localStorage.removeItem(`form-data-${formId}`);
            }, 1000);
        });
    }
    
    saveFormData(form, formId) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem(`form-data-${formId}`, JSON.stringify(data));
    }
    
    loadSavedData(form, formId) {
        const savedData = localStorage.getItem(`form-data-${formId}`);
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                Object.keys(data).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input && input.type !== 'hidden') {
                        input.value = data[key];
                    }
                });
                
                // Show restoration notice
                this.showRestorationNotice(form);
                this.updateProgress(form);
            } catch (e) {
                console.error('Error loading saved form data:', e);
            }
        }
    }
    
    showRestorationNotice(form) {
        const notice = document.createElement('div');
        notice.className = 'restoration-notice';
        notice.innerHTML = `
            <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #d97706;">
                    <i class="fas fa-info-circle"></i>
                    <span style="font-weight: 500;">Form data restored from previous session</span>
                    <button type="button" class="clear-saved" style="margin-left: auto; background: none; border: none; color: #d97706; cursor: pointer; text-decoration: underline;">Clear</button>
                </div>
            </div>
        `;
        
        form.insertBefore(notice, form.firstChild);
        
        // Handle clear button
        notice.querySelector('.clear-saved').addEventListener('click', () => {
            const formId = form.id || 'contact-form';
            localStorage.removeItem(`form-data-${formId}`);
            form.reset();
            notice.remove();
            this.updateProgress(form);
        });
    }
    
    addSubmissionHandling(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }
    
    async handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Add timestamp and page info
            data.timestamp = new Date().toISOString();
            data.page_url = window.location.href;
            data.user_agent = navigator.userAgent;
            
            // Track submission attempt
            if (window.JagatabukAnalytics) {
                window.JagatabukAnalytics.trackContactFormEvent('form_submit_attempt');
            }
            
            // Simulate form submission (replace with actual endpoint)
            await this.submitForm(data);
            
            // Show success message
            this.showSuccessMessage(form);
            
            // Track successful submission
            if (window.JagatabukAnalytics) {
                window.JagatabukAnalytics.trackContactFormEvent('form_submit_success');
            }
            
            // Reset form
            form.reset();
            this.updateProgress(form);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(form, 'There was an error sending your message. Please try again or contact us directly.');
            
            // Track submission error
            if (window.JagatabukAnalytics) {
                window.JagatabukAnalytics.trackContactFormEvent('form_submit_error');
            }
        } finally {
            // Restore button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
    
    async submitForm(data) {
        // Submit to Formspree endpoint
        const formspreeEndpoint = 'https://formspree.io/f/xpwzgkqr';

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    _replyto: data.email,
                    _subject: `New inquiry from jagatabuk.com - ${data.service || 'General'}`,
                    _cc: 'ai-assistant@jagatabuk.com'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);
            return result;

        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        }
    }
    
    showSuccessMessage(form) {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 2rem; text-align: center; margin: 1rem 0;">
                <div style="color: #059669; font-size: 3rem; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 style="color: #059669; margin-bottom: 0.5rem;">Message Sent Successfully!</h3>
                <p style="color: #065f46; margin-bottom: 1rem;">Thank you for your inquiry. We'll get back to you within 2 hours during business hours.</p>
                <p style="color: #065f46; font-size: 0.875rem;">
                    <strong>Next Steps:</strong> Check your email for a confirmation message with our contact details.
                </p>
            </div>
        `;
        
        form.parentNode.insertBefore(message, form);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 10000);
    }
    
    showErrorMessage(form, errorText) {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.innerHTML = `
            <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #dc2626;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span style="font-weight: 500;">Error</span>
                </div>
                <p style="color: #991b1b; margin-top: 0.5rem; margin-bottom: 0;">${errorText}</p>
            </div>
        `;
        
        form.parentNode.insertBefore(message, form);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 8000);
    }
    
    setupServicePageForms() {
        // Add quick contact forms to service pages
        const servicePages = document.querySelectorAll('.sidebar');
        
        servicePages.forEach(sidebar => {
            if (!sidebar.querySelector('.quick-contact-form')) {
                this.addQuickContactForm(sidebar);
            }
        });
    }
    
    addQuickContactForm(sidebar) {
        const quickForm = document.createElement('div');
        quickForm.className = 'sidebar-card quick-contact-form';
        quickForm.innerHTML = `
            <h3>Quick Contact</h3>
            <p>Get a fast response about this service:</p>
            <form class="quick-form" style="margin-top: 1rem;">
                <input type="text" name="name" placeholder="Your Name" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 0.75rem;">
                <input type="email" name="email" placeholder="Your Email" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 0.75rem;">
                <textarea name="message" placeholder="Quick question about this service..." rows="3" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 1rem; resize: vertical;"></textarea>
                <button type="submit" style="width: 100%; background: #10b981; color: white; padding: 0.75rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    Send Quick Message
                </button>
            </form>
        `;
        
        sidebar.appendChild(quickForm);
        this.enhanceForm(quickForm.querySelector('form'));
    }
    
    setupQuickContactButtons() {
        // Add floating contact button for mobile
        if (window.innerWidth <= 768) {
            this.addFloatingContactButton();
        }
    }
    
    addFloatingContactButton() {
        const floatingButton = document.createElement('div');
        floatingButton.className = 'floating-contact';
        floatingButton.innerHTML = `
            <button style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                z-index: 1000;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                <i class="fas fa-comments"></i>
            </button>
        `;
        
        document.body.appendChild(floatingButton);
        
        floatingButton.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Initialize contact form enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ContactFormEnhancer();
    });
} else {
    new ContactFormEnhancer();
}
