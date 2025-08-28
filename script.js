// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.classList.toggle('active'));
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('active'));
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .about-content, .contact-content');
    animateElements.forEach(el => observer.observe(el));
});



function typeWriter(el, text, speed = 100) {
  if (!el) return;
  if (el.dataset.typed === '1') return; // prevent reruns
  let i = 0;
  el.textContent = '';
  (function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i++);
      setTimeout(type, speed);
    } else {
      el.dataset.typed = '1';
    }
  })();
}

document.addEventListener('DOMContentLoaded', () => {
  const nameSpan = document.getElementById('hero-name');
  if (nameSpan) {
    const nameText = nameSpan.getAttribute('data-name') || nameSpan.textContent || 'Sevara Badriddinova';
    typeWriter(nameSpan, nameText, 50);
  }
});
  

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add active class to current navigation item
function updateActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavItem);

// Add CSS for active navigation state
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .bar.active:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .bar.active:nth-child(2) {
        opacity: 0;
    }
    
    .bar.active:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Smooth reveal animation for timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        item.style.transition = 'all 0.6s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, index * 200);
});

// Add hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});



// Add scroll-to-top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--gradient-primary);
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll-to-top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect for scroll-to-top button
scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// AJAX contact form submission with toast
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    const originalClass = submitBtn.className;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch('https://formsubmit.co/ajax/bsevaraqq@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...payload, _template: 'table' })
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      if (data.success) {
        form.reset();
        submitBtn.className = submitBtn.className.replace('btn-primary', '').replace('btn-secondary', '').trim() + ' btn-success';
        submitBtn.innerHTML = 'Sent <i class="fas fa-check"></i>';
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      submitBtn.textContent = 'Try Again';
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.className = originalClass;
        submitBtn.textContent = originalText;
      }, 3000);
    }
  });
})();
