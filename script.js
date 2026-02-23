
(function() {
    emailjs.init("ld0_NkZs5zZdDOAcK");
})();

const SLIDES = {
    "sparx-img": ["images/sparx.PNG", "images/sparx2.png"],
    "fxdcord-img": ["images/fxdcord1.png", "images/fxdcord2.png"],
    "mangrove-img": ["images/mighty1.png", "images/mighty2.png"],
    "meetme-img": ["images/meetme1.png", "images/meetme2.png", "images/meetme3.png"],
    "chimp-img": ["images/chimporchamp1.png", "images/chimporchamp2.png", "images/chimorchamp3.png"]
};

let projectIndices = {
    "sparx-img": 0,
    "fxdcord-img": 0,
    "mangrove-img": 0,
    "chimp-img": 0,
    "meetme-img": 0
};

window.changeSlide = function(id, direction) {
    const images = SLIDES[id];
    if (!images) return;

    projectIndices[id] = (projectIndices[id] + direction + images.length) % images.length;
    const imgElement = document.getElementById(id);
    if (imgElement) imgElement.src = images[projectIndices[id]];
};


window.nextSlide = function(id) { window.changeSlide(id, 1); };

window.openModal = function(projectName) {
    const modal = document.getElementById('inquiry-sec');
    if (modal) modal.style.display = 'flex';
    document.getElementById('project-name-display').innerText = projectName;
    document.getElementById('selected-project').value = projectName;
};

window.closeModal = function() {
    const modal = document.getElementById('inquiry-sec');
    if (modal) modal.style.display = 'none';
};

async function fetchGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/jasmineraviz?t=${Date.now()}`);
        const data = await response.json();
        if (response.ok) {
            document.getElementById('repo-count').innerText = data.public_repos;
            document.getElementById('follower-count').innerText = data.followers;
        }
    } catch (e) { console.error("GitHub Stats Error:", e); }
}

async function fetchRepoData(repoName, descId, starsId, langId) {
    try {
        const repoRes = await fetch(`https://api.github.com/repos/jasmineraviz/${repoName}`);
        if (!repoRes.ok) throw new Error("Rate Limit");

        const repoData = await repoRes.json();
        const langRes = await fetch(repoData.languages_url);
        const langData = await langRes.json();

        const allLanguages = Object.keys(langData).join(' / ');

        document.getElementById(descId).innerText = repoData.description || "Active GitHub Project";
        document.getElementById(starsId).innerText = `⭐ ${repoData.stargazers_count}`;
        document.getElementById(langId).innerText = `💻 ${allLanguages || "Web"}`;
    } catch (e) {
        document.getElementById(starsId).innerText = "⭐ Repo";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector("header");
    const menuBtn = document.querySelector("#menu-btn");
    const closeMenuBtn = document.querySelector("#close-menu-btn");
    const navLinks = document.querySelectorAll(".menu-links a");

    if (menuBtn) {
        menuBtn.onclick = () => header.classList.add("show-mobile-menu");
    }

    if (closeMenuBtn) {
        closeMenuBtn.onclick = () => header.classList.remove("show-mobile-menu");
    }

    navLinks.forEach(link => {
        link.onclick = () => header.classList.remove("show-mobile-menu");
    });

    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            btn.innerText = "⏳ Sending...";
            emailjs.sendForm('service_vi60jch', 'template_m87l46r', this)
                .then(() => {
                    btn.innerText = "✅ Sent!";
                    setTimeout(() => { this.reset(); closeModal(); btn.innerText = "Submit Inquiry"; }, 2000);
                });
        });
    }

    const openGithubBtn = document.getElementById('open-github');
    const githubModal = document.getElementById('github-modal');
    const closeGithubBtn = document.getElementById('close-github');

    if (openGithubBtn) {
        openGithubBtn.onclick = (e) => {
            e.preventDefault();
            githubModal.style.display = 'flex';
            fetchGitHubStats();
        };
    }
    if (closeGithubBtn) closeGithubBtn.onclick = () => githubModal.style.display = 'none';

    fetchGitHubStats();
    fetchRepoData('Mighty-Mangroves', 'mangrove-desc', 'mangrove-stars', 'mangrove-lang');
    fetchRepoData('Meet-Me-At-The-Faculty', 'meetme-desc', 'meetme-stars', 'meetme-lang');
    fetchRepoData('Chimp-Or-Champ', 'chimp-desc', 'chimp-stars', 'chimp-lang');
});