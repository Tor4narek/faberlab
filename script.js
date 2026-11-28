document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
const form = document.querySelector('#contact-form');
form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    if (!form.reportValidity()) return;
    const endpoint = form.dataset.endpoint.trim();
    if (!endpoint) {
        status.textContent = 'Форма пока подключается. Напишите нам на faberlab@mail.ru.';
        return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Отправляем заявку…';
    try {
        const data = Object.fromEntries(new FormData(form));
        data._subject = 'Новая заявка с сайта FaberLab';
        data._template = 'table';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false || result.success === 'false') throw new Error('Request failed');
        form.reset();
        status.textContent = 'Спасибо! Заявка отправлена.';
    } catch {
        status.textContent = 'Не получилось отправить заявку. Попробуйте ещё раз или напишите на faberlab@mail.ru.';
    } finally {
        button.disabled = false;
    }
});

