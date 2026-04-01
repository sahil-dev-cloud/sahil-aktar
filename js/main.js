/**
 * main.js - Funcionalidades do site
 * Autor: Sahil Aktar
 * Data: 2026
 * Versão: 2.0 - Corrigido e Otimizado
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado com sucesso!');
    
    // Inicializa todas as funcionalidades
    initHeaderScroll();
    initMobileMenu();
    initMenuHover(); // NOVA FUNÇÃO
    initSmoothScroll();
    initFormValidation();
    initAnimations();
    initImageFallback();
    updateCopyright();
    initActiveMenu();
});

/**
 * HEADER: Muda quando faz scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (!header) return; // Verifica se o header existe
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * MENU: Destaque ao passar o mouse (HOVER)
 * NOVA FUNÇÃO - Quando passa o mouse no menu, fica em destaque
 */
function initMenuHover() {
    const menuItems = document.querySelectorAll('.menu a');
    
    menuItems.forEach(item => {
        // Efeito ao entrar com o mouse
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('ativo')) {
                this.style.transform = 'scale(1.05)';
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                this.style.transition = 'all 0.3s ease';
            }
        });
        
        // Efeito ao sair com o mouse
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('ativo')) {
                this.style.transform = 'scale(1)';
                this.style.backgroundColor = 'transparent';
            }
        });
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
        
        // Remove classe ativo de todos
        item.classList.remove('ativo');
        
        // Adiciona classe ativo ao item correspondente
        if (href === currentPage) {
            item.classList.add('ativo');
        }
        
        // Caso especial para index.html
        if (currentPage === '' || currentPage === 'index.html' && href === 'index.html') {
            if (href === 'index.html') {
                item.classList.add('ativo');
            }
        }
    });
}

/**
 * MENU MOBILE: Funcionalidade do menu hamburguer
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const menuItems = document.querySelectorAll('.menu a');
    
    if (!menuToggle || !menu) return;
    
    // Abre/fecha menu ao clicar no ícone
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('active');
        
        // Muda o ícone (X ou barras)
        const icon = this.querySelector('i');
        if (menu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Fecha menu ao clicar em um link
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    });
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                menu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
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
            
            // Ignora links vazios ou apenas "#"
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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
        // Ignora formulários de newsletter ou outros específicos
        if (form.id === 'newsletterForm') {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                showMessage(this, `Obrigado! Em breve receberá novidades no email: ${email}`, 'success');
                this.reset();
            });
            return;
        }
        
        // Formulário de contato principal
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Botão de loading
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
                
                // Simula envio (aqui você pode adicionar o envio real via AJAX)
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
        // Remove erro anterior
        field.style.borderColor = '';
        field.classList.remove('error');
        
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545';
            field.classList.add('error');
            isValid = false;
        }
        
        // Validação específica de email
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                field.style.borderColor = '#dc3545';
                field.classList.add('error');
                isValid = false;
            }
        }
        
        // Validação de telefone (opcional)
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
    // Determina onde inserir a mensagem
    const target = element.classList.contains('formulario-contato') ? element : element.closest('.formulario-contato') || element;
    
    // Remove mensagem anterior se existir
    const oldMessage = target.querySelector('.form-message');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    // Cria nova mensagem
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${text}</span>
    `;
    
    // Estilos da mensagem
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
    
    // Remove após 5 segundos
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
 * ANIMAÇÕES ao scroll (fade in)
 */
function initAnimations() {
    const elements = document.querySelectorAll('.card, .sobre-grid, .section-title, .servico-card-home, .projeto-card');
    
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Para de observar após animar
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
 * IMAGENS: Fallback caso não carreguem
 */
function initImageFallback() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Verifica se a imagem já carregou
        if (img.complete && img.naturalHeight === 0) {
            setFallbackImage(img);
        }
        
        // Evento de erro
        img.addEventListener('error', function() {
            setFallbackImage(this);
        });
    });
}

/**
 * Define imagem de fallback
 */
function setFallbackImage(img) {
    // Evita loop infinito
    if (img.hasAttribute('data-fallback')) return;
    img.setAttribute('data-fallback', 'true');
    
    // Define fallback baseado no contexto
    if (img.alt && img.alt.toLowerCase().includes('background')) {
        img.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';
    } else if (img.alt && img.alt.toLowerCase().includes('perfil')) {
        img.src = 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=764&q=80';
    } else {
        img.src = 'https://via.placeholder.com/800x600/2b6f9b/ffffff?text=Sahil+Aktar';
    }
}

/**
 * COPYRIGHT: Atualiza ano automaticamente
 */
function updateCopyright() {
    const copyrightElements = document.querySelectorAll('.copyright p');
    const currentYear = new Date().getFullYear();
    
    copyrightElements.forEach(el => {
        // Substitui o ano no texto
        el.innerHTML = el.innerHTML.replace(/© \d{4}/, `© ${currentYear}`);
    });
}

/**
 * LOADING: State para botões
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
 * CLIPBOARD: Copiar texto
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Mostra mensagem de sucesso
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
    
    // Mostra mensagem de sucesso
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
    `;
    success.innerHTML = '<i class="fas fa-wifi"></i> Conexão restabelecida!';
    document.body.prepend(success);
    
    setTimeout(() => {
        success.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => success.remove(), 300);
    }, 2000);
});

/**
 * ANIMAÇÕES GLOBAIS (adiciona ao CSS via JS)
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
    
    /* Efeito hover no menu (garantia) */
    .menu a {
        transition: all 0.3s ease !important;
    }
    
    .menu a:hover {
        transform: scale(1.05);
        background-color: rgba(255, 255, 255, 0.2) !important;
    }
    
    .menu a.ativo:hover {
        transform: scale(1);
        background-color: var(--branco) !important;
    }
`;
document.head.appendChild(style);

console.log('main.js carregado e pronto!');