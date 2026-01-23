// ========================================
// GOSHEN CLOTHING - ENHANCEMENT FEATURES
// ========================================

const ADMIN_PASSWORD = 'goshen2026';
let isAdminMode = false;
let adminVerifiedForChat = false;

document.addEventListener('DOMContentLoaded', function () {
    initThemeSystem();
    initScrollToTop();
    initAdminMode();
    initChatbot();
    loadSavedContent();
});

// ========================================
// THEME SYSTEM
// ========================================
function initThemeSystem() {
    const savedTheme = localStorage.getItem('goshen-theme') || 'default';
    applyTheme(savedTheme);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', cycleTheme);
    }
}

function cycleTheme() {
    const themes = ['default', 'light', 'dark'];
    const current = localStorage.getItem('goshen-theme') || 'default';
    const nextIndex = (themes.indexOf(current) + 1) % themes.length;
    applyTheme(themes[nextIndex]);
}

function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    if (theme !== 'default') {
        document.body.classList.add('theme-' + theme);
    }
    localStorage.setItem('goshen-theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const label = document.getElementById('theme-label');
    if (label) {
        const icons = { default: '🌙', light: '☀️', dark: '🌑' };
        label.textContent = icons[theme] || '🌙';
    }
}

// ========================================
// SCROLL TO TOP
// ========================================
function initScrollToTop() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// ADMIN MODE
// ========================================
function initAdminMode() {
    // Keyboard shortcut: Ctrl+Shift+A
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            showPasswordModal();
        }
    });

    // Hidden logo trigger (5 clicks)
    let logoClicks = 0;
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            logoClicks++;
            if (logoClicks >= 5) {
                e.preventDefault();
                logoClicks = 0;
                showPasswordModal();
            }
            setTimeout(() => { logoClicks = 0; }, 2000);
        });
    }

    // Exit admin button
    const exitBtn = document.getElementById('admin-exit');
    if (exitBtn) {
        exitBtn.addEventListener('click', exitAdminMode);
    }

    // Modal buttons
    document.getElementById('modal-submit')?.addEventListener('click', verifyPassword);
    document.getElementById('modal-cancel')?.addEventListener('click', hidePasswordModal);
    document.getElementById('password-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyPassword();
    });
}

function showPasswordModal() {
    const modal = document.getElementById('password-modal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('password-input').value = '';
        document.getElementById('password-input').focus();
    }
}

function hidePasswordModal() {
    document.getElementById('password-modal')?.classList.remove('active');
}

function verifyPassword() {
    const input = document.getElementById('password-input');
    if (input && input.value === ADMIN_PASSWORD) {
        hidePasswordModal();
        enableAdminMode();
    } else {
        input.value = '';
        input.placeholder = 'Incorrect password!';
        setTimeout(() => { input.placeholder = 'Enter admin password'; }, 1500);
    }
}

function enableAdminMode() {
    isAdminMode = true;
    document.body.classList.add('admin-mode');
    document.getElementById('admin-indicator')?.classList.add('active');

    // Enable contenteditable on text elements
    document.querySelectorAll('[data-editable]').forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.addEventListener('blur', saveContent);
    });
}

function exitAdminMode() {
    isAdminMode = false;
    adminVerifiedForChat = false;
    document.body.classList.remove('admin-mode');
    document.getElementById('admin-indicator')?.classList.remove('active');

    document.querySelectorAll('[data-editable]').forEach(el => {
        el.removeAttribute('contenteditable');
    });
}

function saveContent() {
    const editables = document.querySelectorAll('[data-editable]');
    const content = {};
    editables.forEach((el, i) => {
        content['editable-' + i] = el.innerHTML;
    });
    localStorage.setItem('goshen-content', JSON.stringify(content));
}

function loadSavedContent() {
    const saved = localStorage.getItem('goshen-content');
    if (saved) {
        const content = JSON.parse(saved);
        document.querySelectorAll('[data-editable]').forEach((el, i) => {
            if (content['editable-' + i]) {
                el.innerHTML = content['editable-' + i];
            }
        });
    }
}

// Image replacement
function setupImageUpload(imgElement) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                imgElement.src = ev.target.result;
                saveImages();
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function saveImages() {
    const images = {};
    document.querySelectorAll('[data-image-id]').forEach(img => {
        if (img.src.startsWith('data:')) {
            images[img.dataset.imageId] = img.src;
        }
    });
    localStorage.setItem('goshen-images', JSON.stringify(images));
}

// ========================================
// CHATBOT
// ========================================
function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');
    const close = document.getElementById('chatbot-close');
    const input = document.getElementById('chatbot-input');
    const send = document.getElementById('chatbot-send');

    toggle?.addEventListener('click', () => window?.classList.toggle('active'));
    close?.addEventListener('click', () => window?.classList.remove('active'));
    send?.addEventListener('click', sendMessage);
    input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    addBotMessage("Hello! I'm your Goshen assistant. Ask me about our collections, location, or type 'help' for options.");
}

function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;

    addUserMessage(input.value);
    input.value = '';

    setTimeout(() => {
        const response = processMessage(msg);
        addBotMessage(response);
    }, 500);
}

function addBotMessage(text) {
    const container = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chat-message bot';
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
    const container = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chat-message user';
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function processMessage(msg) {
    // Admin commands
    if (msg.includes('edit') || msg.includes('change') || msg.includes('reset')) {
        return processAdminCommand(msg);
    }

    // Navigation
    if (msg.includes('product')) {
        scrollToSection('#products');
        return "Taking you to our products! 👗";
    }
    if (msg.includes('collection') || msg.includes('lookbook')) {
        scrollToSection('#collections');
        return "Here are our collections! ✨";
    }
    if (msg.includes('review') || msg.includes('testimonial')) {
        scrollToSection('#reviews');
        return "Check out what our customers say! ⭐";
    }
    if (msg.includes('contact') || msg.includes('social')) {
        scrollToSection('#contact');
        return "Here's how to reach us! 📱";
    }

    // FAQs
    if (msg.includes('location') || msg.includes('where') || msg.includes('address')) {
        return "We're located in Accra, Ghana. Click the map icon in our contact section for directions! 📍";
    }
    if (msg.includes('hour') || msg.includes('open') || msg.includes('time')) {
        return "We're open Monday-Saturday, 9AM-6PM. Visit our showroom anytime! 🕐";
    }
    if (msg.includes('phone') || msg.includes('whatsapp') || msg.includes('call')) {
        return "Reach us on WhatsApp: +233 540 402 935 💬";
    }
    if (msg.includes('price') || msg.includes('cost')) {
        return "Our pieces range from affordable to premium. Contact us for specific pricing! 💰";
    }
    if (msg.includes('help') || msg.includes('option')) {
        return "I can help with: products, collections, reviews, contact info, location, hours, pricing. Just ask!";
    }

    return "I'm not sure about that. Try asking about our products, collections, location, or hours!";
}

function processAdminCommand(msg) {
    if (!isAdminMode) {
        return "Admin commands require admin mode. Press Ctrl+Shift+A to enable.";
    }

    if (msg.includes('reset')) {
        localStorage.removeItem('goshen-content');
        localStorage.removeItem('goshen-images');
        return "Content reset! Refresh the page to see original content.";
    }

    if (msg.includes('edit hero')) {
        document.querySelector('.hero-content')?.scrollIntoView({ behavior: 'smooth' });
        return "Hero section is now editable. Click on any text to edit!";
    }

    if (msg.includes('edit product')) {
        document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
        return "Product names are now editable. Click on any text to edit!";
    }

    return "Admin commands: 'edit hero', 'edit products', 'reset content'";
}

function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) {
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        window.scrollTo({ top: el.offsetTop - navHeight, behavior: 'smooth' });
    }
}
