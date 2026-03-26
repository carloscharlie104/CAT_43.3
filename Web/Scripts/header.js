import { getCompany } from "./api.js";

function createXIcon() {
    return `
        <svg class="icon-x" viewBox="0 0 100 100" aria-hidden="true">
            <line x1="10" y1="10" x2="90" y2="90"></line>
            <line x1="90" y1="10" x2="10" y2="90"></line>
        </svg>
    `;
}

function getHeaderConfig(company) {
    const fallbackIcons = {
        home: "../Assets/Logos/inicio.png",
        info: "../Assets/Logos/Logo Info.jpg",
        reservation: "../Assets/Logos/reservar.jpg",
        contact: "../Assets/Logos/contacto.webp",
        profile: "../Assets/Logos/perfil.png"
    };
    const mobileIcons = { ...fallbackIcons, ...(company?.mobileIcons || {}) };

    return {
        logoAlt: company?.name || "CAT Car Renting Service",
        homeHref: "../Pages/main.html",
        profileHref: "../Pages/loginRegisterRecovery/login.html",
        mobileIcons,
        navItems: [
            {
                label: "Inicio",
                shortLabel: "Inicio",
                href: "../Pages/main.html",
                iconSrc: mobileIcons.home
            },
            {
                label: "Información",
                shortLabel: "Info",
                href: "../Pages/information.html",
                iconSrc: mobileIcons.info
            },
            {
                label: "Reserva",
                shortLabel: "Reserva",
                href: "../Pages/reservation.html",
                iconSrc: mobileIcons.reservation
            },
            {
                label: "Contacto",
                shortLabel: "Contacto",
                href: "../Pages/contact.html",
                iconSrc: mobileIcons.contact
            }
        ]
    };
}

function injectDesktopHeader(header, config) {
    const logoHeader = header.querySelector(".logo-header");
    const navLinks = header.querySelector(".nav-links");
    const navActions = header.querySelector(".nav-actions");

    if (logoHeader) {
        logoHeader.innerHTML = `
            <a href="${config.homeHref}" aria-label="Inicio" class="logo-header-link">
                <img src="../Assets/Logos/CAT.jpeg" alt="${config.logoAlt}" class="header-main-logo">
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
        navActions.innerHTML = `
            <a href="${config.profileHref}" class="nav-pill yellow">Perfil</a>
        `;
    }
}

function injectMobileTop(header, config) {
    const mobileLogo = header.querySelector(".mobile-top-btn--logo");
    const mobileUser = header.querySelector(".mobile-top-btn--user");

    if (mobileLogo) {
        mobileLogo.href = config.homeHref;
        mobileLogo.innerHTML = `
            <img src="../Assets/Logos/CAT.jpeg" alt="${config.logoAlt}" class="header-mobile-logo">
        `;
    }

    if (mobileUser) {
        mobileUser.href = config.profileHref;
        mobileUser.innerHTML = config.mobileIcons?.profile
            ? `<img src="${config.mobileIcons.profile}" alt="Perfil" class="header-mobile-icon">`
            : createXIcon();
    }
}

function injectMobileBottom(header, config) {
    const mobileBottomNav = header.querySelector(".mobile-bottom-nav");

    if (!mobileBottomNav) return;

    mobileBottomNav.innerHTML = config.navItems
        .map(
            (item) => `
                <a href="${item.href}" class="mobile-bottom-item">
                    <span class="mobile-bottom-icon">
                        ${item.iconSrc
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

export async function injectHeaderData() {
    const header = document.querySelector("header");

    if (!header) {
        console.error("No existe ningún <header> en el DOM");
        return;
    }

    try {
        const company = await getCompany();
        const config = getHeaderConfig(company);

        injectDesktopHeader(header, config);
        injectMobileTop(header, config);
        injectMobileBottom(header, config);
    } catch (error) {
        console.error("Error al inyectar el header:", error);
    }
}
