/* ==========================================================
   1. LIGHT / DARK THEME
   The saved choice is applied by the tiny script in <head>.
   Here we handle the button click.
   ========================================================== */
const root = document.documentElement;
const themeBtn = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function updateThemeUI(theme) {
  const next = theme === "dark" ? "light" : "dark";
  themeBtn.setAttribute("aria-label", `Switch to ${next} mode`);
  themeMeta.setAttribute("content", theme === "dark" ? "#1c1a17" : "#f2eee6");
}

themeBtn.addEventListener("click", function () {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  updateThemeUI(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    // storage can be blocked; the theme still changes for this visit
  }
});

updateThemeUI(root.dataset.theme);

/* ==========================================================
   2. MOBILE MENU (hamburger)
   ========================================================== */
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", function () {
  setMenu(!nav.classList.contains("open"));
});

// close the menu after tapping a link
nav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    setMenu(false);
  });
});

// close with the Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") setMenu(false);
});

/* ==========================================================
   3. ACTIVE NAV LINK
   Highlights the link for whichever section is in the
   middle of the screen, so it updates while you scroll.
   ========================================================== */
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

function setActive(id) {
  navLinks.forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  });
}

const sectionObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  // only the thin band around the middle of the screen counts
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach(function (section) {
  sectionObserver.observe(section);
});

// the Contact section is short, so also mark it active at the very bottom
window.addEventListener(
  "scroll",
  function () {
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    if (atBottom) setActive("contact");
  },
  { passive: true }
);

/* ==========================================================
   4. SCROLL REVEAL
   Elements with class "reveal" fade up the first time
   they come into view.
   ========================================================== */
const revealObserver = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target); // only animate once
      }
    });
  },
  { threshold: 0.15 }
);

// small delay between the skill cards so they appear one by one
document.querySelectorAll(".skills .reveal").forEach(function (item, index) {
  item.style.transitionDelay = index * 80 + "ms";
});

document.querySelectorAll(".reveal").forEach(function (item) {
  revealObserver.observe(item);
});

/* ==========================================================
   5. TYPING EFFECT
   Types a sentence, pauses, deletes it, then types the next.
   ========================================================== */
const phrases = [
  "I'm an aspiring Full-Stack Developer.",
  "I study Information Systems at FUTA.",
  "I'm learning JavaScript by building things.",
];

const typedEl = document.getElementById("typed");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let phraseIndex = 0;
let charCount = 0;
let deleting = false;

function tick() {
  const phrase = phrases[phraseIndex];
  charCount += deleting ? -1 : 1;
  typedEl.textContent = phrase.slice(0, charCount);

  let delay = deleting ? 35 : 70; // deleting is faster than typing

  if (!deleting && charCount === phrase.length) {
    deleting = true;
    delay = 1800; // pause once the sentence is complete
  } else if (deleting && charCount === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(tick, delay);
}

if (prefersReducedMotion) {
  typedEl.textContent = phrases[0]; // no animation, just show the first line
} else {
  setTimeout(tick, 700);
}

/* ==========================================================
   6. FOOTER YEAR
   ========================================================== */
document.getElementById("year").textContent = new Date().getFullYear();