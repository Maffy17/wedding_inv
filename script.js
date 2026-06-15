/* ============================================================
   WEDDING INVITATION — script.js
   ============================================================ */

"use strict";

// Prevent the browser from restoring the last scroll position on reload
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

/* ── 1 · LOADING SCREEN ────────────────────────────────────── */
function startLoader() {
  const screen = document.getElementById("loadingScreen");
  const bar = document.getElementById("loadingBar");
  if (!screen || !bar) return;

  screen.classList.remove("hidden");

  const MIN_DURATION = 2000; // ms — loader visible for at least 2 seconds
  const startTime = Date.now();
  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 6 + 2; // slower, smoother progress
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      bar.style.width = "100%";

      // Wait for the remaining time so the loader is always seen for ≥ 2s
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DURATION - elapsed);

      setTimeout(() => {
        window.scrollTo(0, 0);        // guarantee top before revealing hero
        screen.classList.add("hidden");
        document.body.style.overflow = "";
        document
          .querySelectorAll(".reveal-hero")
          .forEach((el) => el.classList.add("visible"));
      }, remaining + 420);
    }
    bar.style.width = Math.min(progress, 100) + "%";
  }, 60);
}

/* ── 2 · NAVIGATION ────────────────────────────────────────── */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

// Scrolled class for glass effect
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  },
  { passive: true },
);

// Hamburger toggle
hamburger?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
});

// Close menu on nav link click
navLinks?.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

// Active nav highlight on scroll
const sections = document.querySelectorAll("section[id], footer[id]");
const navItems = document.querySelectorAll(".nav-link");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
      }
    });
  },
  { threshold: 0.35 },
);

sections.forEach((s) => navObserver.observe(s));

/* ── 3 · SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const navH = navbar?.offsetHeight ?? 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ── 4 · SCROLL REVEAL (Intersection Observer) ─────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

document
  .querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale",
  )
  .forEach((el) => revealObserver.observe(el));

/* ── 5 · COUNTDOWN TIMER ───────────────────────────────────── */
(function initCountdown() {
  const WEDDING = new Date("2026-12-05T14:00:00+08:00").getTime();

  const elDays  = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMins  = document.getElementById("cdMins");
  const elSecs  = document.getElementById("cdSecs");

  if (!elDays) return;

  let finished = false;

  function pad(n, digits = 2) { return String(n).padStart(digits, "0"); }

  function animateFlip(el, newVal) {
    if (el.textContent === newVal) return;
    el.style.transform = "translateY(-6px)";
    el.style.opacity = "0.4";
    setTimeout(() => {
      el.textContent = newVal;
      el.style.transform = "translateY(0)";
      el.style.opacity = "1";
    }, 120);
  }

  [elDays, elHours, elMins, elSecs].forEach(el => {
    el.style.transition = "transform .15s ease, opacity .15s ease";
  });

  /* ── Confetti ── */
  function launchConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ["#C9A84C","#D4A5A5","#87A878","#B8860B","#E8D5A3","#9E7B65","#BFA68A","#DAA520","#fff"];
    const pieces = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.12,
      vx: (Math.random() - 0.5) * 2.5,
      vy: Math.random() * 3 + 2,
      opacity: 1,
    }));

    let frame;
    let start = null;
    const DURATION = 5000;

    function draw(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.rot += p.rotSpeed;
        if (elapsed > DURATION * 0.6) p.opacity = Math.max(0, p.opacity - 0.008);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      });

      if (elapsed < DURATION) {
        frame = requestAnimationFrame(draw);
      } else {
        canvas.remove();
      }
    }

    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
  }

  /* ── Celebration overlay ── */
  function showCelebration() {
    const overlay = document.createElement("div");
    overlay.id = "cd-celebration";
    overlay.innerHTML = `
      <div class="cd-cel-card">
        <div class="cd-cel-flowers">✿ ✦ ✿</div>
        <p class="cd-cel-pre">Today is the Day</p>
        <h2 class="cd-cel-title">We Are Married!</h2>
        <p class="cd-cel-msg">December 05, 2026 · Two hearts, one forever.</p>
        <div class="cd-cel-flowers">✿ ✦ ✿</div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("cd-cel-show"));
  }

  function onFinished() {
    if (finished) return;
    finished = true;

    [elDays, elHours, elMins, elSecs].forEach(el => {
      el.style.transition = "none";
    });
    elDays.textContent  = "000";
    elHours.textContent = "00";
    elMins.textContent  = "00";
    elSecs.textContent  = "00";

    const cdWrap = document.getElementById("countdownTimer");
    if (cdWrap) {
      cdWrap.style.transition = "opacity .6s";
      cdWrap.style.opacity = "0";
      setTimeout(() => { cdWrap.style.display = "none"; }, 650);
    }

    const cdFooter = document.querySelector(".cd-footer");
    if (cdFooter) cdFooter.style.display = "none";

    setTimeout(() => {
      launchConfetti();
      showCelebration();
    }, 700);
  }

  function tick() {
    const diff = WEDDING - Date.now();
    if (diff <= 0) { onFinished(); return; }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    animateFlip(elDays,  pad(d, 3));
    animateFlip(elHours, pad(h));
    animateFlip(elMins,  pad(m));
    animateFlip(elSecs,  pad(s));
  }

  tick();
  setInterval(tick, 1000);
})();

/* ── 6 · GALLERY LIGHTBOX ──────────────────────────────────── */
(function initLightbox() {
  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const lbBack = document.getElementById("lbBackdrop");

  if (!grid || !lightbox) return;

  const items = [...grid.querySelectorAll(".gi")];
  let current = 0;

  // Collect background styles and captions from gallery items
  const data = items.map((item) => {
    const img = item.querySelector(".gi-img");
    const style = window.getComputedStyle(img);
    return {
      bg: style.background || style.backgroundImage,
      caption: item.dataset.caption || "",
    };
  });

  function open(idx) {
    current = ((idx % items.length) + items.length) % items.length;
    const d = data[current];
    lbImg.style.background = d.bg;
    lbCap.textContent = d.caption;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => (lightbox.style.opacity = "1"), 10);
    lbClose.focus();
  }

  function close() {
    lightbox.style.opacity = "0";
    setTimeout(() => {
      lightbox.hidden = true;
      document.body.style.overflow = "";
    }, 260);
  }

  function navigate(dir) {
    current = (current + dir + items.length) % items.length;
    const d = data[current];
    lbImg.style.opacity = "0";
    setTimeout(() => {
      lbImg.style.background = d.bg;
      lbCap.textContent = d.caption;
      lbImg.style.opacity = "1";
    }, 180);
    lbImg.style.transition = "opacity .18s ease";
  }

  // Apply initial transition
  lightbox.style.transition = "opacity .26s ease";
  lightbox.style.opacity = "0";

  // Open on item click
  items.forEach((item, idx) => {
    item.addEventListener("click", () => open(idx));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") open(idx);
    });
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `View photo ${idx + 1}`);
  });

  lbClose?.addEventListener("click", close);
  lbBack?.addEventListener("click", close);
  lbPrev?.addEventListener("click", () => navigate(-1));
  lbNext?.addEventListener("click", () => navigate(+1));

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(+1);
  });

  // Touch swipe
  let touchX = 0;
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.touches[0].clientX;
    },
    { passive: true },
  );
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? +1 : -1);
  });
})();

/* ── 7 · PARALLAX (subtle hero background shift) ───────────── */
(function initParallax() {
  const heroBg = document.querySelector(".hero-bg-warm");
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        ticking = false;
      });
      ticking = true;
    },
    { passive: true },
  );
})();

/* ── 8 · FLOATING PETALS extra randomness ──────────────────── */
(function spawnPetals() {
  const wrap = document.querySelector(".petals-wrap");
  if (!wrap) return;

  // Occasionally spawn extra petals beyond the static HTML set
  function createPetal() {
    const p = document.createElement("div");
    const x = Math.random() * 100;
    const dur = 7 + Math.random() * 8;
    const delay = Math.random() * 5;
    p.className = "fp";
    p.style.cssText = `--x:${x}%;--d:${delay}s;--dur:${dur}s`;
    wrap.appendChild(p);
    setTimeout(() => p.remove(), (delay + dur + 0.5) * 1000);
  }

  setInterval(createPetal, 2200);
})();

/* ── 9 · ORNAMENT SVG stroke colour fix ─────────────────────── */
// Ensure all ornament SVGs inherit their colour from parent
document.querySelectorAll(".ornament-divider svg").forEach((svg) => {
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("fill", "currentColor");
});

/* ── 10 · CAPIZ SHIMMER on detail cards ────────────────────── */
(function shimmerCards() {
  document
    .querySelectorAll(".detail-card, .tl-card, .dress-card, .gift-card")
    .forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
        card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
})();

/* ── 11 · SECTION entrance line draw for schedule ──────────── */
(function animateScheduleLine() {
  const lines = document.querySelectorAll(".si-line");
  const lineObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "lineGrow .8s ease forwards";
          lineObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  lines.forEach((l) => {
    l.style.maxHeight = "0";
    l.style.overflow = "hidden";
    lineObs.observe(l);
  });
})();

/* ── 12 · RSVP FORM ─────────────────────────────────────────── */
(function initRsvp() {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz3kF082iKSP4RcYgWPKtPEzWIH5PL8amk5WdQb2eigNCho94aJtqslOPUr8pSxP65V1w/exec";

  const form = document.getElementById("rsvpForm");
  const nameInput = document.getElementById("rsvpName");
  const attendance = document.getElementById("rsvpAttendance");
  const guestField = document.getElementById("guestField");
  const guestsInput = document.getElementById("rsvpGuests");
  const btnAttend = document.getElementById("btnAttend");
  const btnDecline = document.getElementById("btnDecline");
  const submitBtn = document.getElementById("rsvpSubmit");
  const submitLabel = document.getElementById("rsvpSubmitLabel");
  const errorEl = document.getElementById("rsvpError");
  const successEl = document.getElementById("rsvpSuccess");
  const successTitle = document.getElementById("rsvpSuccessTitle");
  const successMsg = document.getElementById("rsvpSuccessMsg");

  if (!form) return;

  function selectAttendance(value) {
    attendance.value = value;
    btnAttend.classList.toggle("selected-attend", value === "Attending");
    btnDecline.classList.toggle("selected-decline", value === "Not Attending");
    btnAttend.classList.remove("error-btn");
    btnDecline.classList.remove("error-btn");
    guestField.style.display = value === "Attending" ? "flex" : "none";
  }

  btnAttend?.addEventListener("click", () => selectAttendance("Attending"));
  btnDecline?.addEventListener("click", () =>
    selectAttendance("Not Attending"),
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorEl.hidden = true;
    nameInput.classList.remove("error");
    btnAttend.classList.remove("error-btn");
    btnDecline.classList.remove("error-btn");

    let valid = true;
    if (!nameInput.value.trim()) {
      nameInput.classList.add("error");
      valid = false;
    }
    if (!attendance.value) {
      btnAttend.classList.add("error-btn");
      btnDecline.classList.add("error-btn");
      valid = false;
    }
    if (!valid) {
      errorEl.textContent =
        "Please fill in your name and select your attendance.";
      errorEl.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = "Sending…";

    const payload = {
      name: nameInput.value.trim(),
      attendance: attendance.value,
      guests: attendance.value === "Attending" ? guestsInput.value : "0",
      message: document.getElementById("rsvpMessage").value.trim(),
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      form.hidden = true;
      successEl.hidden = false;
      if (payload.attendance === "Attending") {
        successTitle.textContent = "We'll see you there! 🥂";
        successMsg.textContent = `Thank you, ${payload.name}! We are so excited to celebrate with you on February 14, 2026.`;
      } else {
        successTitle.textContent = "We'll miss you 💌";
        successMsg.textContent = `Thank you for letting us know, ${payload.name}. You will be in our hearts on our special day.`;
      }
    } catch {
      submitBtn.disabled = false;
      submitLabel.textContent = "Send My RSVP";
      errorEl.textContent = "Something went wrong. Please try again.";
      errorEl.hidden = false;
    }
  });
})();

/* ── 13 · MUSIC PLAYER ──────────────────────────────────────── */
(function initMusic() {
  const audio = document.getElementById("weddingSong");
  const btn = document.getElementById("musicBtn");
  const icon = document.getElementById("musicIcon");
  const label = document.getElementById("musicLabel");

  if (!audio || !btn) return;

  audio.volume = 0.7;

  const svgMuted = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  const svgSound = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>`;
  const svgPause = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;

  function setPlaying() {
    icon.innerHTML = svgSound;
    label.textContent = "Playing our song ♪";
    btn.setAttribute("aria-label", "Pause wedding song");
    btn.classList.add("playing");
  }

  function setPaused() {
    icon.innerHTML = svgPause;
    label.textContent = "Song paused";
    btn.setAttribute("aria-label", "Play wedding song");
    btn.classList.remove("playing");
  }

  function setPrompt() {
    icon.innerHTML = svgMuted;
    label.textContent = "Tap to hear our song";
    btn.setAttribute("aria-label", "Play wedding song");
    btn.classList.remove("playing");
  }

  // Music starts when the wax seal is clicked
  const sealBtn = document.getElementById("sealBtn");
  const splashScreen = document.getElementById("splashScreen");
  const envelope = document.getElementById("envelope");

  sealBtn?.addEventListener("click", () => {
    sealBtn.classList.add("clicked");
    // Short pause so the seal glow registers before the flap swings
    setTimeout(() => envelope?.classList.add("open"), 220);
    // Card finishes emerging at ~220 + 400(delay) + 1100(transition) = 1720ms
    setTimeout(() => {
      window.scrollTo(0, 0);          // reset before splash fades
      splashScreen.classList.add("hidden");
      startLoader();
      audio.muted = false;
      audio
        .play()
        .then(setPlaying)
        .catch(() => setPrompt());
    }, 1900);
  });

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(setPlaying);
    } else if (audio.muted) {
      audio.muted = false;
      setPlaying();
    } else {
      audio.pause();
      setPaused();
    }
  });
})();

/* inject the line-grow keyframes dynamically */
(function injectKeyframes() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes lineGrow {
      from { max-height: 0; }
      to   { max-height: 200px; }
    }
  `;
  document.head.appendChild(style);
})();
