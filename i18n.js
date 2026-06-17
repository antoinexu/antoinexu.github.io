function getStoredLanguage() {
    return localStorage.getItem('selectedLanguage') || 'en';
}

function setDocumentLanguage(lang) {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

function translateNav(labels) {
    const navMap = {
        'index.html': labels.home,
        'experience.html': labels.experiences,
        'project.html': labels.projects,
        'skill.html': labels.skills,
        'about.html': labels.about,
        'contact.html': labels.contact
    };

    Object.entries(navMap).forEach(([href, text]) => {
        const link = document.querySelector(`.navbar a[href="${href}"]`);
        if (link && text) {
            link.textContent = text;
        }
    });
}

function setupLanguageSelector(onChange) {
    const selector = document.getElementById('language-selector');
    if (!selector) return;

    const initialLanguage = getStoredLanguage();
    selector.value = initialLanguage;

    selector.addEventListener('change', function() {
        localStorage.setItem('selectedLanguage', this.value);
        onChange(this.value);
    });

    onChange(initialLanguage);
}
