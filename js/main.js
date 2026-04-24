// ============================================
// js/main.js - CARGA DINÁMICA DE CONTENIDOS
// ============================================

// Función para parsear frontmatter de archivos Markdown
function parseFrontmatter(markdown) {
    const partes = markdown.split('---\n');
    if (partes.length >= 3) {
        const frontmatter = jsyaml.load(partes[1]);
        const body = partes.slice(2).join('---\n');
        return { ...frontmatter, body };
    }
    return { title: 'Sin título', body: markdown, categoria: 'General', date: new Date() };
}

// ===== 1. CONFIGURACIÓN GENERAL =====
async function cargarConfiguracion() {
    try {
        const res = await fetch('/_data/configuracion.yml');
        if (!res.ok) throw new Error('No se pudo cargar la configuración');
        const texto = await res.text();
        const data = jsyaml.load(texto);
        
        // Actualizar elementos comunes (asegúrate de que existan en tu HTML)
        const telefonoElem = document.getElementById('telefono-contacto');
        if (telefonoElem) telefonoElem.innerText = data.telefono || 'No disponible';
        
        const emailElem = document.getElementById('email-contacto');
        if (emailElem) emailElem.innerText = data.email || 'No disponible';
        
        const direccionElem = document.getElementById('direccion-contacto');
        if (direccionElem) direccionElem.innerText = data.direccion || 'No disponible';
        
        const horarioElem = document.getElementById('horario-atencion');
        if (horarioElem) horarioElem.innerText = data.horario || 'No disponible';
        
        const whatsappLink = document.getElementById('whatsapp-group-link');
        if (whatsappLink && data.whatsapp_url) whatsappLink.href = data.whatsapp_url;
        
        // También actualizar footer o hero si tienen IDs específicos
        const telefonoHero = document.getElementById('telefono-hero');
        if (telefonoHero) telefonoHero.innerText = data.telefono || '';
    } catch (error) {
        console.error('Error cargando configuración:', error);
    }
}

// ===== 2. ALERTAS COMUNITARIAS =====
async function cargarAlertas() {
    try {
        const res = await fetch('/_data/alertas.yml');
        const texto = await res.text();
        const data = jsyaml.load(texto);
        const alertas = data.alertas || [];
        const contenedor = document.querySelector('.alertas-grid');
        if (!contenedor) return;
        
        let html = '';
        alertas.forEach(alerta => {
            let claseIcono = '';
            let icono = '';
            if (alerta.tipo === 'urgente') {
                claseIcono = 'alerta-urgente';
                icono = 'fa-exclamation-triangle';
            } else if (alerta.tipo === 'info') {
                claseIcono = 'alerta-info';
                icono = 'fa-info-circle';
            } else {
                claseIcono = 'alerta-evento';
                icono = 'fa-calendar-check';
            }
            html += `
                <div class="alerta-item ${claseIcono}">
                    <div class="alerta-icon">
                        <i class="fas ${icono}"></i>
                    </div>
                    <div class="alerta-content">
                        <h3>${escapeHtml(alerta.titulo)}</h3>
                        <p>${escapeHtml(alerta.descripcion)}</p>
                        <span class="alerta-fecha"><i class="far fa-calendar"></i> ${new Date(alerta.fecha).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        });
        contenedor.innerHTML = html;
    } catch (error) {
        console.error('Error cargando alertas:', error);
    }
}

// ===== 3. NOTICIAS (listado) =====
async function obtenerListaNoticias() {
    // Reemplaza con tu usuario y repositorio de GitHub
    const repoOwner = 'TU_USUARIO_DE_GITHUB';
    const repoName = 'TU_REPOSITORIO';
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/_posts/noticias`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('No se pudo obtener lista de noticias');
        const files = await res.json();
        return files
            .filter(f => f.name.endsWith('.md'))
            .map(f => ({
                slug: f.name.replace('.md', ''),
                download_url: f.download_url,
                fecha: f.name.split('-').slice(0,3).join('-')
            }))
            .sort((a,b) => b.fecha.localeCompare(a.fecha));
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        return [];
    }
}

async function mostrarUltimasNoticias() {
    const noticias = await obtenerListaNoticias();
    const contenedor = document.getElementById('lista-noticias-index');
    if (!contenedor) return;
    
    const ultimas = noticias.slice(0, 3);
    let html = '';
    for (const noticia of ultimas) {
        try {
            const res = await fetch(noticia.download_url);
            const markdown = await res.text();
            const parsed = parseFrontmatter(markdown);
            const categoriaSlug = parsed.categoria ? parsed.categoria.toLowerCase().replace(/ /g, '-') : 'general';
            html += `
                <article class="noticia-card" data-categoria="${categoriaSlug}">
                    <div class="noticia-header">
                        <span class="noticia-categoria">${escapeHtml(parsed.categoria || 'General')}</span>
                        <span class="noticia-fecha">${new Date(parsed.date).toLocaleDateString()}</span>
                    </div>
                    <div class="noticia-body">
                        <h3>${escapeHtml(parsed.title)}</h3>
                        <p>${escapeHtml(parsed.resumen || parsed.body.substring(0, 100))}...</p>
                    </div>
                    <div class="noticia-footer">
                        <a href="noticia.html?slug=${noticia.slug}" class="btn-leer-mas">Leer más</a>
                    </div>
                </article>
            `;
        } catch (e) { console.error(e); }
    }
    contenedor.innerHTML = html;
}

async function cargarTodasNoticias() {
    const noticias = await obtenerListaNoticias();
    const contenedor = document.getElementById('lista-noticias-completa');
    if (!contenedor) return;
    
    let html = '';
    for (const noticia of noticias) {
        try {
            const res = await fetch(noticia.download_url);
            const markdown = await res.text();
            const parsed = parseFrontmatter(markdown);
            const categoriaSlug = parsed.categoria ? parsed.categoria.toLowerCase().replace(/ /g, '-') : 'general';
            html += `
                <article class="noticia-card" data-categoria="${categoriaSlug}">
                    <div class="noticia-header">
                        <span class="noticia-categoria">${escapeHtml(parsed.categoria || 'General')}</span>
                        <span class="noticia-fecha">${new Date(parsed.date).toLocaleDateString()}</span>
                    </div>
                    <div class="noticia-body">
                        <h3>${escapeHtml(parsed.title)}</h3>
                        <p>${escapeHtml(parsed.resumen || parsed.body.substring(0, 150))}...</p>
                    </div>
                    <div class="noticia-footer">
                        <a href="noticia.html?slug=${noticia.slug}" class="btn-leer-mas">Leer más</a>
                    </div>
                </article>
            `;
        } catch (e) { console.error(e); }
    }
    contenedor.innerHTML = html;
}

// ===== 4. NOTICIA INDIVIDUAL (detalle) =====
async function cargarNoticiaIndividual() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    if (!slug) return;
    
    const noticias = await obtenerListaNoticias();
    const noticia = noticias.find(n => n.slug === slug);
    if (!noticia) return;
    
    try {
        const res = await fetch(noticia.download_url);
        const markdown = await res.text();
        const parsed = parseFrontmatter(markdown);
        const contenidoHtml = marked.parse(parsed.body);
        
        const contenedor = document.getElementById('noticia-completa');
        if (!contenedor) return;
        
        contenedor.innerHTML = `
            <div class="noticia-completa-header">
                <div style="display: flex; justify-content: space-between;">
                    <span class="noticia-categoria-badge">${escapeHtml(parsed.categoria || 'General')}</span>
                    <span>${new Date(parsed.date).toLocaleDateString()}</span>
                </div>
                <h1>${escapeHtml(parsed.title)}</h1>
                ${parsed.imagen ? `<img src="${parsed.imagen}" alt="${escapeHtml(parsed.title)}" class="noticia-imagen-destacada">` : ''}
            </div>
            <div class="noticia-completa-contenido">
                ${contenidoHtml}
            </div>
        `;
        
        // Actualizar metadatos de la página
        document.title = `${parsed.title} - Villa Rosario`;
        
        // Configurar botones de compartir (si existen)
        const currentUrl = window.location.href;
        const wspBtn = document.getElementById('share-wsp');
        if (wspBtn) wspBtn.href = `https://wa.me/?text=${encodeURIComponent(parsed.title + ' ' + currentUrl)}`;
        const fbBtn = document.getElementById('share-fb');
        if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        const twBtn = document.getElementById('share-tw');
        if (twBtn) twBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(parsed.title)}&url=${encodeURIComponent(currentUrl)}`;
        
        const copyBtn = document.getElementById('copy-link');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(currentUrl);
                const msg = document.getElementById('copyMessage');
                if (msg) { msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 2000); }
            });
        }
    } catch (error) {
        console.error('Error cargando noticia:', error);
        document.getElementById('noticia-completa').innerHTML = '<p>Error al cargar la noticia.</p>';
    }
}

// ===== 5. EMPRENDEDORES =====
async function cargarEmprendedores() {
    try {
        const res = await fetch('/_data/emprendedores.yml');
        const texto = await res.text();
        const data = jsyaml.load(texto);
        const emprendedores = data.emprendedores || [];
        const contenedor = document.querySelector('.emprendedores-grid');
        if (!contenedor) return;
        
        let html = '';
        emprendedores.forEach(emp => {
            html += `
                <div class="emprendedor-card">
                    <div class="emprendedor-imagen">
                        <img src="${emp.imagen || 'img/default.jpg'}" alt="${escapeHtml(emp.nombre)}" loading="lazy">
                    </div>
                    <div class="emprendedor-info">
                        <h3>${escapeHtml(emp.nombre)}</h3>
                        <p class="emprendedor-descripcion">${escapeHtml(emp.descripcion)}</p>
                        <div class="emprendedor-contacto">
                            ${emp.telefono ? `<p><i class="fas fa-phone"></i> ${emp.telefono}</p>` : ''}
                            ${emp.whatsapp ? `<p><i class="fab fa-whatsapp"></i> ${emp.whatsapp}</p>` : ''}
                            ${emp.instagram ? `<p><i class="fab fa-instagram"></i> ${emp.instagram}</p>` : ''}
                            ${emp.facebook ? `<p><i class="fab fa-facebook"></i> ${emp.facebook}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        contenedor.innerHTML = html;
    } catch (error) {
        console.error('Error cargando emprendedores:', error);
    }
}

// ===== 6. EVENTOS =====
async function cargarEventos() {
    try {
        const res = await fetch('/_data/eventos.yml');
        const texto = await res.text();
        const data = jsyaml.load(texto);
        const eventos = data.eventos || [];
        const contenedor = document.getElementById('lista-eventos-index');
        if (!contenedor) return;
        
        let html = '';
        eventos.forEach(ev => {
            html += `
                <article class="evento-preview">
                    <h3>${escapeHtml(ev.titulo)}</h3>
                    <p class="fecha"><i class="far fa-calendar-alt"></i> ${new Date(ev.fecha_hora).toLocaleString()}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(ev.lugar)}</p>
                    <p>${escapeHtml(ev.descripcion)}</p>
                </article>
            `;
        });
        contenedor.innerHTML = html;
    } catch (error) {
        console.error('Error cargando eventos:', error);
    }
}

// ===== 7. SERVICIOS PÚBLICOS =====
async function cargarServicios() {
    try {
        const res = await fetch('/_data/servicios.yml');
        const texto = await res.text();
        const data = jsyaml.load(texto);
        
        // Actualizar cada servicio (asume que cada contenedor tiene un ID como "servicio-agua", "servicio-electricidad", etc.)
        actualizarServicio('agua', data.agua);
        actualizarServicio('electricidad', data.electricidad);
        actualizarServicio('aseo', data.aseo);
        actualizarServicio('internet', data.internet);
        
        // Historial de gestiones
        const gestionesDiv = document.getElementById('gestiones-lista');
        if (gestionesDiv && data.gestiones) {
            let html = '<ul class="gestiones-list">';
            data.gestiones.forEach(g => {
                html += `<li><strong>${g.fecha}</strong> - ${escapeHtml(g.descripcion)}</li>`;
            });
            html += '</ul>';
            gestionesDiv.innerHTML = html;
        }
    } catch (error) {
        console.error('Error cargando servicios:', error);
    }
}

function actualizarServicio(id, servicio) {
    const contenedor = document.getElementById(`servicio-${id}`);
    if (!contenedor) return;
    const estadoSpan = contenedor.querySelector('.estado-badge');
    if (estadoSpan) {
        const estadoTexto = servicio.estado.charAt(0).toUpperCase() + servicio.estado.slice(1);
        estadoSpan.className = `estado-badge estado-${servicio.estado}`;
        estadoSpan.innerText = estadoTexto;
    }
    const textoExtra = contenedor.querySelector('.texto-extra');
    if (textoExtra && servicio.texto) textoExtra.innerText = servicio.texto;
}

// ===== 8. INICIALIZACIÓN según la página =====
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Cargar configuración en todas las páginas
    cargarConfiguracion();
    
    // Detectar qué página estamos y cargar lo correspondiente
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        cargarAlertas();
        cargarEventos();
        mostrarUltimasNoticias();
    }
    if (path.includes('articulos.html')) {
        cargarTodasNoticias();
    }
    if (path.includes('noticia.html')) {
        cargarNoticiaIndividual();
    }
    if (path.includes('emprendedores.html')) {
        cargarEmprendedores();
    }
    if (path.includes('servicios.html')) {
        cargarServicios();
    }
});