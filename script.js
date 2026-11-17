// Change this to your real email address
const CONTACT_EMAIL = "gudurunarendra60@gmail.com";

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", e => {
  if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); }
});

// Pricing tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("on"));
    tab.classList.add("on");
    document.getElementById("p-audit").hidden = tab.dataset.tab !== "audit";
    document.getElementById("p-monthly").hidden = tab.dataset.tab !== "monthly";
  });
});

// Growth chart (sample data, edit the numbers to change the curve)
(function drawChart() {
  const data = [10, 16, 24, 34, 50, 62, 74, 88];
  const W = 600, H = 220, pad = 24;
  const x = i => pad + (i * (W - pad * 2)) / (data.length - 1);
  const y = v => H - pad - (v / 100) * (H - pad * 2);
  let d = `M${x(0)},${y(data[0])}`;
  for (let i = 1; i < data.length; i++) {
    const cx = (x(i - 1) + x(i)) / 2;
    d += ` C${cx},${y(data[i - 1])} ${cx},${y(data[i])} ${x(i)},${y(data[i])}`;
  }
  const last = data.length - 1;
  const grid = [25, 50, 75].map(v => `<line x1="${pad}" x2="${W - pad}" y1="${y(v)}" y2="${y(v)}" stroke="#43297d"/>`).join("");
  document.getElementById("chart").innerHTML = `
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa" stop-opacity=".45"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    <path d="${d} L${x(last)},${H - pad} L${x(0)},${H - pad} Z" fill="url(#g)"/>
    <path d="${d}" fill="none" stroke="#a78bfa" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${x(4)}" cy="${y(data[4])}" r="6" fill="#fff" stroke="#a78bfa" stroke-width="3"/>
    <circle cx="${x(last)}" cy="${y(data[last])}" r="7" fill="#ff6f61"/>`;
})();

// Count-up numbers and progress bars when scrolled into view
const fmt = n => n.toLocaleString("en-IN");
function countUp(el) {
  const target = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = pre + fmt(target) + suf; return; }
  const start = performance.now(), dur = 1200;
  (function tick(t) {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = pre + fmt(Math.round(target * (1 - Math.pow(1 - p, 3)))) + suf;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    if (en.target.dataset.count) countUp(en.target);
    if (en.target.classList.contains("bar")) en.target.classList.add("go");
    io.unobserve(en.target);
  });
}, { threshold: 0.4 });
document.querySelectorAll("[data-count], .bar").forEach(el => io.observe(el));

// Contact form
const form = document.getElementById("form");
const sendBtn = document.getElementById("sendBtn");
const hint = document.getElementById("hint");
const formMsg = document.getElementById("formMsg");
const thanks = document.getElementById("thanks");
const emailOk = v => /^\S+@\S+\.\S+$/.test(v);

// The Send button only works when every field is filled in
function checkForm() {
  const ok = form.name.value.trim().length > 1 &&
             emailOk(form.email.value.trim()) &&
             form.site.value.trim().length > 3 &&
             form.msg.value.trim().length > 4;
  sendBtn.disabled = !ok;
  hint.classList.toggle("ok", ok);
}
form.addEventListener("input", checkForm);

function openThanks() {
  thanks.hidden = false;
  document.getElementById("thanksClose").focus();
}
function closeThanks() { thanks.hidden = true; sendBtn.focus(); }
document.getElementById("thanksClose").addEventListener("click", closeThanks);
thanks.addEventListener("click", e => { if (e.target === thanks) closeThanks(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !thanks.hidden) closeThanks(); });

form.addEventListener("submit", async e => {
  e.preventDefault();
  checkForm();
  if (sendBtn.disabled) return;
  sendBtn.disabled = true;               // stops double clicks
  sendBtn.textContent = "Sending…";
  formMsg.className = ""; formMsg.textContent = "";
  try {
    const res = await fetch("https://formsubmit.co/ajax/" + CONTACT_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        website: form.site.value.trim(),
        message: form.msg.value.trim(),
        _subject: "New SEO audit request from " + form.name.value.trim(),
        _replyto: form.email.value.trim(),
        _template: "table",
        _captcha: "false",
        _honey: form._honey.value
      })
    });
    const data = await res.json();
    if (!res.ok || data.success === "false" || data.success === false) throw new Error(data.message || "Failed");
    form.reset();
    openThanks();
  } catch (err) {
    formMsg.className = "err";
    formMsg.textContent = "Could not send. Please email " + CONTACT_EMAIL + " directly.";
  } finally {
    sendBtn.textContent = "Send request";
    checkForm();
  }
});
checkForm();

document.getElementById("yr").textContent = new Date().getFullYear();
