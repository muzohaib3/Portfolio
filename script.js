// ────────────── MOBILE MENU TOGGLE ────────────── 
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
  mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// ────────────── ACTIVE NAVIGATION LINK ────────────── 
function setActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('load', setActiveLink);

// ────────────── DARK/LIGHT THEME TOGGLE ────────────── 
const themeBtn = document.getElementById('theme-btn');
const htmlElement = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  if (themeBtn) {
    themeBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
}

// ────────────── SCROLL ANIMATIONS ────────────── 
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.timeline-item, .skill-card, .project-card, .education-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  observer.observe(el);
});

// ────────────── SKILL BARS ANIMATION ────────────── 
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const skillFills = entry.target.querySelectorAll('.skill-fill');
      skillFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0';
        setTimeout(() => {
          fill.style.width = width;
        }, 100);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillObserver.observe(card);
});

// ────────────── CONTACT FORM VALIDATION ────────────── 
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(msg => msg.classList.remove('show'));
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Validation
    if (name.length < 2) {
      document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
      document.getElementById('name-error').classList.add('show');
      isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('email-error').textContent = 'Please enter a valid email';
      document.getElementById('email-error').classList.add('show');
      isValid = false;
    }
    
    if (subject.length < 3) {
      document.getElementById('subject-error').textContent = 'Subject must be at least 3 characters';
      document.getElementById('subject-error').classList.add('show');
      isValid = false;
    }
    
    if (message.length < 10) {
      document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
      document.getElementById('message-error').classList.add('show');
      isValid = false;
    }
    
    if (isValid) {
      // Show success modal
      showSuccessModal();
      
      // Reset form
      contactForm.reset();
      
      // Here you would typically send the form data to a server
      console.log({
        name,
        email,
        subject,
        message
      });
    }
  });
}

// ────────────── SUCCESS MODAL ────────────── 
function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('success-modal');
  if (e.target === modal) {
    closeModal();
  }
});

// ────────────── SMOOTH SCROLL ────────────── 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ────────────── TYPING ANIMATION ────────────── 
const typingText = document.querySelector('.typing-text');
if (typingText) {
  const text = typingText.textContent;
  typingText.textContent = '';
  let index = 0;
  
  function type() {
    if (index < text.length) {
      typingText.textContent += text[index];
      index++;
      setTimeout(type, 50);
    }
  }
  
  setTimeout(type, 500);
}

// ────────────── SCROLL TO TOP ────────────── 
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 999;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(96, 165, 250, 0.3);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = 'flex';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollTopBtn.addEventListener('mouseover', () => {
  scrollTopBtn.style.transform = 'translateY(-5px)';
});

scrollTopBtn.addEventListener('mouseout', () => {
  scrollTopBtn.style.transform = 'translateY(0)';
});

// ────────────── LAZY LOADING ────────────── 
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

console.log('✅ Portfolio loaded successfully!');