/* ============================================================
   Admin Dashboard — interactive behavior
   ============================================================ */

// ---------- Seed data ----------
const PROJECTS = [
  { id: 1, title: "Super Cool Project", text: "Sed tempus ut lacus ut scelerisque. Suspendisse sollicitudin nibh erat, id facilisis felis accumsan nec.", color: "#3b82f6" },
  { id: 2, title: "Less Cool Project", text: "Nullam condimentum ipsum ut lectus vehicula consectetur. Quisque sed dolor tincidunt.", color: "#8b5cf6" },
  { id: 3, title: "Impossible App", text: "In hac habitasse platea dictumst. Vivamus dictum rutrum arcu, a placerat velit sagittis id.", color: "#f97316" },
  { id: 4, title: "Easy Peasy App", text: "Etiam cursus eros ac efficitur fringilla. Vestibulum dignissim urna eget accumsan aliquam.", color: "#22c55e" },
  { id: 5, title: "Ad Blocker", text: "Quisque eget rutrum nisl. Nam augue justo, cursus vitae metus vel, pharetra hendrerit felis.", color: "#ec4899" },
  { id: 6, title: "Money Maker", text: "Praesent convallis, libero quis congue elementum, nunc ante faucibus sapien, ac scelerisque tortor purus.", color: "#14b8a6" },
];

const grid = document.getElementById("projectsGrid");

// ---------- Render projects ----------
function renderProjects(list = PROJECTS) {
  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = `<p class="no-results">No projects match your search.</p>`;
    return;
  }

  list.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.borderLeftColor = p.color;
    card.style.animationDelay = `${i * 40}ms`;
    card.dataset.title = p.title.toLowerCase();
    card.innerHTML = `
      <h3 class="card__title">${p.title}</h3>
      <p class="card__text">${p.text}</p>
      <div class="card__actions">
        <button class="icon-btn" data-act="star" aria-label="Star"><svg class="icon"><use href="#i-star"></use></svg></button>
        <button class="icon-btn" data-act="watch" aria-label="Watch"><svg class="icon"><use href="#i-eye"></use></svg></button>
        <button class="icon-btn" data-act="share" aria-label="Share"><svg class="icon"><use href="#i-share"></use></svg></button>
      </div>
    `;
    grid.appendChild(card);
  });
}

renderProjects();

// ---------- Search filter ----------
const searchInput = document.getElementById("searchInput");
let searchTimer;

searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = q
      ? PROJECTS.filter((p) => p.title.toLowerCase().includes(q) || p.text.toLowerCase().includes(q))
      : PROJECTS;
    renderProjects(filtered);
  }, 150);
});

// ---------- Card action buttons (event delegation) ----------
grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".icon-btn");
  if (!btn) return;

  const act = btn.dataset.act;
  const card = btn.closest(".card");
  const title = card.querySelector(".card__title").textContent;

  if (act === "star") {
    btn.style.color = btn.style.color === "gold" ? "" : "gold";
    toast(`⭐ ${btn.style.color ? "Starred" : "Unstarred"}: ${title}`);
  } else if (act === "watch") {
    toast(`👁 Watching: ${title}`);
  } else if (act === "share") {
    toast(`🔗 Share link copied for: ${title}`);
  }
});

// ---------- Sidebar nav active state ----------
document.querySelectorAll("[data-nav]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll("[data-nav]").forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    toast(`Navigated to: ${link.textContent.trim()}`);
  });
});

// ---------- Sidebar toggle (double-click on brand) ----------
document.querySelector(".sidebar__brand").addEventListener("dblclick", () => {
  document.querySelector(".layout").classList.toggle("collapsed");
});

// ---------- Time-based greeting ----------
function updateGreeting() {
  const h = new Date().getHours();
  const greeting =
    h < 5  ? "Burning the midnight oil," :
    h < 12 ? "Good morning," :
    h < 18 ? "Good afternoon," :
             "Good evening,";
  document.getElementById("greetingHi").textContent = greeting;
}
updateGreeting();
setInterval(updateGreeting, 60_000);

// ---------- Theme toggle ----------
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("use");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeIcon.setAttribute("href", theme === "dark" ? "#i-sun" : "#i-moon");
  localStorage.setItem("dash-theme", theme);
}

applyTheme(localStorage.getItem("dash-theme") || "light");

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
});

// ---------- Notification dropdown ----------
const notifDropdown = document.getElementById("notifDropdown");
const notifBtn = document.getElementById("notifBtn");

notifBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  notifDropdown.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!notifDropdown.contains(e.target)) notifDropdown.classList.remove("open");
});

document.querySelectorAll(".dropdown__item").forEach((item) => {
  item.addEventListener("click", () => {
    notifDropdown.classList.remove("open");
    notifBtn.removeAttribute("data-badge");
    toast("Notification opened");
  });
});

// ---------- "New" project button ----------
document.getElementById("newProjectBtn").addEventListener("click", () => {
  const title = prompt("Project name?");
  if (!title) return;
  const text = prompt("Short description?") || "No description yet.";
  const colors = ["#3b82f6", "#8b5cf6", "#f97316", "#22c55e", "#ec4899", "#14b8a6"];
  PROJECTS.unshift({
    id: Date.now(),
    title,
    text,
    color: colors[Math.floor(Math.random() * colors.length)],
  });
  renderProjects();
  toast(`✅ Project "${title}" created`);
});

// ---------- Other header buttons ----------
document.querySelectorAll("[data-action]").forEach((btn) => {
  btn.addEventListener("click", () => toast(`${btn.dataset.action} clicked`));
});

// ---------- Toast utility ----------
let toastEl;
let toastTimer;

function toast(msg) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    Object.assign(toastEl.style, {
      position: "fixed",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%) translateY(20px)",
      background: "var(--text)",
      color: "var(--surface)",
      padding: "10px 20px",
      borderRadius: "999px",
      boxShadow: "var(--shadow-lg)",
      fontSize: "0.85rem",
      fontWeight: "500",
      opacity: "0",
      transition: "opacity .25s ease, transform .25s ease",
      zIndex: "9999",
      pointerEvents: "none",
    });
    document.body.appendChild(toastEl);
  }

  toastEl.textContent = msg;
  requestAnimationFrame(() => {
    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateX(-50%) translateY(0)";
  });

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.style.opacity = "0";
    toastEl.style.transform = "translateX(-50%) translateY(20px)";
  }, 2200);
}

// ---------- Keyboard shortcut: "/" focuses search ----------
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
});