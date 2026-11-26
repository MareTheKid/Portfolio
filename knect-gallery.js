document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.querySelector('#knect-dialog');
    const closeButton = document.querySelector('#knect-dialog-close');
    const image = document.querySelector('#knect-gallery-image');
    const caption = document.querySelector('#knect-gallery-caption');
    const count = document.querySelector('#knect-gallery-count');
    const thumbnails = document.querySelector('#knect-gallery-thumbnails');
    const stage = document.querySelector('#knect-gallery-stage');

    const screenshots = [
        { file: 'Screenshot 2026-11-26 014707.png', title: 'Administrator dashboard', alt: 'K-NECT dashboard with overview cards, bulletin posts, and upcoming events' },
        { file: 'Screenshot 2026-11-26 014606.png', title: 'Youth profile directory', alt: 'Youth profile directory with verification status and zone filters' },
        { file: 'Screenshot 2026-11-26 014630.png', title: 'Event management', alt: 'Event management list with status filters and calendar view' },
        { file: 'Screenshot 2026-11-26 014643.png', title: 'Attendance management', alt: 'Event attendance screen with event cards and attendance actions' },
        { file: 'Screenshot 2026-11-26 014620.png', title: 'Bulletin board', alt: 'K-NECT bulletin board with featured community announcements' },
        { file: 'Screenshot 2026-11-26 014654.png', title: 'Document management', alt: 'Document management screen with search, filters, and approval status' },
        { file: 'Screenshot 2026-11-26 014551.png', title: 'Upload a document', alt: 'Document upload form with categories and visibility settings' },
        { file: 'Screenshot 2026-11-26 014537.png', title: 'Create an event', alt: 'Event creation form with location, schedule, and banner upload' },
        { file: 'Screenshot 2026-11-26 014523.png', title: 'Youth registration', alt: 'Youth profiling registration form with a multi-step progress indicator' },
        { file: 'Screenshot 2026-11-26 014320.png', title: 'Project walkthrough', alt: 'K-NECT platform demonstrated during an online project presentation' },
        { file: 'Screenshot 2026-11-26 014249.png', title: 'Project team', alt: 'K-NECT project team during the system presentation' },
        { file: 'd1a35b98-e64b-4c04-bfe4-b4b9e2266238.jpg', title: 'Project presentation', alt: 'Jon presenting the K-NECT project to an audience' },
        { file: '4895f971-d5ce-4711-bbd2-201eac52d1fc.jpg', title: 'Live system demonstration', alt: 'K-NECT website projected during an in-person project demonstration' }
    ].map(screenshot => ({
        ...screenshot,
        src: `images/sample/K-NECT/${encodeURIComponent(screenshot.file).replaceAll('%2F', '/')}`
    }));

    let activeIndex = 0;
    let previousOverflow = '';
    let touchStartX = 0;

    function selectScreenshot(index) {
        activeIndex = (index + screenshots.length) % screenshots.length;
        const screenshot = screenshots[activeIndex];
        image.src = screenshot.src;
        image.alt = screenshot.alt;
        caption.textContent = screenshot.title;
        count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(screenshots.length).padStart(2, '0')}`;
        thumbnails.querySelectorAll('.gallery-thumb').forEach((button, buttonIndex) => {
            const isCurrent = buttonIndex === activeIndex;
            button.setAttribute('aria-pressed', String(isCurrent));
            if (isCurrent) button.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        });
    }

    screenshots.forEach((screenshot, index) => {
        const button = document.createElement('button');
        button.className = 'gallery-thumb';
        button.type = 'button';
        button.setAttribute('aria-label', `Show ${screenshot.title}`);
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = `<img src="${screenshot.src}" alt="" loading="lazy"><span>${screenshot.title}</span>`;
        button.addEventListener('click', () => selectScreenshot(index));
        thumbnails.append(button);
    });

    document.addEventListener('click', event => {
        const trigger = event.target.closest('[data-gallery="knect"]');
        if (!trigger) return;

        event.preventDefault();
        event.stopPropagation();
        selectScreenshot(0);
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
    }, true);

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
        document.body.style.overflow = previousOverflow;
    });

    document.querySelector('#knect-gallery-prev').addEventListener('click', () => selectScreenshot(activeIndex - 1));
    document.querySelector('#knect-gallery-next').addEventListener('click', () => selectScreenshot(activeIndex + 1));

    document.addEventListener('keydown', event => {
        if (!dialog.open) return;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            selectScreenshot(activeIndex - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            selectScreenshot(activeIndex + 1);
        }
    });

    stage.addEventListener('pointerdown', event => {
        touchStartX = event.clientX;
    });
    stage.addEventListener('pointerup', event => {
        const distance = event.clientX - touchStartX;
        if (Math.abs(distance) < 45) return;
        selectScreenshot(activeIndex + (distance < 0 ? 1 : -1));
    });
});
