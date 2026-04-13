const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});
function raf(time) { 
    lenis.raf(time); 
    requestAnimationFrame(raf); 
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if(window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0, ease: "none" });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3, ease: "power2.out" });
    });
    document.querySelectorAll('[data-hover="text"]').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover-text'); follower.style.opacity = 0; });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover-text'); follower.style.opacity = 1; });
    });
    document.querySelectorAll('[data-hover="image"]').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover-image'); follower.style.display = 'none'; });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover-image'); follower.style.display = 'block'; });
    });
} else {
    if(cursor) cursor.style.display = 'none'; 
    if(follower) follower.style.display = 'none'; 
    document.body.style.cursor = 'auto';
}

const menuBtn = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-link');

if(menuBtn) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        mobileNav.classList.toggle('open');
        if(mobileNav.classList.contains('open')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('open');
            mobileNav.classList.remove('open');
            lenis.start();
        });
    });
}

// INDEX.HTML ANIMATIONS
if(document.querySelector(".hero-image")) {
    gsap.fromTo(".hero-image", { scale: 1.5, filter: "blur(15px)" }, { scale: 1, filter: "blur(0px)", duration: 2.2, ease: "power3.out" });
    gsap.to(".hero-image-wrapper", { scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }, y: 200, scale: 0.8 });
    if (window.innerWidth > 900) {
        gsap.to(".huge-title", { scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }, y: -100, letterSpacing: "8vw" });
        gsap.to(".about-image-overlap", { scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: 1.5 }, y: -250 });
    } else {
        gsap.to(".huge-title", { scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }, y: -50, opacity: 0 });
        gsap.from(".about-image-overlap", { scrollTrigger: { trigger: ".about", start: "top 85%" }, y: 50, duration: 1.2, opacity: 0 });
    }
}

const scrollContainer = document.querySelector(".portfolio-scroll-container");
if(scrollContainer) {
    if(window.innerWidth > 900) {
        gsap.to(scrollContainer, {
            x: () => -(scrollContainer.scrollWidth - window.innerWidth), ease: "none",
            scrollTrigger: { trigger: ".portfolio", pin: true, scrub: 1.2, end: () => "+=" + scrollContainer.scrollWidth }
        });
        gsap.utils.toArray(".port-item").forEach((item, i) => {
            let speed = (i % 2 === 0) ? -60 : 60; 
            gsap.to(item, { x: speed, ease: "none", scrollTrigger: { trigger: ".portfolio", start: "top top", end: () => "+=" + scrollContainer.scrollWidth, scrub: 1 } });
        });
    } else {
        gsap.utils.toArray(".port-item").forEach((item) => {
            gsap.from(item, { scrollTrigger: { trigger: item, start: "top 85%" }, duration: 1.2, y: 50, opacity: 0, ease: "power3.out" });
        });
    }
}

if(document.querySelector(".review-block")) {
    gsap.utils.toArray(".review-block").forEach((block) => {
        gsap.from(block, { scrollTrigger: { trigger: block, start: "top 85%" }, duration: 1.5, y: 80, opacity: 0, ease: "power3.out" });
    });
}
if(document.querySelector(".contact-header")) {
    gsap.from(".contact-header .creative-text", { scrollTrigger: { trigger: ".contact-section", start: "top 80%" }, duration: 1.2, y: 50, opacity: 0, ease: "power3.out" });
    gsap.from(".elegant-form input, .elegant-form textarea, .submit-btn", { scrollTrigger: { trigger: ".elegant-form", start: "top 85%" }, duration: 1.2, y: 30, opacity: 0, stagger: 0.15, ease: "power3.out" });
    if(document.querySelector(".contact-story")) {
        gsap.from(".contact-story > p", { scrollTrigger: { trigger: ".contact-section", start: "top 85%" }, y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" });
    }
}
if(document.querySelector(".insta-post")) {
    gsap.from(".insta-post", { scrollTrigger: { trigger: ".insta-grid", start: "top 95%" }, duration: 1.2, y: 40, opacity: 0, stagger: 0.1, ease: "power3.out" });
}

// NEW SUBPAGES ANIMATIONS - ABOUT & PORTFOLIO
if(document.querySelector(".about-scatter-hero")) {
    gsap.utils.toArray(".scatter-img").forEach((item, i) => {
        gsap.fromTo(item, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.8, ease: "power3.out", delay: i * 0.15 });
        if(window.innerWidth > 900) {
            let speed = (i % 2 === 0) ? -150 : 150;
            gsap.to(item, { y: speed, scrollTrigger: { trigger: ".about-scatter-hero", start: "top top", end: "bottom top", scrub: 1.2 } });
        }
    });
    gsap.utils.toArray(".scatter-word").forEach((word, i) => {
        gsap.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power3.out", delay: 0.5 + (i * 0.2) });
        if(window.innerWidth > 900) {
            let speed = (i % 2 === 0) ? 200 : -200;
            gsap.to(word, { y: speed, letterSpacing: "3vw", scrollTrigger: { trigger: ".about-scatter-hero", start: "top top", end: "bottom top", scrub: 1.5 } });
        }
    });
}
if(document.querySelector(".portfolio-masonry")) {
    gsap.from(".portfolio-grid-hero .huge-title span", { y: 150, opacity: 0, duration: 1.5, stagger: 0.1, ease: "power3.out" });
    gsap.to(".portfolio-grid-hero .huge-title", { y: -150, scrollTrigger: { trigger: ".portfolio-grid-hero", start: "top top", end: "bottom top", scrub: 1 } });
    
    gsap.utils.toArray(".masonry-item").forEach((item, i) => {
        let delay = (i % 4) * 0.15;
        gsap.fromTo(item, { y: 200, opacity: 0 }, { scrollTrigger: { trigger: item, start: "top 95%" }, y: 0, opacity: 1, duration: 1.2, delay: delay, ease: "power3.out" });
        if(window.innerWidth > 900) {
            let speed = (i % 2 === 0) ? -100 : -30;
            gsap.to(item, { y: speed, scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 } });
        }
    });
}

// FORM LOGIC
const dateInput = document.querySelector('.date-input');
if(dateInput) {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 4);
    flatpickr(dateInput, {
        minDate: "today",
        maxDate: maxDate,
        locale: "pl",
        altInput: true,
        altFormat: "j F Y",
        dateFormat: "Y-m-d",
        disableMobile: "true"
    });
}

const form = document.getElementById("ajaxContactForm");
const popup = document.getElementById("successPopup");
const submitBtn = form ? form.querySelector(".submit-btn") : null;

if(form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "WYSYŁANIE...";
        submitBtn.style.pointerEvents = "none";
        
        const formData = new FormData(form);
        fetch("https://formsubmit.co/ajax/krzysiek.ilendo@gmail.com", {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            submitBtn.innerText = originalText;
            submitBtn.style.pointerEvents = "auto";
            form.reset();
            popup.classList.add("show");
            setTimeout(() => { popup.classList.remove("show"); }, 6000);
        })
        .catch(error => {
            submitBtn.innerText = "BŁĄD WYSYŁANIA.";
            submitBtn.style.pointerEvents = "auto";
            setTimeout(() => submitBtn.innerText = originalText, 4000);
        });
    });
}

// STORIES PAGE ANIMATIONS
if(document.querySelector(".stories-hero")) {
    gsap.from(".stories-hero .huge-title span", { y: 150, opacity: 0, duration: 1.5, stagger: 0.1, ease: "power3.out" });
    gsap.to(".stories-hero .huge-title", { y: -150, scrollTrigger: { trigger: ".stories-hero", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.fromTo(".stories-hero-bg img", { scale: 1.2, filter: "blur(10px)" }, { scale: 1, filter: "blur(0px)", duration: 2, ease: "power3.out" });
    gsap.to(".stories-hero-bg", { scrollTrigger: { trigger: ".stories-hero", start: "top top", end: "bottom top", scrub: 1 }, y: 200, scale: 0.9 });
}

if(document.querySelector(".stories-coming-soon")) {
    gsap.from(".stories-coming-soon .creative-text", { scrollTrigger: { trigger: ".stories-coming-soon", start: "top 85%" }, duration: 1.5, y: 50, opacity: 0, ease: "power3.out" });
}

// OPINIONS PAGE ANIMATIONS
if(document.querySelector(".opinions-hero")) {
    gsap.from(".opinions-title span", { y: 150, opacity: 0, duration: 1.5, stagger: 0.1, ease: "power3.out" });
    gsap.to(".opinions-title", { y: -150, scrollTrigger: { trigger: ".opinions-hero", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.fromTo(".opinions-bg img", { scale: 1.2, filter: "blur(10px)" }, { scale: 1, filter: "blur(0px)", duration: 2, ease: "power3.out" });
    gsap.to(".opinions-bg", { scrollTrigger: { trigger: ".opinions-hero", start: "top top", end: "bottom top", scrub: 1 }, y: 200, scale: 0.9 });
}

if(document.querySelector(".opinions-list")) {
    gsap.utils.toArray(".opinion-card").forEach((card) => {
        const img = card.querySelector(".opinion-image-wrapper");
        const author = card.querySelector(".author-huge");
        const quote = card.querySelector(".quote");
        
        gsap.from(img, { scrollTrigger: { trigger: card, start: "top 85%" }, duration: 1.5, y: 100, opacity: 0, ease: "power3.out" });
        gsap.from(author, { scrollTrigger: { trigger: card, start: "top 85%" }, duration: 1.5, y: 60, opacity: 0, ease: "power3.out", delay: 0.1 });
        
        // Make the authors float organically natively
        gsap.to(author, {
            y: "-=15",
            duration: gsap.utils.random(2.5, 3.5),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 1.6 // Wait for entry animation to complete
        });

        gsap.from(quote, { scrollTrigger: { trigger: card, start: "top 85%" }, duration: 1.5, y: 30, opacity: 0, ease: "power3.out", delay: 0.3 });
    });
}

// OFERTA 2027 (Password Protected Pages) ANIMATIONS
window.initGlobalAnimations = function() {
    ScrollTrigger.refresh();
    
    // Oferta 2027 hero specific
    if (document.querySelector('.editorial-hero')) {
        gsap.from(".editorial-hero h1", { opacity: 0, y: 100, duration: 1.5, ease: "power3.out" });
        gsap.fromTo(".editorial-hero img", { scale: 1.2, filter: "blur(10px)" }, { scale: 1, filter: "blur(0px)", duration: 2, ease: "power3.out" });
        gsap.to(".editorial-hero img", { scrollTrigger: { trigger: ".editorial-hero", start: "top top", end: "bottom top", scrub: 1 }, y: 200, scale: 0.9 });
    }

    if (document.querySelector('.toc-list')) {
        gsap.utils.toArray(".toc-list li").forEach((li, i) => {
            gsap.from(li, { scrollTrigger: { trigger: ".toc-section", start: "top 80%" }, opacity: 0, x: -50, duration: 1, delay: i * 0.1, ease: "power3.out" });
        });
    }

    // Split sections and floating images
    if (document.querySelector('.split-section')) {
        gsap.utils.toArray(".split-section").forEach((section) => {
            const side = section.querySelector(".text-side");
            const img = section.querySelector(".image-side");
            if (side) gsap.from(side, { scrollTrigger: { trigger: section, start: "top 80%" }, opacity: 0, y: 50, duration: 1.2, ease: "power3.out" });
            if (img) gsap.from(img, { scrollTrigger: { trigger: section, start: "top 80%" }, opacity: 0, scale: 1.1, duration: 1.5, ease: "power3.out" });
        });
    }

    // Add scatter functionality
    const scatterDivs = document.querySelectorAll("section[style*='display: flex; gap: 2vw'] div");
    if (scatterDivs.length > 0) {
        gsap.utils.toArray(scatterDivs).forEach((div, i) => {
           gsap.from(div, { scrollTrigger: { trigger: div.parentElement, start: "top 75%" }, opacity: 0, y: 100, duration: 1.5, delay: i * 0.15, ease: "power3.out" }); 
        });
    }

    // Pricing grid
    if (document.querySelector('.pricing-card')) {
        gsap.utils.toArray(".pricing-card").forEach((card, i) => {
            gsap.from(card, { scrollTrigger: { trigger: ".pricing-grid", start: "top 85%" }, opacity: 0, y: 80, duration: 1.2, delay: i * 0.1, ease: "power3.out" });
        });
    }

    // Re-verify the scroll trigger for reviews because they were hidden on load
    if(document.querySelector(".review-block")) {
        gsap.utils.toArray(".review-block").forEach((block) => {
            gsap.from(block, { scrollTrigger: { trigger: block, start: "top 85%" }, duration: 1.5, y: 80, opacity: 0, ease: "power3.out" });
        });
    }

    setTimeout(() => { ScrollTrigger.refresh(); }, 500);
};
