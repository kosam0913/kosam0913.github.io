/**
 * Portfolio Module
 */

async function loadPortfolioSection(containerId) {
    try {
        const response = await fetch('./portfolio/portfolio.html');
        const html = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
            const section = container.querySelector('#portfolio');
            if (section) {
                section.classList.add('active');
                section.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error loading portfolio section:', error);
    }
}

function openProjectDetail(projectId) {
    if (projectId === 'datascience') {
        window.open('https://colab.research.google.com/drive/1A3DhtigtOnSK2Jkvbd3zkQkeWm7Pd1_x?usp=sharing', '_blank');
    } else if (projectId === 'best') {
        window.open('https://kosam0913.gumroad.com/l/notion-budget-expense-smart-tracker', '_blank');
    } else if (projectId === 'charity') {
        document.getElementById('portfolio-lightbox-img').src = 'portfolio/public_welfare/logo.jpg';
        document.getElementById('portfolio-lightbox').classList.add('active');
    } else if (projectId === 'design') {
        window.open('portfolio/design/index.html', '_blank');
    } else if (projectId === 'poster2') {
        window.open('portfolio/design/index.html#photo-section', '_blank');
    } else if (projectId === 'treenode') {
        window.open('https://chromewebstore.google.com/detail/notion-treeview/ckoknomfbeadbnmkppidchmhmeaflbka', '_blank');
    } else {
        window.open(`portfolio/${projectId}/index.html`, '_blank');
    }
}
