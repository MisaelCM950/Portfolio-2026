const lightBox = document.getElementById('lightbox');
const lightBoxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

const sectionLabels = {
    home: 'Home',
    story: 'Story',
    awards: 'Awards'
};

document.querySelectorAll('.nav-link').forEach(link => {
    const label = link.textContent.trim().toLowerCase();
    if (sectionLabels[label]) {
        const sectionName = sectionLabels[label];
        link.href = `/under-construction.html?section=${encodeURIComponent(sectionName)}`;
    }
});

if (lightBox && lightBoxImg) {
    document.querySelectorAll('.screenshots img').forEach(img => {
        img.onclick = () => {
            lightBox.style.display = 'flex';
            lightBoxImg.src = img.src;
        };
    });

    if (closeBtn) {
        closeBtn.onclick = () => {
            lightBox.style.display = 'none';
        };
    }

    lightBox.onclick = (e) => {
        if (e.target !== lightBoxImg) {
            lightBox.style.display = 'none';
        }
    };
}