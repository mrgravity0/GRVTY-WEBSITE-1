document.body.classList.add("motion-ready", "is-loading");

window.addEventListener("load", () => {
  const preloader = document.querySelector("[data-preloader]");
  window.setTimeout(() => {
    preloader?.classList.add("done");
    document.body.classList.remove("is-loading");
  }, 850);
});

const toggle = document.querySelector("[data-menu-toggle]");
const links = document.querySelector("[data-nav-links]");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const heroSlides = Array.from(document.querySelectorAll("[data-hero-slideshow] .hero-slide"));
let activeHeroSlide = 0;

if (heroSlides.length > 1) {
  window.setInterval(() => {
    heroSlides[activeHeroSlide].classList.remove("active");
    activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
    heroSlides[activeHeroSlide].classList.add("active");
  }, 4300);
}

const heroRotator = document.querySelector("[data-hero-rotator]");
const rotatingWords = heroRotator ? Array.from(heroRotator.querySelectorAll(".rotating-word")) : [];
let activeHeroWord = 0;

if (rotatingWords.length > 1) {
  window.setInterval(() => {
    const outgoing = rotatingWords[activeHeroWord];
    outgoing.classList.remove("active");
    outgoing.classList.add("exiting");

    activeHeroWord = (activeHeroWord + 1) % rotatingWords.length;
    const incoming = rotatingWords[activeHeroWord];
    incoming.classList.remove("exiting");
    incoming.classList.add("active");

    window.setTimeout(() => {
      outgoing.classList.remove("exiting");
    }, 820);
  }, 2600);
}

document.querySelectorAll("[data-form]").forEach((form) => {
  const note = form.querySelector("[data-note]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (note) note.textContent = "Submitting...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      if (note) note.textContent = "Sent. Thank you, we will contact you shortly.";
    } catch (error) {
      if (note) note.textContent = "Could not submit right now. Please email us directly.";
    }
  });
});

// Enhanced Scroll Animations with Intersection Observer
const observerOptions = {
  threshold: [0.08, 0.5],
  rootMargin: "0px 0px -80px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

// Parallax Effect on Scroll for Hero Section
if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  const heroMedia = document.querySelector(".hero-media");
  if (heroMedia) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const heroHeight = document.querySelector(".hero")?.offsetHeight || 800;
      if (scrolled < heroHeight) {
        const offset = scrolled * 0.35;
        heroMedia.style.transform = `scale(1.04) translateY(${offset * 0.2}px)`;
      }
    }, { passive: true });
  }
}

// Smooth scroll velocity detection for enhanced animations
let lastScrollTop = 0;
let scrollVelocity = 0;
let ticking = false;

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  scrollVelocity = Math.min(Math.abs(scrollTop - lastScrollTop), 50);
  lastScrollTop = scrollTop;
  
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--scroll-velocity", scrollVelocity / 50);
      ticking = false;
    });
  }
}, { passive: true });

const previewTargets = document.querySelectorAll("[data-preview]");
if (previewTargets.length && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const preview = document.createElement("div");
  preview.className = "cursor-preview";
  preview.innerHTML = "<img alt=\"\">";
  document.body.appendChild(preview);
  const previewImage = preview.querySelector("img");

  previewTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      previewImage.src = target.dataset.preview;
      preview.classList.add("visible");
    });

    target.addEventListener("mousemove", (event) => {
      preview.style.transform = `translate3d(${event.clientX + 36}px, ${event.clientY - 24}px, 0) scale(1) rotate(-2deg)`;
    });

    target.addEventListener("mouseleave", () => {
      preview.classList.remove("visible");
    });
  });
}

document.querySelectorAll(".magnetic").forEach((el) => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  el.addEventListener("mousemove", (event) => {
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
});

if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".work-card").forEach((card) => {
    const imageWrap = card.querySelector(".work-image");
    const image = card.querySelector(".work-image img");
    const view = card.querySelector(".work-view");
    const glow = card.querySelector(".work-glow");
    if (!imageWrap || !image || !view || !glow) return;

    card.addEventListener("mousemove", (event) => {
      const rect = imageWrap.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;

      imageWrap.style.transform = `rotateX(${-py * 5}deg) rotateY(${px * 5}deg)`;
      image.style.transform = "scale(1.06)";
      view.style.left = `${x}px`;
      view.style.top = `${y}px`;
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.18), transparent 62%)`;
    });

    card.addEventListener("mouseleave", () => {
      imageWrap.style.transform = "";
      image.style.transform = "";
    });
  });
}

const servicesSection = document.querySelector(".services-section");
const servicePreview = document.querySelector(".service-hover-preview");
const serviceRows = Array.from(document.querySelectorAll(".service-row"));

function activateServicePreview(row) {
  if (!servicesSection || !servicePreview || !row) return;
  const previewSrc = row.dataset.servicePreview;
  if (!previewSrc) return;

  serviceRows.forEach((item) => item.classList.toggle("active", item === row));
  if (servicePreview.dataset.activeSrc !== previewSrc) {
    servicePreview.dataset.activeSrc = previewSrc;
    servicePreview.innerHTML = `<img src="${previewSrc}" alt="" aria-hidden="true">`;
  }
  servicesSection.classList.add("preview-active");
}

function clearServicePreview() {
  if (!servicesSection) return;
  serviceRows.forEach((row) => row.classList.remove("active"));
  servicesSection.classList.remove("preview-active");
}

serviceRows.forEach((row) => {
  const previewSrc = row.dataset.servicePreview;
  if (previewSrc) {
    const image = new Image();
    image.src = previewSrc;
  }

  row.addEventListener("mouseenter", () => activateServicePreview(row));
  row.addEventListener("mouseover", () => activateServicePreview(row));
  row.addEventListener("pointerover", () => activateServicePreview(row));
});

servicesSection?.addEventListener("mouseleave", clearServicePreview);

const slides = Array.from(document.querySelectorAll(".testimonial-slide"));
const avatars = Array.from(document.querySelectorAll(".testimonial-avatar"));
const testimonialDots = Array.from(document.querySelectorAll(".testimonial-dot"));
let activeTestimonial = Math.max(0, slides.findIndex((slide) => slide.classList.contains("active")));

function showTestimonial(index) {
  if (!slides.length) return;
  activeTestimonial = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === activeTestimonial));
  avatars.forEach((avatar, i) => avatar.classList.toggle("active", i === activeTestimonial));
  testimonialDots.forEach((dot, i) => dot.classList.toggle("active", i === activeTestimonial));
}

avatars.forEach((avatar, index) => {
  avatar.addEventListener("click", () => showTestimonial(index));
});

testimonialDots.forEach((dot, index) => {
  dot.addEventListener("click", () => showTestimonial(index));
});

showTestimonial(activeTestimonial);

document.querySelector("[data-testimonial-prev]")?.addEventListener("click", () => {
  showTestimonial(activeTestimonial - 1);
});

document.querySelector("[data-testimonial-next]")?.addEventListener("click", () => {
  showTestimonial(activeTestimonial + 1);
});

const aboutRoot = document.body.classList.contains("about-page") ? document.body : null;
const aboutHero = document.querySelector("[data-about-hero]");
const aboutMotionAllowed = aboutRoot && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

if (aboutMotionAllowed) {
  const aboutDepthTargets = Array.from(document.querySelectorAll("[data-about-depth]")).map((element) => ({
    element,
    depth: Number.parseFloat(element.dataset.aboutDepth || "0.08")
  }));

  let aboutTicking = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateAboutMotion = () => {
    const viewportHeight = window.innerHeight || 1;

    if (aboutHero) {
      const heroRect = aboutHero.getBoundingClientRect();
      const heroProgress = clamp(-heroRect.top / Math.max(heroRect.height, 1), 0, 1);
      aboutRoot.style.setProperty("--about-hero-progress", heroProgress.toFixed(3));
    }

    aboutDepthTargets.forEach(({ element, depth }) => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const offset = clamp((viewportCenter - elementCenter) * depth, -88, 88);
      element.style.setProperty("--about-depth-y", `${offset.toFixed(2)}px`);
    });

    aboutTicking = false;
  };

  const requestAboutMotion = () => {
    if (aboutTicking) return;
    aboutTicking = true;
    window.requestAnimationFrame(updateAboutMotion);
  };

  window.addEventListener("scroll", requestAboutMotion, { passive: true });
  window.addEventListener("resize", requestAboutMotion);
  requestAboutMotion();

  if (aboutHero && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    aboutHero.addEventListener("pointermove", (event) => {
      const rect = aboutHero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 100;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 100;

      aboutRoot.style.setProperty("--about-pointer-x", x.toFixed(2));
      aboutRoot.style.setProperty("--about-pointer-y", y.toFixed(2));
    });

    aboutHero.addEventListener("pointerleave", () => {
      aboutRoot.style.setProperty("--about-pointer-x", "0");
      aboutRoot.style.setProperty("--about-pointer-y", "0");
    });
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-about-tilt]").forEach((target) => {
      target.addEventListener("pointermove", (event) => {
        const rect = target.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;

        target.style.setProperty("--tilt-x", `${(x * 8).toFixed(2)}deg`);
        target.style.setProperty("--tilt-y", `${(-y * 7).toFixed(2)}deg`);
      });

      target.addEventListener("pointerleave", () => {
        target.style.setProperty("--tilt-x", "0deg");
        target.style.setProperty("--tilt-y", "0deg");
      });
    });
  }
}





