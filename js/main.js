/**
 * main.js - Funcionalidades do site
 * Versão: 3.0 - Responsivo, menu mobile corrigido e otimizado
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initActiveMenu();
    initSmoothScroll();
    initFormEnhancements();
    initTabs();
    initModalCertificado();
    initImageFallback();
    updateCopyright();
});

/* =========================
   HEADER SCROLL
========================= */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* =========================
   MENU ATIVO
========================= */
function initActiveMenu() {
    const links = document.querySelectorAll('.menu a');
    if (!links.length) return;

    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '/') currentPage = 'index.html';

    links.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('ativo');

        if (href === currentPage) {
            link.classList.add('ativo');
        }

        if (currentPage === 'index.html' && href === 'index.html') {
            link.classList.add('ativo');
        }
    });
}

/* =========================
   MENU MOBILE
========================= */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const header = document.getElementById('header');

    if (!menuToggle || !menu) return;

    const icon = menuToggle.querySelector('i');
    const menuLinks = menu.querySelectorAll('a');

    const openMenu = () => {
        menu.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');

        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    };

    const closeMenu = () => {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');

        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };

    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    menuToggle.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;

        const clickedInsideMenu = menu.contains(e.target);
        const clickedToggle = menuToggle.contains(e.target);

        if (!clickedInsideMenu && !clickedToggle && menu.classList.contains('active')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });

    if (header) {
        const observer = new MutationObserver(() => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        observer.observe(header, { attributes: true, attributeFilter: ['class'] });
    }
}

/* =========================
   SCROLL SUAVE
========================= */
function initSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const header = document.getElementById('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        });
    });
}

/* =========================
   FORMULÁRIO
========================= */
function initFormEnhancements() {
    const form = document.getElementById('formContato');
    const telefone = document.getElementById('telefone');
    const btn = document.getElementById('btnEnviar');
    const statusDiv = document.getElementById('mensagem-status');

    if (telefone) {
        telefone.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '').slice(0, 9);

            if (value.length > 5) {
                value = `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
            } else if (value.length > 2) {
                value = `${value.slice(0, 2)} ${value.slice(2)}`;
            }

            e.target.value = value;
        });
    }

    if (!form) return;

    form.addEventListener('submit', () => {
        if (!btn) return;

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> A enviar...';

        if (statusDiv) {
            statusDiv.style.display = 'none';
        }

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
        }, 5000);
    });

    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
}

/* =========================
   ABAS
========================= */
function initTabs() {
    const buttons = document.querySelectorAll('.aba-btn');
    const panels = document.querySelectorAll('.aba-painel');

    if (!buttons.length || !panels.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-aba');
            if (!target) return;

            buttons.forEach(btn => btn.classList.remove('ativo'));
            panels.forEach(panel => panel.classList.remove('ativo'));

            button.classList.add('ativo');

            const activePanel = document.getElementById(target);
            if (activePanel) {
                activePanel.classList.add('ativo');
            }
        });
    });
}

/* =========================
   MODAL CERTIFICADO
========================= */
function initModalCertificado() {
    const modal = document.getElementById('modalCertificado');
    if (!modal) return;

    const closeBtn = modal.querySelector('.fechar-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', fecharModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('ativo')) {
            fecharModal();
        }
    });
}

function abrirModal(src, titulo, descricao = '') {
    const modal = document.getElementById('modalCertificado');
    const img = document.getElementById('modalImagem');
    const tituloEl = document.getElementById('modalTitulo');
    const descricaoEl = document.getElementById('modalDescricao');

    if (!modal || !img || !tituloEl || !descricaoEl) return;

    img.src = src;
    img.alt = titulo;
    tituloEl.textContent = titulo;
    descricaoEl.textContent = descricao;
    modal.classList.add('ativo');
    document.body.classList.add('menu-open');
}

function fecharModal() {
    const modal = document.getElementById('modalCertificado');
    if (!modal) return;

    modal.classList.remove('ativo');
    document.body.classList.remove('menu-open');
}

/* =========================
   FALLBACK DE IMAGENS
========================= */
function initImageFallback() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.style.objectFit = 'contain';
            this.style.background = '#f1f3f5';
        });
    });
}

/* =========================
   COPYRIGHT
========================= */
function updateCopyright() {
    const year = new Date().getFullYear();
    document.querySelectorAll('.copyright p').forEach(el => {
        el.textContent = `© ${year} Sahil Aktar - Todos os direitos reservados | Feito em Moçambique`;
    });
}
