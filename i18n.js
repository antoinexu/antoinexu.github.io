const SUPPORTED_LANGUAGES = ['en', 'zh'];

const i18nOriginals = new WeakMap();

function i18nWarn(message) {
    if (typeof console !== 'undefined' && console.warn) {
        console.warn('[i18n] ' + message);
    }
}

function i18nResolve(target) {
    if (!target) return null;
    if (typeof target !== 'string') return target;
    return /^[A-Za-z][\w-]*$/.test(target)
        ? document.getElementById(target)
        : document.querySelector(target);
}

function i18nLabel(target, label) {
    if (label) return label;
    return typeof target === 'string' ? target : 'element';
}

function i18nOriginal(target, property) {
    const el = i18nResolve(target);
    if (!el) return '';

    let record = i18nOriginals.get(el);
    if (!record) {
        record = {};
        i18nOriginals.set(el, record);
    }
    if (!(property in record)) {
        record[property] = el[property];
    }
    return record[property];
}

function setText(target, value, label) {
    const el = i18nResolve(target);
    const name = i18nLabel(target, label);
    if (!el) {
        i18nWarn('no element for "' + name + '"');
        return false;
    }

    const original = i18nOriginal(el, 'textContent');
    if (typeof value !== 'string' || value === '') {
        i18nWarn('missing text for "' + name + '", keeping the original');
        el.textContent = original;
        return false;
    }

    el.textContent = value;
    return true;
}

function setPills(target, values, label) {
    const el = i18nResolve(target);
    const name = i18nLabel(target, label);
    if (!el) {
        i18nWarn('no element for "' + name + '"');
        return false;
    }

    const original = i18nOriginal(el, 'innerHTML');
    if (!Array.isArray(values) || values.length === 0) {
        i18nWarn('missing list for "' + name + '", keeping the original');
        el.innerHTML = original;
        return false;
    }

    el.textContent = '';
    values.forEach(function (value) {
        const span = document.createElement('span');
        span.textContent = typeof value === 'string' ? value : '';
        el.appendChild(span);
    });
    return true;
}

function selectStrings(data, lang) {
    if (!data || typeof data !== 'object') {
        i18nWarn('translation file is empty or not an object');
        return {};
    }
    if (!data[lang]) {
        i18nWarn('no strings for language "' + lang + '", falling back to English');
        return data.en || {};
    }
    return data[lang];
}

let i18nRequestId = 0;

function loadTranslations(file, lang, apply, onError) {
    const requestId = ++i18nRequestId;

    return fetch(file)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(file + ' returned ' + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            if (requestId !== i18nRequestId) return;
            const strings = selectStrings(data, lang);
            applyTranslations(strings, lang, apply);
        })
        .catch(function (error) {
            if (requestId !== i18nRequestId) return;
            i18nWarn('could not load ' + file + ': ' + error.message);
            if (typeof onError === 'function') {
                onError(error);
            }
        });
}

function applyTranslations(strings, lang, apply) {
    try {
        translateNav(strings);
    } catch (error) {
        i18nWarn('nav translation failed: ' + error.message);
    }

    try {
        setDocumentLanguage(lang, strings);
    } catch (error) {
        i18nWarn('page metadata translation failed: ' + error.message);
    }

    try {
        apply(strings, lang);
    } catch (error) {
        i18nWarn('page translation failed: ' + error.message);
    }
}

function getStoredLanguage() {
    let stored = null;
    try {
        stored = localStorage.getItem('selectedLanguage');
    } catch (error) {
        return 'en';
    }
    return SUPPORTED_LANGUAGES.indexOf(stored) === -1 ? 'en' : stored;
}

function storeLanguage(lang) {
    try {
        localStorage.setItem('selectedLanguage', lang);
    } catch (error) {
    }
}

function setDocumentLanguage(lang, strings) {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    applyPageMeta(strings);
    renderSkipLink(lang);
    renderFooter(lang);
}

function applyPageMeta(strings) {
    if (!strings) return;

    if (strings.page_title) {
        document.title = strings.page_title;
    }

    const description = document.querySelector('meta[name="description"]');
    if (description && strings.page_description) {
        description.setAttribute('content', strings.page_description);
    }
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
        tagline: 'Business systems and backend engineer building ERP, MES, and e-commerce platforms.',
        links_heading: 'Explore',
        home: 'Home',
        experiences: 'Experience',
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
        tagline: '业务系统与后端工程师，专注 ERP、MES 与电商平台。',
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
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    footer.querySelectorAll('[data-footer]').forEach(function (el) {
        const key = el.getAttribute('data-footer');
        if (key === 'copyright') {
            el.textContent = '© ' + new Date().getFullYear() + ' Bowei Xu. ' + t.rights;
        } else if (t[key]) {
            el.textContent = t[key];
        }
    });

    footer.querySelectorAll('[data-footer-label]').forEach(function (el) {
        const key = el.getAttribute('data-footer-label');
        if (t[key]) {
            el.setAttribute('aria-label', t[key]);
        }
    });

    const nav = footer.querySelector('[data-footer-nav]');
    if (nav) {
        nav.setAttribute('aria-label', t.links_heading);
    }
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
        const link = document.querySelector(`.navbar a[href$="${href}"]`);
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
        storeLanguage(this.value);
        onChange(this.value);
    });

    onChange(initialLanguage);
}
