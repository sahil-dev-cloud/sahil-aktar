/**
 * main.js - Funcionalidades do site
 * Autor: Sahil Aktar
 * Data: 2026
 * Versão: 3.0 - Totalmente Responsivo e Otimizado
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado com sucesso!');
    
    // Inicializa todas as funcionalidades
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
    initAnimations();
    initImageFallback();
    updateCopyright();
    initActiveMenu();
    initModalCertificados();
    initScrollReveal();
});

/**
 * HEADER: Muda quando faz scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * MENU MOBILE: Funcionalidade do menu hamburguer com detecção de toque
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const menuItems = document.querySelectorAll('.menu a');
    
    if (!menuToggle || !menu) return;
    
    // Função para fechar o menu
    const closeMenu = () => {
        menu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
    };
    
    // Função para abrir o menu
    const openMenu = () => {
        menu.classList.add('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-times';
    };
    
    // Abre/fecha menu ao clicar no ícone
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Fecha menu ao clicar em um link
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && menu.classList.contains('active')) {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });
    
    // Fecha menu ao redimensionar a janela para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && menu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/**
 * MENU: Marca item ativo baseado na URL
 */
function initActiveMenu() {
    const menuItems = document.querySelectorAll('.menu a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        item.classList.remove('ativo');
        
        if (href === currentPage) {
            item.classList.add('ativo');
        }
        
        if ((currentPage === '' || currentPage === 'index.html') && href === 'index.html') {
            item.classList.add('ativo');
        }
    });
}

/**
 * SCROLL SUAVE para links internos (#)
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '' || href === 'javascript:void(0)') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fecha o menu mobile se estiver aberto
                if (window.innerWidth <= 768) {
                    const menu = document.getElementById('menu');
                    const menuToggle = document.getElementById('menuToggle');
                    if (menu && menu.classList.contains('active')) {
                        menu.classList.remove('active');
                        const icon = menuToggle?.querySelector('i');
                        if (icon) icon.className = 'fas fa-bars';
                    }
                }
            }
        });
    });
}

/**
 * FORMULÁRIO: Validação e envio
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        if (form.id === 'newsletterForm') {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                if (email) {
                    showMessage(this, `Obrigado! Em breve receberá novidades no email: ${email}`, 'success');
                    this.reset();
                }
            });
            return;
        }
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
                
                // Simula envio (substitua por AJAX real)
                setTimeout(() => {
                    showMessage(this, 'Mensagem enviada com sucesso! Entrarei em contacto em breve.', 'success');
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                showMessage(this, 'Por favor, preencha todos os campos corretamente.', 'error');
            }
        });
    });
}

/**
 * FORMULÁRIO: Valida campos
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.style.borderColor = '';
        field.classList.remove('error');
        
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545';
            field.classList.add('error');
            isValid = false;
        }
        
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                field.style.borderColor = '#dc3545';
                field.classList.add('error');
                isValid = false;
            }
        }
        
        if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^[0-9\s\+\-\(\)]{9,}$/;
            if (!phoneRegex.test(field.value.trim())) {
                field.style.borderColor = '#dc3545';
                field.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

/**
 * FORMULÁRIO: Mostra mensagem de feedback
 */
function showMessage(element, text, type) {
    const target = element.classList.contains('formulario-contato') ? element : element.closest('.formulario-contato') || element;
    
    const oldMessage = target.querySelector('.form-message');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${text}</span>
    `;
    
    message.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
    `;
    
    target.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (message.parentNode) message.remove();
            }, 300);
        }
    }, 5000);
}

/**
 * ANIMAÇÕES ao scroll com Intersection Observer
 */
function initAnimations() {
    const elements = document.querySelectorAll('.card, .sobre-grid, .section-title, .servico-card-home, .projeto-card, .certificado-card');
    
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

/**
 * SCROLL REVEAL: Animação adicional para elementos que aparecem ao rolar
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.skill-item-detalhe, .timeline-item, .faq-item, .processo-item');
    
    if (revealElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });
}

/**
 * IMAGENS: Fallback caso não carreguem
 */
function initImageFallback() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete && img.naturalHeight === 0) {
            setFallbackImage(img);
        }
        
        img.addEventListener('error', function() {
            setFallbackImage(this);
        });
    });
}

/**
 * Define imagem de fallback
 */
function setFallbackImage(img) {
    if (img.hasAttribute('data-fallback')) return;
    img.setAttribute('data-fallback', 'true');
    
    if (img.alt && img.alt.toLowerCase().includes('background')) {
        img.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';
    } else if (img.alt && img.alt.toLowerCase().includes('perfil')) {
        img.src = 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=764&q=80';
    } else {
        img.src = 'https://via.placeholder.com/800x600/2b6f9b/ffffff?text=Imagem+Não+Disponível';
    }
}

/**
 * COPYRIGHT: Atualiza ano automaticamente
 */
function updateCopyright() {
    const copyrightElements = document.querySelectorAll('.copyright p');
    const currentYear = new Date().getFullYear();
    
    copyrightElements.forEach(el => {
        el.innerHTML = el.innerHTML.replace(/© \d{4}/, `© ${currentYear}`);
    });
}

/**
 * MODAL: Funcionalidade para certificados
 */
function initModalCertificados() {
    const modal = document.getElementById('modalCertificado');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeBtn = document.querySelector('.fechar-modal');
    const certificados = document.querySelectorAll('.certificado-card');
    
    if (!modal || !modalImg) return;
    
    certificados.forEach(card => {
        card.addEventListener('click', function() {
            const img = this.querySelector('.certificado-imagem img');
            const title = this.querySelector('.certificado-info h3')?.innerText || 'Certificado';
            const desc = this.querySelector('.certificado-info p')?.innerText || '';
            
            if (img && img.src) {
                modalImg.src = img.src;
                modalImg.alt = title;
            }
            
            if (modalTitle) modalTitle.innerText = title;
            if (modalDesc) modalDesc.innerText = desc;
            
            modal.classList.add('ativo');
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('ativo');
        document.body.style.overflow = '';
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('ativo')) {
            closeModal();
        }
    });
}

/**
 * CONEXÃO: Detecta status da internet
 */
window.addEventListener('offline', function() {
    const warning = document.createElement('div');
    warning.id = 'connection-warning';
    warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #dc3545;
        color: white;
        text-align: center;
        padding: 0.5rem;
        z-index: 10000;
        animation: slideDown 0.3s ease;
        font-family: 'Open Sans', sans-serif;
    `;
    warning.innerHTML = '<i class="fas fa-wifi-slash"></i> Sem conexão com internet. Algumas funcionalidades podem estar limitadas.';
    document.body.prepend(warning);
});

window.addEventListener('online', function() {
    const warning = document.getElementById('connection-warning');
    if (warning) {
        warning.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => warning.remove(), 300);
    }
    
    const success = document.createElement('div');
    success.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #28a745;
        color: white;
        text-align: center;
        padding: 0.5rem;
        z-index: 10000;
        animation: slideDown 0.3s ease;
        font-family: 'Open Sans', sans-serif;
    `;
    success.innerHTML = '<i class="fas fa-wifi"></i> Conexão restabelecida!';
    document.body.prepend(success);
    
    setTimeout(() => {
        success.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => success.remove(), 300);
    }, 2000);
});

/**
 * LOADING: State para botões (função utilitária)
 */
function setLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
    } else {
        button.disabled = false;
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    }
}

/**
 * CLIPBOARD: Copiar texto (função utilitária)
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-family: 'Open Sans', sans-serif;
        `;
        tempDiv.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        document.body.appendChild(tempDiv);
        
        setTimeout(() => {
            tempDiv.remove();
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar. Tente novamente.');
    });
}

/**
 * ADICIONA ANIMAÇÕES GLOBAIS AO CSS
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-100%);
        }
    }
`;
document.head.appendChild(style);

console.log('main.js carregado e pronto!');
