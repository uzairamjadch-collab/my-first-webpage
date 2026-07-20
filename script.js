document.addEventListener("DOMContentLoaded", () => {
    if (typeof AOS !== "undefined") {
        AOS.init({
            offset: 100,
            delay: 30,
            duration: 800,
            easing: 'ease-out-quint',
            once: true,
            disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }

    const navContainer = document.querySelector('.nav-container');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');

    let navBackdrop = document.querySelector('.nav-backdrop');
    if (!navBackdrop) {
        navBackdrop = document.createElement('div');
        navBackdrop.className = 'nav-backdrop';
        document.body.appendChild(navBackdrop);
    }

    function openMenu() {
        navContainer?.classList.add('active');
        navBackdrop.classList.add('active');
        menuToggle?.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenuFn() {
        navContainer?.classList.remove('active');
        navBackdrop.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }

    window.toggleMenu = function () {
        if (navContainer?.classList.contains('active')) {
            closeMenuFn();
        } else {
            openMenu();
        }
    };

    window.closeMenu = closeMenuFn;

    menuClose?.addEventListener('click', closeMenuFn);
    navBackdrop.addEventListener('click', closeMenuFn);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenuFn);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenuFn();
    });

    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cards = document.querySelectorAll(".service-card, .work-card, .toolkit-category-card");

    const backdrop = document.createElement("div");
    backdrop.className = "kinetic-backdrop-blur";
    document.body.appendChild(backdrop);

    let activeExpandedCard = null;
    let originalCardState = { top: 0, left: 0, width: 0, height: 0, parent: null, sibling: null, styleCSS: "" };

    if (supportsHover) {
        cards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                if (card.classList.contains("kinetic-expanded-view")) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const rotateX = (-y / rect.height) * 8;
                const rotateY = (x / rect.width) * 8;

                card.style.transform = `perspective(1200px) translate3d(0, -5px, 10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                card.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.6)`;
            });

            card.addEventListener("mouseleave", () => {
                if (card.classList.contains("kinetic-expanded-view")) return;
                card.style.transform = "perspective(1200px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)";
                card.style.boxShadow = "";
            });

            card.addEventListener("click", (e) => {
                if (card.classList.contains("kinetic-expanded-view")) return;
                e.stopPropagation();

                if (activeExpandedCard) {
                    collapseCard(activeExpandedCard);
                }

                const rect = card.getBoundingClientRect();
                originalCardState = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    parent: card.parentNode,
                    sibling: card.nextSibling,
                    styleCSS: card.style.cssText
                };

                card.style.width = `${rect.width}px`;
                card.style.height = `${rect.height}px`;
                card.style.position = "fixed";
                card.style.top = `${rect.top}px`;
                card.style.left = `${rect.left}px`;
                card.style.margin = "0";

                document.body.appendChild(card);
                activeExpandedCard = card;

                requestAnimationFrame(() => {
                    backdrop.classList.add("active");
                    card.classList.add("kinetic-expanded-view");
                    card.style.top = "50%";
                    card.style.left = "50%";
                    card.style.width = window.innerWidth > 768 ? "540px" : "90vw";
                    card.style.height = "auto";
                });
            });
        });

        backdrop.addEventListener("click", () => {
            if (activeExpandedCard) {
                collapseCard(activeExpandedCard);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && activeExpandedCard) {
                collapseCard(activeExpandedCard);
            }
        });
    }

    function collapseCard(card) {
        backdrop.classList.remove("active");
        card.classList.remove("kinetic-expanded-view");

        card.style.top = `${originalCardState.top}px`;
        card.style.left = `${originalCardState.left}px`;
        card.style.width = `${originalCardState.width}px`;
        card.style.height = `${originalCardState.height}px`;
        card.style.transform = "perspective(1200px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)";

        const transitionEndHandler = () => {
            card.style.cssText = originalCardState.styleCSS;
            if (originalCardState.sibling) {
                originalCardState.parent.insertBefore(card, originalCardState.sibling);
            } else {
                originalCardState.parent.appendChild(card);
            }
            activeExpandedCard = null;
            card.removeEventListener("transitionend", transitionEndHandler);
        };

        card.addEventListener("transitionend", transitionEndHandler);
    }

    if (supportsHover) {
        const buttons = document.querySelectorAll(".btn, .nav-btn, .submit-btn");
        buttons.forEach(btn => {
            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate3d(${x * 0.2}px, ${y * 0.2}px, 0) scale(1.01)`;
            });

            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "translate3d(0, 0, 0) scale(1)";
            });
        });
    }

    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        const statusEl = document.querySelector(".form-status");
        const submitBtn = contactForm.querySelector(".submit-btn");

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Sending…";
            }
            if (statusEl) {
                statusEl.textContent = "";
                statusEl.className = "form-status";
            }

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    headers: { Accept: "application/json" },
                    body: formData
                });
                const result = await response.json();

                if (response.status === 200 && result.success !== false) {
                    if (statusEl) {
                        statusEl.textContent = "Message sent — thanks, I'll be in touch soon.";
                        statusEl.className = "form-status success";
                    }
                    contactForm.reset();
                } else {
                    throw new Error(result.message || "Submission failed");
                }
            } catch (err) {
                if (statusEl) {
                    statusEl.textContent = "Something went wrong — please try again or email me directly.";
                    statusEl.className = "form-status error";
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Transmit Message";
                }
            }
        });
    }
});
