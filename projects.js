/* Projects page: builds the cards, the filter bar, and the pop-up details.
   To add a project, copy one block in the list below and edit it. */

const projects = [
  {
    id: "assistive-routine-device",
    title: "Assistive Routine Device with Custom PCB &amp; Embedded GUI",
    course: "ECE 196",
    tags: ["embedded", "hardware"],
    role: "Hardware &amp; UI Development",
    team: "Group of 3",
    summary: "A handheld device built to help engineering students follow daily routines.",
    did: [
      "Researched component datasheets to determine how each peripheral interfaced with the ESP32, then designed the PCB schematic and layout in KiCad, including resistor/capacitor tuning for reliable component response.",
      "Assembled the physical board through soldering and PCB baking.",
      "Laid out UI screens in SquareLine Studio, then coded the LVGL button events and interrupt-driven navigation logic in Arduino IDE to match the device's physical buttons."
    ],
    tech: ["KiCad", "ESP32-S3", "LVGL", "SquareLine Studio", "Arduino IDE"],
    links: [{ label: "The Mindful Crew project site", url: "https://m7delacruz.wixsite.com/brain-buddies" }]
  },
  {
    id: "vehicle-steering-control",
    title: "Vehicle Steering Control with PID &amp; Lead-Lag Compensator",
    course: "ECE 171A",
    tags: ["controls"],
    role: "Solo project",
    team: "Individual",
    summary: "Designing and comparing two closed-loop controllers for a linearized vehicle steering plant.",
    did: [
      "Derived the transfer function from the linearized state space model and confirmed open loop stability via pole/zero, step response, and Bode analysis.",
      "Found that proportional only control produced an unstable closed loop system; adding integral and derivative terms yielded a stable PID design.",
      "Designed a lead-lag compensator using root locus placement; found it stable but with lower phase margin and higher overshoot than the PID design."
    ],
    tech: ["MATLAB", "Control System Toolbox"],
    links: []
  },
  {
    id: "line-following-robot",
    title: "Autonomous Line Following Robot",
    course: "ECE 5",
    tags: ["controls", "embedded"],
    role: "Group member",
    team: "Group of 4",
    summary: "A robot that autonomously follows a taped line using a PID control loop.",
    did: [
      "Implemented a PID controller in Arduino, computing error as the difference between desired and measured line position and combining proportional, integral, and derivative terms into a turn signal.",
      "Built photoresistor-based voltage divider circuits to sense line position and tuned PID gains to balance rise time, overshoot, and settling time for the competition track.",
      "Designed and 3D-printed the chassis, integrating the light shield, sensors, and motor wiring into a single functional robot for the class competition."
    ],
    tech: ["Arduino", "PID Control", "CAD", "3D Printing"],
    links: [{ label: "El Perro project site", url: "https://joannacastillo647.wixsite.com/elperro" }]
  },
  {
    id: "privtag",
    title: "PrivTag — Low-Power Bluetooth Loss-Detection Tag",
    course: "CSE 190",
    tags: ["embedded"],
    role: "Embedded Systems Engineer",
    team: "Group of 2",
    summary: "A low-power tracker that detects when an item has been left behind and alerts a nearby phone over Bluetooth.",
    did: [
      "Wrote I2C/accelerometer drivers and a found/lost state machine driven by hardware interrupts.",
      "Broadcast timestamped BLE alerts over virtual UART while in the lost state.",
      "Gated clocks and used deep sleep to hit the project's power target."
    ],
    tech: ["STM32L475", "C"],
    links: []
  },
  {
    id: "sha-256-hash-engine",
    title: "SHA-256 &amp; Bitcoin Hash Engine (Verilog RTL)",
    course: "ECE 111",
    tags: ["hardware"],
    role: "RTL Designer",
    team: "Group of 2",
    summary: "SHA-256 as a synthesizable FSM, extended to double-SHA-256 Bitcoin-style mining across a range of random values.",
    did: [
      "Designed an FSM in Verilog that reads a message from memory, applies SHA-256 padding, computes the hash block by block using the standard function, then writes the final digest back to memory.",
      "Extended the design to double SHA-256 for Bitcoin block hashing, where the engine hashed an 80-byte header across two 512-bit blocks, then rehashed the result, sweeping 16 random values and writing each output hash to memory.",
      "Verified functional correctness in ModelSim and synthesized the design in Quartus Prime, achieving 152.11 MHz Fmax on an Arria II GX FPGA."
    ],
    tech: ["Verilog", "Quartus", "ModelSim"],
    links: []
  }
];

/* ---------- Grab the page elements ---------- */
const grid = document.getElementById("project-grid");
const filterButtons = document.querySelectorAll(".filter-button");
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalSub = document.getElementById("modal-sub");
const modalBody = document.getElementById("modal-body");
const modalLinks = document.getElementById("modal-links");

let currentFilter = "all";
let currentId = null;

/* ---------- Build the cards ---------- */
const topicNames = { embedded: "Embedded", controls: "Controls", hardware: "Hardware" };

function cardHTML(p, index) {
  return `
    <li class="project-item reveal" data-id="${p.id}" data-tags="${p.tags.join(" ")}" style="--i:${index}">
      <article class="project-card tag-${p.tags[0]}">
        <div class="project-banner">
          <span class="project-course">${p.course}</span>
          <span class="project-topic">${topicNames[p.tags[0]]}</span>
        </div>
        <div class="project-body">
          <h3>${p.title}</h3>
          <p class="project-summary">${p.summary}</p>
          <ul class="chips" aria-label="Technologies used">
            ${p.tech.slice(0, 3).map((t) => `<li>${t}</li>`).join("")}
            ${p.tech.length > 3 ? `<li class="more">+${p.tech.length - 3} more</li>` : ""}
          </ul>
          <div class="project-foot">
            <button type="button" class="learn-more">Learn more <span aria-hidden="true">→</span></button>
            <span class="project-team">${p.team}</span>
          </div>
        </div>
      </article>
    </li>`;
}

grid.innerHTML = projects.map(cardHTML).join("");
const items = [...grid.querySelectorAll(".project-item")];

/* ---------- Fade cards in as you scroll ---------- */
if ("IntersectionObserver" in window) {
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((item) => revealer.observe(item));
} else {
  items.forEach((item) => item.classList.add("visible"));
}

/* ---------- Filter bar ---------- */
function matchesFilter(p) {
  return currentFilter === "all" || p.tags.includes(currentFilter);
}

function applyFilter(key) {
  currentFilter = key;

  filterButtons.forEach((btn) => {
    const isActive = btn.dataset.filter === key;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive);
  });

  items.forEach((item) => {
    const show = key === "all" || item.dataset.tags.split(" ").includes(key);
    item.hidden = !show;
    if (show) {
      // Restart the little "pop" animation on cards that appear
      item.classList.remove("pop");
      void item.offsetWidth;
      item.classList.add("pop");
    }
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
});

/* ---------- Pop-up with project details ---------- */
function openProject(id) {
  const p = projects.find((project) => project.id === id);
  if (!p) return;
  currentId = id;

  modalTitle.innerHTML = p.title;
  modalSub.innerHTML = `${p.course} · ${p.role} · ${p.team}`;

  modalBody.innerHTML = `
    <h3>Overview</h3>
    <p>${p.summary}</p>
    <h3>What I did</h3>
    <ul class="modal-list">${p.did.map((d) => `<li>${d}</li>`).join("")}</ul>
    <h3>Tools &amp; technologies</h3>
    <ul class="chips">${p.tech.map((t) => `<li>${t}</li>`).join("")}</ul>`;
  modalBody.scrollTop = 0;

  modalLinks.innerHTML = p.links.length
    ? p.links.map((l) => `<a class="modal-link" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label} ↗</a>`).join("")
    : `<a class="modal-link" href="contact.html">Ask me about this project</a>`;

  if (!modal.open) {
    modal.showModal();
    document.body.style.overflow = "hidden";   // stop the page scrolling behind the pop-up
  }
  history.replaceState(null, "", `#${id}`);    // lets people link straight to a project
}

function step(direction) {
  const list = projects.filter(matchesFilter);
  const position = list.findIndex((p) => p.id === currentId);
  const next = list[(position + direction + list.length) % list.length];
  if (next) openProject(next.id);
}

// Click anywhere on a card to open it
grid.addEventListener("click", (event) => {
  const item = event.target.closest(".project-item");
  if (item) openProject(item.dataset.id);
});

document.getElementById("modal-close").addEventListener("click", () => modal.close());
document.getElementById("modal-prev").addEventListener("click", () => step(-1));
document.getElementById("modal-next").addEventListener("click", () => step(1));

// Clicking the dark area outside the pop-up closes it
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

// Left/right arrow keys flip between projects (Esc closes, built in)
modal.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") step(-1);
  if (event.key === "ArrowRight") step(1);
});

// Runs for every way the pop-up can close
modal.addEventListener("close", () => {
  document.body.style.overflow = "";
  history.replaceState(null, "", window.location.pathname + window.location.search);
});

// If the page was opened with #project-id in the link, open that project
const linked = window.location.hash.slice(1);
if (linked) openProject(linked);