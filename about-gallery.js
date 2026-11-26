document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('#milestone-gallery-grid');
    const filters = document.querySelectorAll('.milestone-filter');
    const viewer = document.querySelector('#milestone-viewer');
    const viewerImage = document.querySelector('#milestone-viewer-image');
    const viewerTitle = document.querySelector('#milestone-viewer-title');
    const viewerDescription = document.querySelector('#milestone-viewer-description');
    const viewerCount = document.querySelector('#milestone-viewer-count');
    const galleryCount = document.querySelector('.milestone-gallery-count');
    const progress = document.querySelector('.milestone-gallery-progress');
    const progressBar = progress.querySelector('span');
    const previousButton = document.querySelector('.milestone-gallery-prev');
    const nextButton = document.querySelector('.milestone-gallery-next');
    const cards = [...gallery.querySelectorAll('.milestone-photo-card')];
    let visibleCards = cards;
    let activeIndex = 0;
    let touchStartX = 0;

    function updatePosition(index, shouldScroll = false) {
        activeIndex = Math.max(0, Math.min(index, visibleCards.length - 1));
        const activeCard = visibleCards[activeIndex];
        if (!activeCard) return;

        if (shouldScroll) gallery.scrollTo({ left: activeCard.offsetLeft, behavior: 'smooth' });
        galleryCount.innerHTML = `${String(activeIndex + 1).padStart(2, '0')} <span>/</span> ${String(visibleCards.length).padStart(2, '0')}`;
        progressBar.style.width = `${((activeIndex + 1) / visibleCards.length) * 100}%`;
        progress.setAttribute('aria-valuemax', String(visibleCards.length));
        progress.setAttribute('aria-valuenow', String(activeIndex + 1));
        previousButton.disabled = activeIndex === 0;
        nextButton.disabled = activeIndex === visibleCards.length - 1;
    }

    filters.forEach(filter => filter.addEventListener('click', () => {
        filters.forEach(button => {
            const isActive = button === filter;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
        cards.forEach(card => {
            card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter;
        });
        visibleCards = cards.filter(card => !card.hidden);
        gallery.scrollTo({ left: 0, behavior: 'smooth' });
        updatePosition(0);
    }));

    previousButton.addEventListener('click', () => updatePosition(activeIndex - 1, true));
    nextButton.addEventListener('click', () => updatePosition(activeIndex + 1, true));
    gallery.addEventListener('scroll', () => {
        const galleryLeft = gallery.getBoundingClientRect().left;
        const closestIndex = visibleCards.reduce((closest, card, index) => {
            const distance = Math.abs(card.getBoundingClientRect().left - galleryLeft);
            return distance < closest.distance ? { index, distance } : closest;
        }, { index: 0, distance: Infinity }).index;
        updatePosition(closestIndex);
    }, { passive: true });
    gallery.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') updatePosition(activeIndex - 1, true);
        if (event.key === 'ArrowRight') updatePosition(activeIndex + 1, true);
    });

    function showPhoto(index) {
        activeIndex = (index + visibleCards.length) % visibleCards.length;
        const card = visibleCards[activeIndex];
        viewerImage.src = card.dataset.full;
        viewerImage.alt = card.querySelector('img').alt;
        viewerTitle.textContent = card.dataset.title;
        viewerDescription.textContent = card.dataset.description;
        viewerCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(visibleCards.length).padStart(2, '0')}`;
    }

    cards.forEach(card => card.addEventListener('click', () => {
        visibleCards = cards.filter(item => !item.hidden);
        showPhoto(visibleCards.indexOf(card));
        viewer.showModal();
    }));

    updatePosition(0);

    document.querySelector('.milestone-viewer-close').addEventListener('click', () => viewer.close());
    document.querySelector('.milestone-viewer-prev').addEventListener('click', () => showPhoto(activeIndex - 1));
    document.querySelector('.milestone-viewer-next').addEventListener('click', () => showPhoto(activeIndex + 1));
    viewer.addEventListener('click', event => {
        if (event.target === viewer) viewer.close();
    });
    document.addEventListener('keydown', event => {
        if (!viewer.open) return;
        if (event.key === 'ArrowLeft') showPhoto(activeIndex - 1);
        if (event.key === 'ArrowRight') showPhoto(activeIndex + 1);
    });
    viewer.querySelector('figure').addEventListener('pointerdown', event => {
        touchStartX = event.clientX;
    });
    viewer.querySelector('figure').addEventListener('pointerup', event => {
        const distance = event.clientX - touchStartX;
        if (Math.abs(distance) > 55) showPhoto(activeIndex + (distance < 0 ? 1 : -1));
    });
});