document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const confetti = window.JSConfetti && !reducedMotion.matches ? new window.JSConfetti() : null;

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => {
        if (button.disabled) return;
        confetti?.addConfetti({
            confettiColors: ['#a0db0d', '#e2074c', '#ffad2a'],
            confettiRadius: 3,
            confettiNumber: 28
        });
    });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            }
        });
    }, {threshold: 0.12});
    revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('is-visible'));
const cursor = document.querySelector('.case-cursor');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.case:not(.case-cta) .case-cover').forEach(cover => {
        cover.addEventListener('pointerenter', event => {
            cursor.style.left = `${event.clientX}px`;
            cursor.style.top = `${event.clientY}px`;
            cursor.classList.add('visible');
        });
        cover.addEventListener('pointermove', event => {
            cursor.style.left = `${event.clientX}px`;
            cursor.style.top = `${event.clientY}px`;
        });
        cover.addEventListener('pointerleave', () => cursor.classList.remove('visible'));
    });
    window.addEventListener('blur', () => cursor.classList.remove('visible'));
}

const projectField = document.querySelector('textarea[name="message"]');
const projectExamples = [
    'Мы хотим CRM-систему для школы',
    'Мне нужна админ-панель для интернет-магазина',
    'Нужно автоматизировать обработку заявок',
    'Хотим внедрить ИИ-ассистента для команды'
];

if (projectField) {
    let placeholderTimer;
    let exampleIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    const stopPlaceholderAnimation = () => clearTimeout(placeholderTimer);
    const animatePlaceholder = () => {
        if (reducedMotion.matches || projectField.value || document.activeElement === projectField) return;

        const phrase = projectExamples[exampleIndex];
        characterIndex += isDeleting ? -1 : 1;
        projectField.placeholder = phrase.slice(0, characterIndex);

        let delay = isDeleting ? 26 : 48;
        if (!isDeleting && characterIndex === phrase.length) {
            isDeleting = true;
            delay = 1500;
        } else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            exampleIndex = (exampleIndex + 1) % projectExamples.length;
            delay = 360;
        }

        placeholderTimer = setTimeout(animatePlaceholder, delay);
    };

    if (reducedMotion.matches) projectField.placeholder = projectExamples[0];
    else {
        projectField.placeholder = '';
        animatePlaceholder();
    }

    projectField.addEventListener('focus', stopPlaceholderAnimation);
    projectField.addEventListener('input', () => {
        stopPlaceholderAnimation();
        if (!projectField.value && document.activeElement !== projectField) animatePlaceholder();
    });
    projectField.addEventListener('blur', () => {
        if (!projectField.value && !reducedMotion.matches) {
            stopPlaceholderAnimation();
            placeholderTimer = setTimeout(animatePlaceholder, 400);
        }
    });
}

const form = document.querySelector('#contact-form');
const copyrightYears = document.querySelector('[data-copyright-years]');
const copyrightStartYear = 2025;
const currentYear = new Date().getFullYear();

if (copyrightYears) {
    copyrightYears.textContent = currentYear > copyrightStartYear
        ? `${copyrightStartYear}–${currentYear}`
        : `${copyrightStartYear}`;
}

if (form) {
    const contact = form.closest('.contact');
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = button.querySelector('.button-label');
    const controls = form.querySelectorAll('input, textarea, button');
    const setControlsDisabled = disabled => controls.forEach(control => {
        control.disabled = disabled;
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const endpoint = form.dataset.endpoint.trim();
        if (!endpoint) {
            status.textContent = 'Форма пока подключается. Напишите нам на faberlab@mail.ru.';
            return;
        }

        const data = Object.fromEntries(new FormData(form));
        data._subject = 'Новая заявка с сайта FaberLab';
        data._template = 'table';
        contact.classList.remove('is-success');
        contact.classList.add('is-loading');
        contact.setAttribute('aria-busy', 'true');
        setControlsDisabled(true);
        buttonLabel.textContent = 'Отправляем…';
        status.textContent = 'Отправляем заявку…';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify(data)
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || result.success === false || result.success === 'false') throw new Error('Request failed');

            form.reset();
            contact.classList.remove('is-loading');
            contact.classList.add('is-success');
            contact.setAttribute('aria-busy', 'false');
            status.textContent = 'Спасибо! Заявка отправлена. Скоро мы свяжемся с вами.';
            confetti?.addConfetti({
                confettiColors: ['#a0db0d', '#e2074c', '#fffefe'],
                confettiRadius: 5,
                confettiNumber: 160
            });
        } catch {
            contact.classList.remove('is-loading');
            contact.setAttribute('aria-busy', 'false');
            setControlsDisabled(false);
            buttonLabel.textContent = 'Попробовать ещё раз';
            status.textContent = 'Не получилось отправить заявку. Попробуйте ещё раз или напишите на faberlab@mail.ru.';
        }
    });
}

