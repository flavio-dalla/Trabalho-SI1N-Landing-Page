document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. SISTEMA DE FAGULHAS DE FOGO (CANVAS PARTICLE SYSTEM)
    // =======================================================
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Injeta o canvas no fundo da página
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-2'; // Fica atrás de tudo
    canvas.style.pointerEvents = 'none'; // Impede que o canvas bloqueie cliques
    document.body.insertBefore(canvas, document.body.firstChild);

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = [];

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * -2 - 0.5;
            this.speedX = (Math.random() - 0.5) * 1;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < 0) {
                this.y = height + 10;
                this.x = Math.random() * width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(218, 37, 29, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Cria 50 fagulhas
    for (let i = 0; i < 50; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // =======================================================
    // 2. SCROLL REVEAL AVANÇADO (COM OBSERVER E DELAY)
    // =======================================================
    const elementos = document.querySelectorAll('p, h2, ul, img, table, form, blockquote');
    elementos.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adiciona um pequeno atraso matemático para criar efeito dominó
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 50); 
                observer.unobserve(entry.target); // Para de observar depois que animou
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    elementos.forEach(el => observer.observe(el));

    // =======================================================
    // 3. EFEITO 3D TILT COM O MOUSE (VANILLA JS)
    // =======================================================
    const tiltElements = document.querySelectorAll('img, form');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calcula a porcentagem do mouse em relação ao centro do elemento
            const centerX = el.offsetWidth / 2;
            const centerY = el.offsetHeight / 2;
            
            // Força da inclinação (10 graus max)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Quando o mouse sai, volta suavemente ao normal
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        });

        // Quando o mouse entra, remove a transição lenta para o tilt seguir o mouse rapidamente
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none';
        });
    });
});