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
// =============================================
// FUNCIONALIDAD PARA LA PÁGINA DE PROYECTOS
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // --- Filtrado por pestañas (Todos / Activos / Futuros) ---
    const tabs = document.querySelectorAll('.tab-btn');
    const proyectos = document.querySelectorAll('.proyecto-card');

    if (tabs.length && proyectos.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Cambiar clase activa en las pestañas
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-tab');
                proyectos.forEach(proy => {
                    const estado = proy.getAttribute('data-estado');
                    if (filter === 'todos') {
                        proy.style.display = 'flex';
                    } else if (filter === 'activos' && estado === 'activo') {
                        proy.style.display = 'flex';
                    } else if (filter === 'futuros' && estado === 'futuro') {
                        proy.style.display = 'flex';
                    } else {
                        proy.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Modal de detalles ---
    const modal = document.getElementById('modalProyecto');
    const modalDesc = document.getElementById('modalDescripcion');
    const closeModal = document.querySelector('.cerrar-modal-proyecto');
    const detallesBtns = document.querySelectorAll('.btn-detalles');

    if (modal && modalDesc && detallesBtns.length) {
        detallesBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const descripcion = btn.getAttribute('data-descripcion');
                if (descripcion) {
                    modalDesc.innerHTML = descripcion;
                    modal.style.display = 'flex';
                }
            });
        });

        // Cerrar modal con el botón X
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Cerrar modal haciendo clic fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }
});
// =============================================
// FUNCIONALIDAD PARA LA PÁGINA DE EVENTOS
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // --- Filtrado por mes (o por categoría) ---
    const filtros = document.querySelectorAll('.filtro-btn');
    const eventos = document.querySelectorAll('.evento-card-moderno');

    if (filtros.length && eventos.length) {
        filtros.forEach(btn => {
            btn.addEventListener('click', () => {
                filtros.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const mesFiltro = btn.getAttribute('data-mes');
                eventos.forEach(evento => {
                    const mesEvento = evento.getAttribute('data-mes');
                    if (mesFiltro === 'todos' || mesEvento === mesFiltro) {
                        evento.style.display = 'flex';
                    } else {
                        evento.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Botones "Me interesa" (muestra un toast) ---
    const botonesInteres = document.querySelectorAll('.btn-interesado');
    const toast = document.getElementById('toastMensaje');

    if (botonesInteres.length && toast) {
        botonesInteres.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventoNombre = btn.getAttribute('data-evento') || 'este evento';
                // Mostrar notificación
                toast.textContent = `✅ ¡Gracias! Te avisaremos sobre "${eventoNombre}"`;
                toast.classList.add('mostrar');
                setTimeout(() => {
                    toast.classList.remove('mostrar');
                }, 3000);
            });
        });
    }
});