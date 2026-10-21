/* Makes the hamburger menu button work.
   Without this file the button exists in the HTML, but clicking it does nothing.

   document.querySelector(...) finds the FIRST element on the page that
   matches the given CSS selector. */

// The hamburger button (class="menu-toggle")
const menuButton = document.querySelector(".menu-toggle");

// The <nav> inside the <header>, which gets shown or hidden
const navigation = document.querySelector("header nav");

// Only run if both exist on the page
if (menuButton && navigation) {
  // addEventListener waits for a specific event (here, a click)
  menuButton.addEventListener("click", () => {
    // classList.toggle("open") adds the "open" class if it isn't there,
    // or removes it if it is, so each click flips the menu on/off
    const isOpen = navigation.classList.toggle("open");

    // Tells screen readers whether the menu is currently open
    menuButton.setAttribute("aria-expanded", isOpen);
  });
}

/* Typewriter effect for the intro on the home page.
   The full text stays in the HTML (so search engines, screen readers, and
   anyone with JavaScript off still get it). This script hides it visually
   and types it out one letter at a time instead. */
const typewriter = document.querySelector(".typewriter");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typewriter && !reduceMotion) {
  // Grab the full text, with extra spaces and line breaks cleaned up
  const fullText = typewriter.textContent.trim().replace(/\s+/g, " ");

  // Lock in the paragraph's final height so the page doesn't jump while typing
  typewriter.style.minHeight = typewriter.offsetHeight + "px";

  // Screen readers read this hidden copy instead of the half-typed text
  const readerCopy = document.createElement("span");
  readerCopy.className = "sr-only";
  readerCopy.textContent = fullText;

  // The part people see: typed text plus a blinking cursor
  const typed = document.createElement("span");
  typed.setAttribute("aria-hidden", "true");
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");

  typewriter.textContent = "";
  typewriter.append(readerCopy, typed, cursor);

  let position = 0;

  function typeNextLetter() {
    if (position >= fullText.length) return;

    const letter = fullText.charAt(position);
    typed.textContent += letter;
    position++;

    // Typing speed: a little random so it feels human, with a short
    // pause after punctuation
    let delay = 30 + Math.random() * 40;
    if (".!?".includes(letter)) delay += 350;
    else if (",".includes(letter)) delay += 150;

    setTimeout(typeNextLetter, delay);
  }

  // Start typing once the intro is actually on screen. On a phone it sits
  // below the photo, so this makes sure you don't miss the typing.
  if ("IntersectionObserver" in window) {
    const watcher = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        watcher.disconnect();
        setTimeout(typeNextLetter, 500);
      }
    }, { threshold: 0.3 });
    watcher.observe(typewriter);
  } else {
    setTimeout(typeNextLetter, 700);
  }
}

// Header: stays at the top while scrolling, and turns see-through once you scroll down.
// Adds the "scrolled" class after 20px of scrolling and removes it back at the top.
const siteHeader = document.querySelector("header");
if (siteHeader) {
  window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// Fade things in as they scroll into view (anything with class="reveal").
// Cards that projects.js builds later handle their own fade-in.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 90 + "ms";
    revealer.observe(el);
  });
} else {
  revealItems.forEach((el) => el.classList.add("in"));
}