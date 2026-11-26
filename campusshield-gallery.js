document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.querySelector('#campusshield-dialog');
    const closeButton = document.querySelector('#campusshield-dialog-close');
    const image = document.querySelector('#campusshield-gallery-image');
    const caption = document.querySelector('#campusshield-gallery-caption');
    const count = document.querySelector('#campusshield-gallery-count');
    const thumbnails = document.querySelector('#campusshield-gallery-thumbnails');
    const stage = document.querySelector('#campusshield-gallery-stage');

    const screens = [
        { file: 'Mobile_UserInterface (1)_page-0003.jpg', title: 'Home dashboard', alt: 'CampusShield home dashboard with emergency reporting, quick incident types, and recent incidents' },
        { file: 'Mobile_UserInterface (1)_page-0001.jpg', title: 'User sign-in', alt: 'CampusShield sign-in screen with account creation and password recovery options' },
        { file: 'Mobile_UserInterface (1)_page-0002.jpg', title: 'Create an account', alt: 'CampusShield registration form for new users' },
        { file: 'Mobile_UserInterface (1)_page-0004.jpg', title: 'Home and safety updates', alt: 'CampusShield home screen showing incidents and emergency updates' },
        { file: 'Mobile_UserInterface (1)_page-0005.jpg', title: 'Disaster alerts', alt: 'CampusShield disaster alerts with hazard types and severity levels' },
        { file: 'Mobile_UserInterface (1)_page-0006.jpg', title: 'Report an incident', alt: 'Incident report form with incident details and selectable incident types' },
        { file: 'Mobile_UserInterface (1)_page-0007.jpg', title: 'Pinpoint a location', alt: 'Incident reporting screen with location details and an interactive map' },
        { file: 'Mobile_UserInterface (1)_page-0008.jpg', title: 'My reports', alt: 'List of submitted incident reports with their status and dates' },
        { file: 'Mobile_UserInterface (1)_page-0009.jpg', title: 'Report details', alt: 'Incident report details shown in a dialog' },
        { file: 'Mobile_UserInterface (1)_page-0010.jpg', title: 'Latest safety updates', alt: 'CampusShield news feed with disaster risk updates and safety information' },
        { file: 'Mobile_UserInterface (1)_page-0011.jpg', title: 'User profile', alt: 'CampusShield profile with user information and account options' },
        { file: 'Mobile_UserInterface (1)_page-0012.jpg', title: 'Account options', alt: 'CampusShield profile settings, support, and logout options' },
        { file: 'Mobile_UserInterface (1)_page-0013.jpg', title: 'Profile settings & support', alt: 'CampusShield profile screen with settings, help and support, and logout options' },
        { file: 'Mobile_UserInterface (1)_page-0014.jpg', title: 'Admin panel sign-in', alt: 'Desktop sign-in page for the CSPC CampusShield administration panel' }
    ].map(screen => ({
        ...screen,
        src: `images/sample/CampusShield/${encodeURIComponent(screen.file).replaceAll('%2F', '/')}`
    }));

    let activeIndex = 0;
    let touchStartX = 0;

    function selectScreen(index) {
        activeIndex = (index + screens.length) % screens.length;
        const screen = screens[activeIndex];
        image.src = screen.src;
        image.alt = screen.alt;
        caption.textContent = screen.title;
        count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(screens.length).padStart(2, '0')}`;
        thumbnails.querySelectorAll('.gallery-thumb').forEach((button, buttonIndex) => {
            const isCurrent = buttonIndex === activeIndex;
            button.setAttribute('aria-pressed', String(isCurrent));
            if (isCurrent) button.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        });
    }

    screens.forEach((screen, index) => {
        const button = document.createElement('button');
        button.className = 'gallery-thumb';
        button.type = 'button';
        button.setAttribute('aria-label', `Show ${screen.title}`);
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = `<img src="${screen.src}" alt="" loading="lazy"><span>${screen.title}</span>`;
        button.addEventListener('click', () => selectScreen(index));
        thumbnails.append(button);
    });

    document.addEventListener('click', event => {
        const trigger = event.target.closest('[data-gallery="campusshield"]');
        if (!trigger) return;
        event.preventDefault();
        event.stopPropagation();
        selectScreen(0);
        dialog.showModal();
    }, true);

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
    document.querySelector('#campusshield-gallery-prev').addEventListener('click', () => selectScreen(activeIndex - 1));
    document.querySelector('#campusshield-gallery-next').addEventListener('click', () => selectScreen(activeIndex + 1));

    document.addEventListener('keydown', event => {
        if (!dialog.open) return;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            selectScreen(activeIndex - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            selectScreen(activeIndex + 1);
        }
    });

    stage.addEventListener('pointerdown', event => {
        touchStartX = event.clientX;
    });
    stage.addEventListener('pointerup', event => {
        const distance = event.clientX - touchStartX;
        if (Math.abs(distance) < 45) return;
        selectScreen(activeIndex + (distance < 0 ? 1 : -1));
    });
});