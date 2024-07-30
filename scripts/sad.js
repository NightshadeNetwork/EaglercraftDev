// Cache for content and cookies
const contentCache = {};
const cookieCache = {};

// DOM element cache
const elements = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  cacheElements();
  initializeCookies();
  setupEventListeners();
  loadContent('home');
  checkTermsAcceptance();
}

function cacheElements() {
  ['version-selector', 'theme-selector', 'client-theme-1.8', 'client-theme-1.5', 'play-button', 'legal-tab', 'social-tab'].forEach(id => {
    elements[id] = document.getElementById(id);
  });
  elements.legalSubmenu = document.querySelector('.legal-submenu');
  elements.socialSubmenu = document.querySelector('.social-submenu');
  elements.navItems = document.querySelectorAll('nav ul li a');
  elements.contentSections = document.querySelectorAll('.content');
}

function initializeCookies() {
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    cookieCache[name] = value;
  });
  
  if (!cookieCache.version) setCookie('version', 'Release 1.8.8');
  if (!cookieCache.theme) setCookie('theme', '/styles/default-modern.css');
  if (!cookieCache.ClientEPK1_8) setCookie('ClientEPK1_8', 'default-1.8.epk');
  if (!cookieCache.ClientEPK1_5) setCookie('ClientEPK1_5', 'default-1.5.epk');
  
  applyTheme(cookieCache.theme || '/styles/default-modern.css');
}

function setupEventListeners() {
  document.addEventListener('click', handleGlobalClick);
  elements['theme-selector']?.addEventListener('change', handleThemeChange);
  elements['play-button']?.addEventListener('click', handlePlayClick);
}

function handleGlobalClick(event) {
  const target = event.target;
  
  if (target.matches('nav ul li a')) {
    handleNavClick(event, target);
  } else if (target.matches('.legal-submenu li a, .social-submenu li a')) {
    event.stopPropagation();
  }
}

function handleNavClick(event, target) {
  event.preventDefault();
  
  if (target.id === 'legal-tab' || target.id === 'social-tab') {
    toggleSubmenu(target);
  } else if (!['client-tab', 'about-tab', 'discord-tab', 'reddit-tab', 'terms-tab', 'privacy-tab', 'legal-info-tab', 'forum-tab'].includes(target.id)) {
    setActiveNavItem(target);
    loadContent(target.id.split('-')[0]);
  }
}

function toggleSubmenu(target) {
  const isLegal = target.id === 'legal-tab';
  const submenu = isLegal ? elements.legalSubmenu : elements.socialSubmenu;
  const chevron = target.querySelector('.fa-chevron-down');
  
  target.classList.toggle('active');
  submenu.classList.toggle('active');
  if (chevron) {
    chevron.style.transform = target.classList.contains('active') ? 'rotate(-90deg)' : 'rotate(0deg)';
  }
}

function setActiveNavItem(activeItem) {
  elements.navItems.forEach(item => item.classList.remove('active'));
  activeItem.classList.add('active');
  [elements['legal-tab'], elements['social-tab']].forEach(tab => {
    tab.classList.remove('active');
    const submenu = tab === elements['legal-tab'] ? elements.legalSubmenu : elements.socialSubmenu;
    submenu.classList.remove('active');
    const chevron = tab.querySelector('.fa-chevron-down');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  });
}

function loadContent(section) {
  const contentElement = document.getElementById(section);
  if (!contentElement) {
    console.error(`Content section for ${section} not found`);
    return;
  }
  
  elements.contentSections.forEach(el => {
    el.classList.remove('active');
    el.style.display = 'none';
  });
  
  contentElement.style.display = 'block';
  
  if (contentCache[section]) {
    renderContent(contentElement, contentCache[section]);
  } else {
    fetch(`${section}.html`)
      .then(response => {
        if (!response.ok) throw new Error(`Network response was not ok :( ${response.statusText}`);
        return response.text();
      })
      .then(html => {
        contentCache[section] = html;
        renderContent(contentElement, html);
      })
      .catch(error => {
        console.error('Error loading page:', error);
        contentElement.innerHTML = '<p>Failed to load content.</p>';
      });
  }
}

function renderContent(element, content) {
  element.innerHTML = content;
  element.classList.add('active');
  if (element.id === 'settings') {
    initializeSettingsPage();
  }
}

function initializeSettingsPage() {
  ['version-selector', 'theme-selector', 'client-theme-1.8', 'client-theme-1.5'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.value = cookieCache[id.replace('-selector', '').replace('client-theme-', 'ClientEPK')];
      element.addEventListener('change', updateSettings);
    }
  });
}

function updateSettings() {
  ['version', 'theme', 'ClientEPK1_8', 'ClientEPK1_5'].forEach(key => {
    const element = document.getElementById(key.replace('ClientEPK', 'client-theme-').replace('version', 'version-selector').replace('theme', 'theme-selector'));
    if (element) {
      setCookie(key, element.value);
      if (key === 'theme') applyTheme(element.value);
    }
  });
}

function handleThemeChange() {
  const theme = this.value;
  setCookie('theme', theme);
  applyTheme(theme);
}

function handlePlayClick(event) {
  if (cookieCache.AcceptedTerms !== 'Yes') {
    event.preventDefault();
    alert('Please accept the terms before playing.');
    showTermsOverlay();
  } else {
    launchGame(cookieCache.version);
  }
}

function launchGame(version) {
  const versionPaths = {
    'Release 1.8.8': '/clients/1.8/index.html',
    'Beta 1.7.3': '/clients/1.7/index.html',
    'Release 1.5.2': '/clients/1.5/index.html',
    'Precision Client 1.5.2': '/clients/Precision/index.html',
    'Beta 1.3': '/clients/1.3/index.html',
    'Release 1.2.5': '/clients/1.2/index.html',
    'EaglerForge': '/clients/EaglerForge/index.html',
    'Resent Client 4.0': '/clients/Resent/index.html',
    'Shadow Client 4.0': '/clients/Shadow/index.html',
    'Astra Client 1.2': '/clients/Astra/index.html',
    'Indev': '/clients/Indev/index.html',
    'Alpha 1.2.6': '/clients/Alpha-1.2/index.html'
  };
  
  const path = versionPaths[version] || '/clients/1.8/index.html';
  
  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`Network response was not ok ${response.statusText}`);
      return response.text();
    })
    .then(html => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(html, 'text/html');
      document.open();
      document.write(htmlDoc.documentElement.outerHTML);
      document.close();
    })
    .catch(error => {
      console.error('Error loading version content:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    });
}

function showTermsOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'terms-overlay';
  overlay.innerHTML = `
    <div id="terms-box">
      <h2>Welcome!</h2>
      <p>Before you proceed, please review and accept our:</p>
      <ul>
        <li><a href="/terms/" rel="noopener noreferrer" target="_blank">Terms of Service</a></li>
        <li><a href="/privacy/" rel="noopener noreferrer" target="_blank">Privacy Policy</a></li>
        <li><a href="/legal/" rel="noopener noreferrer" target="_blank">Legal Disclaimer</a></li>
        <li><a href="/credits/" rel="noopener noreferrer" target="_blank">Credits</a></li>
      </ul>
      <p>By clicking "Accept", you agree to be bound by these documents.</p>
      <button id="accept-terms">Accept</button>
    </div>
  `;
  document.body.appendChild(overlay);
  
  document.getElementById('accept-terms').addEventListener('click', () => {
    setCookie('AcceptedTerms', 'Yes', 365);
    cookieCache.AcceptedTerms = 'Yes';
    overlay.remove();
  });
}

function checkTermsAcceptance() {
  if (cookieCache.AcceptedTerms !== 'Yes') {
    showTermsOverlay();
  }
}

function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires};path=/;SameSite=None;Secure`;
  cookieCache[name] = value;
}

function applyTheme(theme) {
  const stylesheet = document.getElementById('theme-stylesheet');
  if (stylesheet) {
    stylesheet.href = theme;
  }
}