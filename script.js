// ============================================
// MENU MOBILE (HAMBURGER)
// ============================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

// ============================================
// ANIMAÇÃO AO ROLAR
// ============================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.course-card, .story-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ============================================
// SISTEMA DE ÁUDIO - Speech Synthesis
// ============================================
let currentUtterance = null;
let currentPlayingElement = null;

function stopCurrentAudio() {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
    }
    if (currentPlayingElement) {
        currentPlayingElement.classList.remove('playing');
        const statusEl = currentPlayingElement.closest('.course-card, .story-card').querySelector('.audio-status');
        if (statusEl) statusEl.classList.remove('visible');
        currentPlayingElement = null;
        currentUtterance = null;
    }
}

function playAudio(videoElement, text) {
    if (currentPlayingElement === videoElement) {
        stopCurrentAudio();
        return;
    }

    stopCurrentAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const portugueseVoice = voices.find(v => v.lang.includes('pt') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('feminino')))
        || voices.find(v => v.lang.includes('pt-BR'))
        || voices.find(v => v.lang.includes('pt'));
    if (portugueseVoice) utterance.voice = portugueseVoice;

    const statusElement = videoElement.closest('.course-card, .story-card').querySelector('.audio-status');

    utterance.onstart = () => {
        videoElement.classList.add('playing');
        if (statusElement) statusElement.classList.add('visible');
        currentPlayingElement = videoElement;
        currentUtterance = utterance;
    };

    utterance.onend = () => {
        videoElement.classList.remove('playing');
        if (statusElement) statusElement.classList.remove('visible');
        currentPlayingElement = null;
        currentUtterance = null;
    };

    utterance.onerror = () => {
        videoElement.classList.remove('playing');
        if (statusElement) statusElement.classList.remove('visible');
        currentPlayingElement = null;
        currentUtterance = null;
    };

    window.speechSynthesis.speak(utterance);
}

// ============================================
// EVENT LISTENERS - CURSOS E DEPOIMENTOS
// ============================================
document.querySelectorAll('.course-video').forEach(video => {
    video.addEventListener('click', function(e) {
        e.stopPropagation();
        const text = this.getAttribute('data-text');
        if (text) playAudio(this, text);
    });
});

document.querySelectorAll('.story-video').forEach(video => {
    video.addEventListener('click', function(e) {
        e.stopPropagation();
        const text = this.getAttribute('data-text');
        if (text) playAudio(this, text);
    });
});

// ============================================
// BOTÕES DE COMPRAR - Checkout System
// ============================================
const HOTMART_LINKS = {
    'Mechas Premium 2026': 'https://go.hotmart.com/O106572652W?ap=6757',
};

document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        stopCurrentAudio();
        const courseCard = this.closest('.course-card');
        const courseName = courseCard.querySelector('h3').textContent.trim();
        const url = HOTMART_LINKS[courseName]
            || `https://pay.kiwify.com.br/checkout?productName=${encodeURIComponent(courseName)}`;
        window.open(url, '_blank', 'noopener');
    });
});

// ============================================
// CARREGAR VOZES
// ============================================
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
    setTimeout(() => { window.speechSynthesis.getVoices(); }, 100);
}

// ============================================
// FAQ ACCORDION
// ============================================
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const faqAnswer = button.nextElementSibling;
        
        // Fecha outros itens
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            }
        });
        
        // Abre/Fecha item clicado
        faqItem.classList.toggle('active');
        if (faqItem.classList.contains('active')) {
            faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
        } else {
            faqAnswer.style.maxHeight = null;
        }
    });
});

// Parar áudio ao sair da página
window.addEventListener('beforeunload', () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
});

// Prevenir zoom duplo toque em iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
}, false);

// Detectar orientação
function handleOrientation() {
    document.body.setAttribute('data-orientation', window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
}
window.addEventListener('orientationchange', handleOrientation);
window.addEventListener('resize', handleOrientation);
handleOrientation();

// ============================================
// THEME TOGGLE (LIGHT / DARK)
// ============================================
const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
    // Default is dark — light mode is set via data-theme="light"
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = '🌙';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggleBtn.textContent = '☀️';
    }

    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙';
        }
    });
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function startTimer(duration) {
    let timer = duration, hours, minutes, seconds;
    const display = document.getElementById('countdown');
    if (!display) return;
    
    setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + ":" + minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration; 
        }
    }, 1000);
}
// Timer de 2 horas e 15 minutos = 8100 segundos
startTimer(8100);

// ============================================
// POP-UP LEAD CAPTURE
// ============================================
setTimeout(() => {
    if (!localStorage.getItem('popupViewed')) {
        const popup = document.getElementById('lead-popup');
        if (popup) {
            popup.classList.add('show');
            document.querySelector('.close-popup').onclick = () => {
                popup.classList.remove('show');
                localStorage.setItem('popupViewed', 'true');
            };
            document.getElementById('lead-form').onsubmit = (e) => {
                e.preventDefault();
                
                const form = e.target;
                const btn = form.querySelector('button');
                const textoOriginal = btn.textContent;
                
                // Pega os dados
                const nome = form.querySelector('[name="nome"]').value;
                const email = form.querySelector('[name="email"]').value;
                
                // --- COLE SEU LINK DO GOOGLE APPS SCRIPT AQUI ABAIXO ---
                const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwH2S4BsCkR7kcG2hLI9wKcAdyljM6cNT7uRgIfVGwUH080y6vzOC7qnm_R0NSPyE-U/exec"; 
                // -------------------------------------------------------
                
                btn.textContent = 'Enviando...';
                
                function concluirEnvio() {
                    btn.textContent = textoOriginal;
                    alert('Cupom enviado com sucesso! Verifique seu e-mail.');
                    popup.classList.remove('show');
                    localStorage.setItem('popupViewed', 'true');
                }
                
                if (GOOGLE_SCRIPT_URL) {
                    const data = new URLSearchParams();
                    data.append('nome', nome);
                    data.append('email', email);
                    
                    fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        body: data,
                        mode: 'no-cors' // Necessário para Google Apps Script
                    }).then(() => {
                        concluirEnvio();
                    }).catch(() => {
                        concluirEnvio();
                    });
                } else {
                    // Simula se não tiver URL ainda
                    setTimeout(concluirEnvio, 1000);
                }
            };
        }
    }
}, 15000); // 15 Segundos

// ============================================
// MOBILE FLOATING BAR LOGIC
// ============================================
const floatBar = document.getElementById('mobile-float-bar');
const floatName = document.querySelector('.float-course-name');
const floatPrice = document.querySelector('.float-price');
const floatBtn = document.querySelector('.float-buy-btn');
let currentActiveCourse = null;

const courseObserver = new IntersectionObserver((entries) => {
    if (window.innerWidth > 768) {
        if(floatBar) floatBar.classList.remove('visible');
        return;
    }

    let found = false;
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            currentActiveCourse = entry.target;
            const name = currentActiveCourse.querySelector('h3').textContent;
            const price = currentActiveCourse.querySelector('.price').childNodes[0].nodeValue.trim();
            if(floatName) floatName.textContent = name;
            if(floatPrice) floatPrice.textContent = price;
            if(floatBar) floatBar.classList.add('visible');
            found = true;
        }
    });
    
    if (!found && !currentActiveCourse) {
        if(floatBar) floatBar.classList.remove('visible');
    }
}, { threshold: [0, 0.4, 0.8] });

document.querySelectorAll('.course-card').forEach(card => courseObserver.observe(card));

if (floatBtn) {
    floatBtn.addEventListener('click', () => {
        if (currentActiveCourse) {
            const buyBtn = currentActiveCourse.querySelector('.buy-button');
            if (buyBtn) buyBtn.click();
        } else {
            window.location.href = '#courses';
        }
    });
}

// Esconde botão flutuante perto do footer 
const footerObserver = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) {
        if(floatBar) floatBar.classList.remove('visible');
    } else if (currentActiveCourse && window.innerWidth <= 768) {
        if(floatBar) floatBar.classList.add('visible');
    }
}, { threshold: 0.1 });
const footerEl = document.querySelector('footer');
if(footerEl) footerObserver.observe(footerEl);
