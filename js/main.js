/**
 * MEOW Research Group Website — Main JavaScript
 * Reads data.json and dynamically populates all page sections.
 * All editable content is in data.json — no HTML changes needed.
 */

// ===== Load Data =====
let DATA = {};

async function loadData() {
    try {
        const resp = await fetch('data.json?_=' + Date.now());
        DATA = await resp.json();
        buildAll();
    } catch (e) {
        console.error('Failed to load data.json:', e);
    }
}

// ===== Build Everything =====
function buildAll() {
    buildNavigation();
    buildHome();
    buildResearch();
    buildPeople();
    buildRecruitment();
    buildFooter();
    updatePageTitle();
}

// ===== Navigation =====
function buildNavigation() {
    const nav = DATA.navigation;
    document.getElementById('nav-logo').textContent = DATA.site.logo_text;
    const links = document.querySelectorAll('.nav-link');
    links[0].textContent = nav.home;
    links[1].textContent = nav.research;
    links[2].textContent = nav.people;
    links[3].textContent = nav.recruitment;
}

function updatePageTitle() {
    document.title = `${DATA.site.title} — ${DATA.site.university}`;
    document.getElementById('page-title').textContent = DATA.site.title;
}

// ===== Home =====
function buildHome() {
    const h = DATA.home;
    const s = DATA.site;

    document.getElementById('home-title').textContent = s.title;
    document.getElementById('home-subtitle').textContent = s.subtitle;
    document.getElementById('home-affiliation').textContent = `${s.department}, ${s.university}`;

    // Vision
    document.getElementById('vision-title').textContent = h.vision.title;
    document.getElementById('vision-content').textContent = h.vision.content;
    const kwDiv = document.getElementById('vision-keywords');
    kwDiv.innerHTML = h.vision.keywords.map(k => `<span class="keyword">${k}</span>`).join('');

    // News
    document.getElementById('news-title').textContent = h.news.title;
    document.getElementById('news-list').innerHTML = h.news.items.map(item =>
        `<div class="news-item">
            <div class="news-date">${item.date}</div>
            <div class="news-text">${item.text}</div>
        </div>`
    ).join('');

    // Recruitment preview
    document.getElementById('recruit-title-home').textContent = h.recruitment.title;
    document.getElementById('recruit-intro-home').textContent = h.recruitment.intro;
}

// ===== Research =====
function buildResearch() {
    const r = DATA.research;
    document.getElementById('research-title').textContent = r.title;
    document.getElementById('research-intro').textContent = r.intro;

    document.getElementById('research-grid').innerHTML = r.directions.map(d => `
        <div class="research-card" id="research-${d.id}" onclick="toggleResearch('${d.id}')">
            <div class="research-icon">${d.icon}</div>
            <h3>${d.name}</h3>
            <p class="short-desc">${d.short}</p>
            <div class="research-keywords">${d.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}</div>
            <span class="expand-btn">Learn more →</span>
            <div class="research-detail">
                <p>${d.detail}</p>
            </div>
        </div>
    `).join('');
}

function toggleResearch(id) {
    const card = document.getElementById(`research-${id}`);
    card.classList.toggle('expanded');
}

// ===== People =====
function buildPeople() {
    const p = DATA.people;
    document.getElementById('people-title').textContent = p.title;
    document.getElementById('people-intro').textContent = p.intro;

    // PI
    const pi = p.pi;
    document.getElementById('pi-card').innerHTML = `
        <div class="pi-photo">${pi.photo ? `<img src="${pi.photo}" class="pi-photo" alt="${pi.name}">` : '👤'}</div>
        <div class="pi-info">
            <h2>${pi.name}</h2>
            <p class="pi-title">${pi.title}</p>
            <p class="pi-bio">${pi.short_bio}</p>
            <div class="pi-social">
                ${pi.email ? `<a href="mailto:${pi.email}">📧 Email</a>` : ''}
                ${pi.google_scholar ? `<a href="${pi.google_scholar}" target="_blank">📚 Scholar</a>` : ''}
                ${pi.researchgate ? `<a href="${pi.researchgate}" target="_blank">🔬 ResearchGate</a>` : ''}
                ${pi.linkedin ? `<a href="${pi.linkedin}" target="_blank">💼 LinkedIn</a>` : ''}
            </div>
        </div>
    `;
    document.getElementById('pi-card').onclick = () => showPersonModal(pi, 'PI');

    // Students
    document.getElementById('students-grid').innerHTML = p.students.map(s => `
        <div class="person-card" onclick="showPersonModal(${JSON.stringify(s).replace(/"/g, '&quot;')}, 'Student')">
            <div class="person-photo">${s.photo ? `<img src="${s.photo}" class="person-photo" alt="${s.name}">` : '🧑‍🔬'}</div>
            <h3>${s.name}</h3>
            <p class="person-role">${s.role}</p>
            <p class="person-bio">${s.short_bio}</p>
        </div>
    `).join('');

    // Alumni
    if (p.alumni && p.alumni.length > 0) {
        document.getElementById('alumni-section').innerHTML = `
            <h2 class="subsection-title">Alumni</h2>
            ${p.alumni.map(a => `
                <div class="alumni-item">
                    <strong>${a.name}</strong> — ${a.role}${a.thesis ? `<br><em>${a.thesis}</em>` : ''}
                </div>
            `).join('')}
        `;
    }
}

// ===== Recruitment =====
function buildRecruitment() {
    const r = DATA.home.recruitment;
    document.getElementById('recruit-title').textContent = r.title;
    document.getElementById('recruit-intro').textContent = r.intro;

    document.getElementById('positions-grid').innerHTML = r.positions.map(p => `
        <div class="position-card">
            <h3>${p.role}</h3>
            <p class="position-slots">${p.slots}</p>
            <p class="position-req">${p.requirements}</p>
        </div>
    `).join('');

    document.getElementById('recruit-contact').innerHTML = `<p>${r.contact}</p>`;
}

// ===== Footer =====
function buildFooter() {
    const s = DATA.site;
    const f = DATA.footer;
    document.getElementById('footer-logo').textContent = s.logo_text;
    document.getElementById('footer-address').textContent = f.address;
    document.getElementById('footer-email').textContent = f.email;
    document.getElementById('footer-links').innerHTML = f.links.map(l =>
        l.url ? `<a href="${l.url}" target="_blank">${l.name}</a>` : ''
    ).join('');
    document.getElementById('footer-copyright').textContent = `© ${new Date().getFullYear()} ${f.copyright}`;
}

// ===== Person Modal =====
function showPersonModal(person, type) {
    const body = document.getElementById('modal-body');
    const eduList = person.education ? `<li>${[person.education].flat().join('</li><li>')}</li>` : '';
    const expList = person.experience ? `<li>${[person.experience].flat().join('</li><li>')}</li>` : '';
    const honorList = person.honors ? `<li>${[person.honors].flat().join('</li><li>')}</li>` : '';

    body.innerHTML = `
        <h2>${person.name}</h2>
        <p class="role">${person.title || person.role}</p>
        ${person.full_bio || person.short_bio ? `
        <div class="detail-section">
            <p>${person.full_bio || person.short_bio}</p>
        </div>` : ''}
        ${eduList ? `<div class="detail-section"><h4>Education</h4><ul>${eduList}</ul></div>` : ''}
        ${expList ? `<div class="detail-section"><h4>Experience</h4><ul>${expList}</ul></div>` : ''}
        ${honorList ? `<div class="detail-section"><h4>Honors & Awards</h4><ul>${honorList}</ul></div>` : ''}
        ${person.thesis ? `<div class="detail-section"><h4>Thesis</h4><p>${person.thesis}</p></div>` : ''}
        ${person.email ? `<div class="detail-section"><p>📧 ${person.email}</p></div>` : ''}
    `;

    document.getElementById('person-modal').classList.add('open');
}

document.querySelector('.modal-close').onclick = () => {
    document.getElementById('person-modal').classList.remove('open');
};
document.getElementById('person-modal').onclick = function(e) {
    if (e.target === this) this.classList.remove('open');
};

// ===== Section Navigation (SPA) =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href').substring(1);

        // Hide all sections, show target
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
        document.getElementById(target).classList.add('active-section');

        // Update nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Scroll to top
        window.scrollTo({top: 0, behavior: 'smooth'});

        // Close mobile menu
        document.querySelector('.nav-links').classList.remove('open');
    });
});

// Mobile menu toggle
document.querySelector('.nav-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
});

// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? '' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ===== Navbar scroll effect =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,.1)';
    } else {
        navbar.style.boxShadow = '';
    }
});

// ===== Handle person modal with escaped JSON =====
document.querySelectorAll('.person-card').forEach(card => {
    card.addEventListener('click', function() {
        const personData = this.getAttribute('data-person');
        if (personData) {
            showPersonModal(JSON.parse(personData), 'Student');
        }
    });
});

// ===== Init =====
loadData();
