const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- Overlay menu ---- */
const menuToggle = document.getElementById("menu-toggle");
const overlay = document.getElementById("overlay-menu");
function closeMenu() {
    if (!overlay) return;
    overlay.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "MENU";
}
menuToggle?.addEventListener("click", () => {
    const open = overlay.hidden;
    overlay.hidden = !open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "CLOSE" : "MENU";
});
overlay?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll(".reveal");
if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
} else {
    const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }),
        { threshold: 0.16 }
    );
    revealEls.forEach((el) => io.observe(el));
}

/* ---- Contact form: submit via AJAX so the page never redirects ---- */
const contactForm = document.querySelector(".contact-form");
contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".btn-submit");
    const status = contactForm.querySelector(".form-status");
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending…";
    if (status) { status.textContent = ""; status.classList.remove("is-error", "is-ok"); }
    try {
        const res = await fetch("https://formsubmit.co/ajax/bsevaraqq@gmail.com", {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(contactForm),
        });
        if (!res.ok) throw new Error("Request failed");
        btn.textContent = "Message sent ✓";
        if (status) { status.textContent = "Thanks — your message is on its way."; status.classList.add("is-ok"); }
        contactForm.reset();
        setTimeout(() => { btn.textContent = original; btn.disabled = false; if (status) status.textContent = ""; }, 6000);
    } catch (err) {
        btn.disabled = false;
        btn.textContent = original;
        if (status) { status.textContent = "Couldn't send. Email bsevaraqq@gmail.com directly."; status.classList.add("is-error"); }
    }
});

/* ---- Native smooth in-page anchor jumps ---- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
});
