/* ============================================================
   CreepyXTardy Photography — Interactive features
   ============================================================ */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------------- NAVBAR ---------------- */
  const navbar = $('#navbar');
  const navToggle = $('#nav-toggle');
  const navMenu = $('#nav-menu');
  const navLinks = $$('.nav-link');

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  /* ---------------- SCROLL EFFECTS & ACTIVE LINK ---------------- */
  const sections = $$('main section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    const pos = window.scrollY + 120;
    let currentId = '';
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        currentId = sec.id;
      }
    });
    if (!currentId && window.scrollY < sections[0].offsetTop) currentId = 'home';

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- HERO SLIDESHOW ---------------- */
  const heroSlides = $$('.hero-slide');
  const heroDotsWrap = $('#hero-dots');
  let heroIndex = 0;
  let heroTimer = null;

  heroSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      showHeroSlide(i);
      restartHeroTimer();
    });
    heroDotsWrap.appendChild(dot);
  });

  const heroDots = $$('button', heroDotsWrap);

  function showHeroSlide(i) {
    heroIndex = (i + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((s, idx) => s.classList.toggle('active', idx === heroIndex));
    heroDots.forEach((d, idx) => d.classList.toggle('active', idx === heroIndex));
  }

  function nextHero() {
    showHeroSlide(heroIndex + 1);
  }

  function restartHeroTimer() {
    clearInterval(heroTimer);
    heroTimer = setInterval(nextHero, 6000);
  }

  restartHeroTimer();

  /* ---------------- GALLERY DATA ---------------- */
  const galleryData = [
    { src: 'img/gallery/gallery-01.jpg', cat: 'portraits' },
    { src: 'img/gallery/gallery-02.jpg', cat: 'studio' },
    { src: 'img/gallery/gallery-03.jpg', cat: 'events' },
    { src: 'img/gallery/gallery-04.jpg', cat: 'weddings' },
    { src: 'img/gallery/gallery-05.jpg', cat: 'graduation' },
    { src: 'img/gallery/gallery-06.jpg', cat: 'portraits' },
    { src: 'img/gallery/gallery-07.jpg', cat: 'studio' },
    { src: 'img/gallery/gallery-08.jpg', cat: 'events' },
    { src: 'img/gallery/gallery-09.jpg', cat: 'weddings' },
    { src: 'img/gallery/gallery-10.jpg', cat: 'graduation' },
    { src: 'img/gallery/gallery-11.jpg', cat: 'portraits' },
    { src: 'img/gallery/gallery-12.jpg', cat: 'studio' },
    { src: 'img/gallery/gallery-13.jpg', cat: 'events' },
    { src: 'img/gallery/gallery-14.jpg', cat: 'weddings' },
    { src: 'img/gallery/gallery-15.jpg', cat: 'graduation' },
    { src: 'img/gallery/gallery-16.jpg', cat: 'portraits' },
    { src: 'img/gallery/gallery-17.jpg', cat: 'studio' },
    { src: 'img/gallery/gallery-18.jpg', cat: 'events' },
    { src: 'img/gallery/gallery-19.jpg', cat: 'weddings' },
    { src: 'img/gallery/gallery-20.jpg', cat: 'graduation' },
    { src: 'img/gallery/gallery-21.jpg', cat: 'portraits' }
  ];

  const galleryTrack = $('#gallery-track');
  const galleryCounter = $('#gallery-counter');
  const galleryPrev = $('#gallery-prev');
  const galleryNext = $('#gallery-next');
  const galleryFilters = $$('.filter-btn');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-image');
  const lightboxCaption = $('#lightbox-caption');

  let activeFilter = 'all';
  let filtered = [];
  let galleryIndex = 0;

  function renderGallery() {
    filtered = galleryData.filter((g) => activeFilter === 'all' || g.cat === activeFilter);
    galleryTrack.innerHTML = '';

    filtered.forEach((g, i) => {
      const slide = document.createElement('figure');
      slide.className = 'gallery-slide';
      const image = document.createElement('img');
      image.src = g.src;
      image.alt = 'Photograph by CreepyXTardy Photography';
      image.loading = 'lazy';
      image.dataset.index = String(i);
      slide.appendChild(image);
      galleryTrack.appendChild(slide);
    });

    galleryIndex = 0;
    updateGallery();
  }

  function updateGallery() {
    const count = filtered.length;
    if (count === 0) {
      galleryTrack.style.transform = 'translateX(0)';
      galleryCounter.textContent = '0 / 0';
      return;
    }
    galleryIndex = (galleryIndex + count) % count;
    galleryTrack.style.transform = 'translateX(-' + galleryIndex * 100 + '%)';
    galleryCounter.textContent = (galleryIndex + 1) + ' / ' + count;
  }

  galleryPrev.addEventListener('click', () => { galleryIndex--; updateGallery(); });
  galleryNext.addEventListener('click', () => { galleryIndex++; updateGallery(); });

  galleryFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      galleryFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderGallery();
    });
  });

  /* ---------------- LIGHTBOX ---------------- */
  function openLightbox(index) {
    if (!filtered.length) return;
    galleryIndex = index;
    lightboxImg.src = filtered[index].src;
    lightboxCaption.textContent = '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryTrack.addEventListener('click', (e) => {
    const imgEl = e.target.closest('img');
    if (!imgEl) return;
    openLightbox(parseInt(imgEl.dataset.index, 10));
  });

  $('#lightbox-close').addEventListener('click', closeLightbox);
  $('#lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox((galleryIndex - 1 + filtered.length) % filtered.length);
  });
  $('#lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox((galleryIndex + 1) % filtered.length);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox((galleryIndex - 1 + filtered.length) % filtered.length);
    if (e.key === 'ArrowRight') openLightbox((galleryIndex + 1) % filtered.length);
  });

  renderGallery();

  /* ---------------- TESTIMONIALS ---------------- */
  const testimonials = [
    {
      name: 'JABULILE',
      event: 'Graduation Shoot · Witbank',
      text: 'They made us feel so comfortable. The photos came out beautiful and natural.',
      img: 'img/testimonial-1.jpg'
    },
    {
      name: 'THULI',
      event: 'Client for 3 Years · Birthday Shoot · Witbank',
      text: 'Working with Creepy X Tardy Photography was an absolute pleasure. From our first conversation, their commitment to excellence was clear. Whether they were managing chaotic family portraits or capturing the subtle details of our commercial products, they remained professional and creative. They don\u2019t just take pictures; they capture the story and personality behind the lens. I wouldn\u2019t hesitate to recommend them for weddings, events, or corporate needs.',
      img: 'img/testimonial-2.jpg'
    },
    {
      name: 'LIHUMO',
      event: 'Graduation Shoot · Witbank',
      text: 'Professional, creative, and the results are stunning.',
      img: 'img/testimonial-3.jpg'
    }
  ];

  const testiTrack = $('#testimonial-track');
  const testiDots = $('#testimonial-dots');
  let testiIndex = 0;
  let testiTimer = null;

  testimonials.forEach((t, i) => {
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    slide.innerHTML =
      '<div class="testimonial-avatar"><img src="' + t.img + '" alt="Client photo of ' + t.name + '" loading="lazy"></div>' +
      '<div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>' +
      '<p class="testimonial-text">"' + t.text + '"</p>' +
      '<h3 class="testimonial-name">' + t.name + '</h3>' +
      '<p class="testimonial-event">' + t.event + '</p>';
    testiTrack.appendChild(slide);

    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      showTestimonial(i);
      restartTestiTimer();
    });
    testiDots.appendChild(dot);
  });

  const testiDotsArr = $$('button', testiDots);

  function showTestimonial(i) {
    testiIndex = (i + testimonials.length) % testimonials.length;
    testiTrack.style.transform = 'translateX(-' + testiIndex * 100 + '%)';
    testiDotsArr.forEach((d, idx) => d.classList.toggle('active', idx === testiIndex));
  }

  function restartTestiTimer() {
    clearInterval(testiTimer);
    testiTimer = setInterval(() => showTestimonial(testiIndex + 1), 7000);
  }

  $('.testimonial-arrow.prev').addEventListener('click', () => {
    showTestimonial(testiIndex - 1);
    restartTestiTimer();
  });
  $('.testimonial-arrow.next').addEventListener('click', () => {
    showTestimonial(testiIndex + 1);
    restartTestiTimer();
  });

  restartTestiTimer();

  /* ---------------- CONTACT FORM ---------------- */
  const form = $('#contact-form');
  const formStatus = $('#form-status');

  function setStatus(msg, type) {
    formStatus.className = 'form-status ' + type;
    formStatus.textContent = msg;
    clearTimeout(setStatus._t);
    setStatus._t = setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 10000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Forwards submissions to creepyxtardy@gmail.com via FormSubmit.
    // The first submission sends a one-time activation email to that address.
    fetch('https://formsubmit.co/creepyxtardy@gmail.com', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'true' || data.success === true) {
          form.reset();
          setStatus('Thank you! Your message has been sent. We will reply within 24 hours.', 'success');
        } else if (data.message) {
          setStatus(data.message, 'error');
        } else {
          setStatus('Sorry, something went wrong. Please try again or use WhatsApp.', 'error');
        }
      })
      .catch(() => {
        setStatus('Sorry, something went wrong. Please try again or use WhatsApp.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'CONTACT US';
      });
  });

  /* ---------------- FOOTER YEAR ---------------- */
  $('#year').textContent = new Date().getFullYear();
})();
