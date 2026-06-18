function getStoredLanguage() {
    return localStorage.getItem('selectedLanguage') || 'en';
}

function setDocumentLanguage(lang) {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    renderSkipLink(lang);
    renderFooter(lang);
}

function renderSkipLink(lang) {
    const label = lang === 'zh' ? '跳到主内容' : 'Skip to main content';

    const main = document.querySelector('section');
    if (main && !main.id) {
        main.id = 'main-content';
    }
    const targetId = main ? main.id : 'main-content';
    if (main && main.getAttribute('tabindex') === null) {
        main.setAttribute('tabindex', '-1');
    }

    let link = document.getElementById('skip-link');
    if (!link) {
        link = document.createElement('a');
        link.id = 'skip-link';
        link.className = 'skip-link';
        document.body.insertBefore(link, document.body.firstChild);
    }
    link.href = '#' + targetId;
    link.textContent = label;
}

const footerStrings = {
    en: {
        tagline: 'Full-stack developer building ERP, MES, and e-commerce systems.',
        links_heading: 'Explore',
        home: 'Home',
        experiences: 'Experiences',
        projects: 'Projects',
        skills: 'Skills',
        about: 'About',
        contact: 'Contact',
        connect_heading: 'Connect',
        email_label: 'Email Bowei Xu',
        github_label: 'Bowei Xu on GitHub',
        linkedin_label: 'Bowei Xu on LinkedIn',
        rights: 'All rights reserved.'
    },
    zh: {
        tagline: '全栈开发者，专注 ERP、MES 与电商系统。',
        links_heading: '导航',
        home: '首页',
        experiences: '经历',
        projects: '项目',
        skills: '技能',
        about: '关于',
        contact: '联系',
        connect_heading: '联系方式',
        email_label: '给徐博伟发邮件',
        github_label: '徐博伟的 GitHub',
        linkedin_label: '徐博伟的 LinkedIn',
        rights: '保留所有权利。'
    }
};

function renderFooter(lang) {
    const t = footerStrings[lang] || footerStrings.en;
    const year = new Date().getFullYear();
    let footer = document.getElementById('site-footer');

    if (!footer) {
        footer = document.createElement('footer');
        footer.id = 'site-footer';
        footer.className = 'site-footer';
        document.body.appendChild(footer);
    }

    footer.innerHTML = `
        <div class="footer-inner">
            <div class="footer-brand">
                <a href="index.html" class="footer-logo">Bowei Xu</a>
                <p class="footer-tagline">${t.tagline}</p>
            </div>
            <nav class="footer-col" aria-label="${t.links_heading}">
                <h4>${t.links_heading}</h4>
                <a href="index.html">${t.home}</a>
                <a href="experience.html">${t.experiences}</a>
                <a href="project.html">${t.projects}</a>
                <a href="skill.html">${t.skills}</a>
                <a href="about.html">${t.about}</a>
                <a href="contact.html">${t.contact}</a>
            </nav>
            <div class="footer-col">
                <h4>${t.connect_heading}</h4>
                <div class="footer-social">
                    <a href="mailto:bowei_xu@outlook.com" aria-label="${t.email_label}"><i class="bx bx-envelope"></i></a>
                    <a href="https://github.com/antoinexu" target="_blank" rel="noopener noreferrer" aria-label="${t.github_label}"><i class="bx bxl-github"></i></a>
                    <a href="https://www.linkedin.com/in/bowei-xu-132a3b1b9/" target="_blank" rel="noopener noreferrer" aria-label="${t.linkedin_label}"><i class="bx bxl-linkedin"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${year} Bowei Xu. ${t.rights}</p>
        </div>
    `;
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
