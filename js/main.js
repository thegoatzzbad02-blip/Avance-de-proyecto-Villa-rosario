// ============================================
// js/main.js - VERSIÓN MEJORADA Y UNIFICADA
// ============================================

(function() {
    // ===== MENÚ ACTIVO (resaltado según la URL actual) =====
    function setActiveNavLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ===== CERRAR MENÚ HAMBURGUESA AL HACER CLIC EN UN ENLACE (MÓVIL) =====
    function closeMenuOnMobile() {
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle && window.innerWidth <= 768) {
                    menuToggle.checked = false;
                }
            });
        });
    }

    // ===== CARRUSEL =====
    let carruselInterval = null;
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carrusel-slide');
    const indicadores = document.querySelectorAll('.indicador');

    function showSlide(index) {
        if (!slides.length) return;
        index = (index + slides.length) % slides.length;
        slides.forEach(slide => slide.classList.remove('active'));
        indicadores.forEach(ind => ind.classList.remove('active'));
        slides[index].classList.add('active');
        if (indicadores[index]) indicadores[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startCarousel() {
        if (carruselInterval) clearInterval(carruselInterval);
        if (slides.length > 0) {
            carruselInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopCarousel() {
        if (carruselInterval) {
            clearInterval(carruselInterval);
            carruselInterval = null;
        }
    }

    function setupCarousel() {
        if (!slides.length) return;
        
        const prevBtn = document.querySelector('.carrusel-prev');
        const nextBtn = document.querySelector('.carrusel-next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => { stopCarousel(); prevSlide(); startCarousel(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { stopCarousel(); nextSlide(); startCarousel(); });
        
        indicadores.forEach((ind, i) => {
            ind.addEventListener('click', () => { stopCarousel(); showSlide(i); startCarousel(); });
        });
        
        showSlide(0);
        startCarousel();
        
        // Pausar al pasar el mouse (opcional)
        const carouselContainer = document.querySelector('.carrusel-contenedor');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopCarousel);
            carouselContainer.addEventListener('mouseleave', startCarousel);
        }
    }

    // ===== BOTONES DE COMPARTIR (para noticia.html) =====
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
                }).catch(() => alert('No se pudo copiar el enlace'));
            });
        }
    }

    // ===== FILTROS Y MODALES PARA PROYECTOS =====
    function setupProyectos() {
        const tabs = document.querySelectorAll('.tab-btn');
        const proyectos = document.querySelectorAll('.proyecto-card');
        const modal = document.getElementById('modalProyecto');
        const modalDesc = document.getElementById('modalDescripcion');
        const closeModal = document.querySelector('.cerrar-modal-proyecto');
        const detallesBtns = document.querySelectorAll('.btn-detalles');
        
        if (tabs.length && proyectos.length) {
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const filter = tab.getAttribute('data-tab');
                    proyectos.forEach(proy => {
                        const estado = proy.getAttribute('data-estado');
                        if (filter === 'todos') proy.style.display = 'flex';
                        else if (filter === 'activos' && estado === 'activo') proy.style.display = 'flex';
                        else if (filter === 'futuros' && estado === 'futuro') proy.style.display = 'flex';
                        else proy.style.display = 'none';
                    });
                });
            });
        }
        
        if (modal && modalDesc && detallesBtns.length) {
            detallesBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const desc = btn.getAttribute('data-descripcion');
                    if (desc) {
                        modalDesc.innerHTML = desc;
                        modal.style.display = 'flex';
                    }
                });
            });
            if (closeModal) closeModal.addEventListener('click', () => modal.style.display = 'none');
            window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display === 'flex') modal.style.display = 'none'; });
        }
    }

    // ===== FILTROS Y TOAST PARA EVENTOS =====
    function setupEventos() {
        const filtros = document.querySelectorAll('.filtro-btn');
        const eventos = document.querySelectorAll('.evento-card-moderno');
        const botonesInteres = document.querySelectorAll('.btn-interesado');
        const toast = document.getElementById('toastMensaje');
        
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
        
        if (botonesInteres.length && toast) {
            botonesInteres.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const eventoNombre = btn.getAttribute('data-evento') || 'este evento';
                    toast.textContent = `✅ ¡Gracias! Te avisaremos sobre "${eventoNombre}"`;
                    toast.classList.add('mostrar');
                    setTimeout(() => toast.classList.remove('mostrar'), 3000);
                });
            });
        }
    }

    // ===== INICIALIZACIÓN GENERAL =====
    document.addEventListener('DOMContentLoaded', () => {
        setActiveNavLink();
        closeMenuOnMobile();
        setupCarousel();
        setupShareButtons();
        setupProyectos();
        setupEventos();
    });
})();