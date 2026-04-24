// ============================================
// js/main.js - FUNCIONES ESTÁTICAS PARA LA PÁGINA
// ============================================

// ===== 1. CARRUSEL DE IMÁGENES =====
let currentSlide = 0;
const slides = document.querySelectorAll('.carrusel-slide');
const indicadores = document.querySelectorAll('.indicador');

function showSlide(index) {
    if (!slides.length) return;

    // Ocultar todas las slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicadores.forEach(ind => ind.classList.remove('active'));

    // Mostrar la slide actual
    slides[index].classList.add('active');
    indicadores[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
}

function goToSlide(index) {
    showSlide(index);
}

// ===== 2. BOTONES DE COMPARTIR =====
function setupShareButtons() {
    const wspBtn = document.getElementById('share-wsp');
    const fbBtn = document.getElementById('share-fb');
    const twBtn = document.getElementById('share-tw');
    const copyBtn = document.getElementById('copy-link');

    if (wspBtn) {
        wspBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(document.title + ' - Comunidad Villa Rosario');
            window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        });
    }

    if (fbBtn) {
        fbBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        });
    }

    if (twBtn) {
        twBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(document.title + ' - Comunidad Villa Rosario');
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(window.location.href).then(() => {
                const msg = document.getElementById('copyMessage');
                if (msg) {
                    msg.classList.add('show');
                    setTimeout(() => msg.classList.remove('show'), 2000);
                }
            });
        });
    }
}

// ===== 3. INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Configurar carrusel
    if (slides.length > 0) {
        // Botones de navegación
        const prevBtn = document.querySelector('.carrusel-prev');
        const nextBtn = document.querySelector('.carrusel-next');

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Indicadores
        indicadores.forEach((indicador, index) => {
            indicador.addEventListener('click', () => goToSlide(index));
        });

        // Auto-play cada 5 segundos
        setInterval(nextSlide, 5000);

        // Mostrar primera slide
        showSlide(0);
    }

    // Configurar botones de compartir
    setupShareButtons();
});