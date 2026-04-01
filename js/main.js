/**
 * main.js - versão corrigida e responsiva
 * Autor: Sahil Aktar
 * Ajustado para mobile, tablet e desktop
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initActiveMenu();
    initSmoothScroll();
    initFormValidation();
    initTabs();
    initCertificadoModal();
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
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* =========================
   MENU MOBILE
========================= */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const body = document.body;

    if (!menuToggle || !menu) return;

    const icon = menuToggle.querySelector('i');

    const openMenu = () => {
        menu.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('menu-open');

        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    };

    const closeMenu = () => {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');

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
    menuToggle.addEventListener('touchstart', toggleMenu, { passive: false });

    document.addEventListener('click', (e) => {
        const clickedInsideMenu = menu.contains(e.target);
        const clickedToggle = menuToggle.contains(e.target);

        if (!clickedInsideMenu && !clickedToggle && menu.classList.contains('active')) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

/* =========================
   MENU ATIVO
========================= */
function initActiveMenu() {
    const menuItems = document.querySelectorAll('.menu a');
    if (!menuItems.length) return;

    let currentPage = window.location.pathname.split('/').pop();

    if (!currentPage || currentPage === '/') {
        currentPage = 'index.html';
    }

    menuItems.forEach((item) => {
        const href = item.getAttribute('href');

        item.classList.remove('ativo');

        if (
            href === currentPage ||
            (currentPage === 'index.html' && href === './') ||
            (currentPage === '' && href === 'index.html')
        ) {
            item.classList.add('ativo');
        }
    });
}

/* =========================
   SCROLL SUAVE
========================= */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const header = document.getElementById('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

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
function initFormValidation() {
    const form = document.getElementById('formContato');
    if (!form) return;

    const btn = document.getElementById('btnEnviar');
    const statusDiv = document.getElementById('mensagem-status');
    const telefone = document.getElementById('telefone');

    if (telefone) {
        telefone.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '').slice(0, 9);

            if (value.length > 5) {
                value = `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
            } else if (value.length > 2) {
                value = `${value.slice(0, 2)} ${value.slice(2)}`;
            }

            e.target.value = value;
        });
    }

    form.addEventListener('submit', function () {
        if (!btn) return;

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> A enviar...';

        if (statusDiv) {
            statusDiv.style.display = 'none';
        }

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
        }, 4000);
    });
}

/* =========================
   ABAS
========================= */
function initTabs() {
    const tabButtons = document.querySelectorAll('.aba-btn');
    const tabPanels = document.querySelectorAll('.aba-painel');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.aba;
            if (!target) return;

            tabButtons.forEach((btn) => btn.classList.remove('ativo'));
            tabPanels.forEach((panel) => panel.classList.remove('ativo'));

            button.classList.add('ativo');

            const activePanel = document.getElementById(target);
            if (activePanel) {
                activePanel.classList.add('ativo');
            }
        });
    });
}

/* =========================
   MODAL CERTIFICADOS
========================= */
function initCertificadoModal() {
    const cards = document.querySelectorAll('.certificado-card');
    const modal = document.querySelector('.modal-certificado');
    const modalImg = modal?.querySelector('img');
    const modalTitle = modal?.querySelector('.modal-legenda h4');
    const modalText = modal?.querySelector('.modal-legenda p');
    const closeBtn = modal?.querySelector('.fechar-modal');

    if (!cards.length || !modal || !modalImg) return;

    const closeModal = () => {
        modal.classList.remove('ativo');
        document.body.classList.remove('menu-open');
    };

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('.certificado-info h3');
            const text = card.querySelector('.certificado-info p');

            if (img) {
                modalImg.src = img.src;
                modalImg.alt = img.alt || 'Certificado';
            }

            if (modalTitle) {
                modalTitle.textContent = title ? title.textContent : 'Certificado';
            }

            if (modalText) {
                modalText.textContent = text ? text.textContent : '';
            }

            modal.classList.add('ativo');
            document.body.classList.add('menu-open');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('ativo')) {
            closeModal();
        }
    });
}

/* =========================
   FALLBACK DE IMAGEM
========================= */
function initImageFallback() {
    document.querySelectorAll('img').forEach((img) => {
        img.addEventListener(
            'error',
            function () {
                this.onerror = null;
                this.src =
                    'data:image/svg+xml;charset=UTF-8,' +
                    encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
                            <rect width="100%" height="100%" fill="#e9ecef"/>
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                                fill="#6c757d" font-size="24" font-family="Arial">
                                Imagem indisponível
                            </text>
                        </svg>
                    `);
            },
            { once: true }
        );
    });
}

/* =========================
   COPYRIGHT
========================= */
function updateCopyright() {
    const year = new Date().getFullYear();
    const copyright = document.querySelector('.copyright p');
    if (!copyright) return;

    copyright.innerHTML = `© ${year} Sahil Aktar - Todos os direitos reservados | Feito em Moçambique`;
}
