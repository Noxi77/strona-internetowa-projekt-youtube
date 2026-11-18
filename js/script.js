const menuBtn = document.querySelector(".menu-icon");
const searchBox = document.getElementById("search");
const emptyMsg = document.getElementById("no-results");
const cards = document.querySelectorAll(".video");
const chipBtns = document.querySelectorAll(".chip");
const sideLinks = document.querySelectorAll(".sidebar > a");
const pageLinks = [...sideLinks].filter(a => !a.classList.contains("channel"));
let currentCat = "Wszystkie";

menuBtn.addEventListener("click", function () {
  document.body.classList.toggle("menu-hidden");
});

function filterCards() {
  const q = searchBox.value.trim().toLowerCase();
  let count = 0;

  for (const card of cards) {
    const okText = card.textContent.toLowerCase().includes(q);
    const okCat = currentCat === "Wszystkie" || card.dataset.category === currentCat;
    card.classList.toggle("hidden", !(okText && okCat));
    if (okText && okCat) count++;
  }

  emptyMsg.classList.toggle("hidden", count > 0);
}

searchBox.addEventListener("input", filterCards);

for (const chip of chipBtns) {
  chip.addEventListener("click", function () {
    chipBtns.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentCat = chip.textContent;
    filterCards();
  });
}

for (const img of document.querySelectorAll(".thumbnail img")) {
  const backup = img.dataset.fallback;
  const swap = () => {
    if (backup && img.src !== backup) img.src = backup;
  };
  img.addEventListener("error", swap);
  if (img.complete && img.naturalWidth === 0) swap();
}

function markActive(link) {
  pageLinks.forEach(a => a.classList.toggle("active", a === link));
}

for (const link of sideLinks) {
  link.addEventListener("click", function (e) {
    if (link.getAttribute("href") === "#") e.preventDefault();
    if (pageLinks.includes(link)) markActive(link);
  });
}

const watcher = new IntersectionObserver(function (entries) {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const href = "#" + entry.target.id;
    if (document.querySelector(`.sidebar > a.active[href="${href}"]`)) continue;
    const link = document.querySelector(`.sidebar > a[href="${href}"]`);
    if (link) markActive(link);
  }
}, { rootMargin: "-30% 0px -60% 0px" });

document.querySelectorAll("main section[id]").forEach(s => watcher.observe(s));
