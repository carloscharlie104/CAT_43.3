function assetUrl(relativePath) {
    return new URL(relativePath, import.meta.url).href;
}

function pageUrl(relativePath) {
    return new URL(relativePath, import.meta.url).href;
}

function createXIcon() {
    return `
        <svg class="icon-x" viewBox="0 0 100 100" aria-hidden="true">
            <line x1="10" y1="10" x2="90" y2="90"></line>
            <line x1="90" y1="10" x2="10" y2="90"></line>
        </svg>
    `;
}

const SESSION_KEY = "cat43_session";

function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

function logout(event) {
    if (event) {
        event.preventDefault();
    }

    clearSession();
    window.location.href = pageUrl("../Pages/main.html");
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getDisplayUsername(session) {
    if (!session || typeof session !== "object") {
        return "";
    }

    return session.username || session.userName || session.name || session.email || "";
}

function getHeaderConfig(company = {}) {
    const fallbackIcons = {
        home: assetUrl("../Assets/Logos/inicio.png"),
        info: assetUrl("../Assets/Logos/Logo Info.jpg"),
        reservation: assetUrl("../Assets/Logos/reservar.jpg"),
        contact: assetUrl("../Assets/Logos/contacto.webp"),
        profile: assetUrl("../Assets/Logos/perfil.png")
    };

    const companyIcons = company.mobileIcons || {};
    const mobileIcons = {
        home: companyIcons.home || fallbackIcons.home,
        info: companyIcons.info || fallbackIcons.info,
        reservation: companyIcons.reservation || fallbackIcons.reservation,
        contact: companyIcons.contact || fallbackIcons.contact,
        profile: companyIcons.profile || fallbackIcons.profile
    };

    return {
        logoAlt: company.name || "CAT Car Renting Service",
        logoSrc: assetUrl("../Assets/Logos/CAT.jpeg"),
        homeHref: pageUrl("../Pages/main.html"),
        profileHref: pageUrl("../Pages/loginRegisterRecovery/login.html"),
        mobileIcons,
        navItems: [
            {
                label: "Inicio",
                shortLabel: "Inicio",
                href: pageUrl("../Pages/main.html"),
                iconSrc: mobileIcons.home
            },
            {
                label: "Información",
                shortLabel: "Info",
                href: pageUrl("../Pages/information.html"),
                iconSrc: mobileIcons.info
            },
            {
                label: "Reserva",
                shortLabel: "Reserva",
                href: pageUrl("../Pages/reservation.html"),
                iconSrc: mobileIcons.reservation
            },
            {
                label: "Contacto",
                shortLabel: "Contacto",
                href: pageUrl("../Pages/contact.html"),
                iconSrc: mobileIcons.contact
            }
        ]
    };
}

function injectDesktopHeader(header, config) {
    const logoHeader = header.querySelector(".logo-header");
    const navLinks = header.querySelector(".nav-links");
    const navActions = header.querySelector(".nav-actions");
    const session = getSession();
    const username = getDisplayUsername(session);

    if (logoHeader) {
        logoHeader.innerHTML = `
            <a href="${config.homeHref}" aria-label="Inicio" class="logo-header-link">
                <img src="${config.logoSrc}" alt="${config.logoAlt}" class="header-main-logo">
            </a>
        `;
    }

    if (navLinks) {
        navLinks.innerHTML = config.navItems
            .map(
                (item) => `
                    <a href="${item.href}" class="nav-pill">${item.label}</a>
                `
            )
            .join("");
    }

    if (navActions) {
        if (username) {
            navActions.innerHTML = `
                <div class="nav-session">
                    <span class="nav-pill nav-user">${escapeHtml(username)}</span>
                    <button type="button" class="nav-pill yellow nav-logout-btn" id="logout-btn">
                        Salir
                    </button>
                </div>
            `;
        } else {
            navActions.innerHTML = `
                <a href="${config.profileHref}" class="nav-pill yellow">Perfil</a>
            `;
        }
    }
}

function injectMobileTop(header, config) {
    const mobileLogo = header.querySelector(".mobile-top-btn--logo");
    const mobileUser = header.querySelector(".mobile-top-btn--user");
    const session = getSession();
    const username = getDisplayUsername(session);

    if (mobileLogo) {
        mobileLogo.href = config.homeHref;
        mobileLogo.innerHTML = `
            <img src="${config.logoSrc}" alt="${config.logoAlt}" class="header-mobile-logo">
        `;
    }

    if (mobileUser) {
        if (username) {
            mobileUser.href = "#";
            mobileUser.setAttribute("aria-label", `Salir (${username})`);
            mobileUser.setAttribute("title", `Salir (${username})`);
            mobileUser.dataset.logout = "true";
        } else {
            mobileUser.href = config.profileHref;
            mobileUser.setAttribute("aria-label", "Acceso o registro");
            mobileUser.removeAttribute("title");
            delete mobileUser.dataset.logout;
        }

        mobileUser.innerHTML = config.mobileIcons.profile
            ? `<img src="${config.mobileIcons.profile}" alt="Perfil" class="header-mobile-icon">`
            : createXIcon();
    }
}

function injectMobileBottom(header, config) {
    const mobileBottomNav = header.querySelector(".mobile-bottom-nav");

    if (!mobileBottomNav) {
        return;
    }

    mobileBottomNav.innerHTML = config.navItems
        .map(
            (item) => `
                <a href="${item.href}" class="mobile-bottom-item">
                    <span class="mobile-bottom-icon">
                        ${
                item.iconSrc
                    ? `<img src="${item.iconSrc}" alt="${item.label}" class="mobile-bottom-icon-image">`
                    : createXIcon()
            }
                    </span>
                    <span class="mobile-bottom-text">${item.shortLabel}</span>
                </a>
            `
        )
        .join("");
}

function bindHeaderEvents(header) {
    const logoutBtn = header.querySelector("#logout-btn");
    const mobileLogoutBtn = header.querySelector(".mobile-top-btn--user[data-logout='true']");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", logout);
    }
}

export async function injectHeaderData() {
    const header = document.querySelector("header");

    if (!header) {
        console.error("No existe ningún <header> en el DOM");
        return;
    }

    try {
        const company = {};
        const config = getHeaderConfig(company);

        injectDesktopHeader(header, config);
        injectMobileTop(header, config);
        injectMobileBottom(header, config);
        bindHeaderEvents(header);
    } catch (error) {
        console.error("Error al inyectar el header:", error);
    }
}