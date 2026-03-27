// footer.js

import { getCompany } from "./api.js";

function createSocialIcon(src, alt, href) {
    return `
        <a href="${href}" target="_blank" rel="noopener noreferrer" class="social-link">
            <img src="${src}" alt="${alt}" class="social-logo">
        </a>
    `;
}

function injectLogos(footer, company) {
    const logoFooter = footer.querySelector(".logo-footer");
    const socialIcons = footer.querySelector(".social-icons");

    if (logoFooter) {
        logoFooter.innerHTML = `
            <img src="../Assets/Logos/CAT.jpeg" alt="${company.name}" class="footer-main-logo">
        `;
    }

    if (socialIcons) {
        socialIcons.innerHTML = `
            ${createSocialIcon("../Assets/Logos/instagram.png")}
            ${createSocialIcon("../Assets/Logos/facebook.png")}
            ${createSocialIcon("../Assets/Logos/twitter.png")}
            ${createSocialIcon("../Assets/Logos/whatsapp.png")}
        `;
    }
}

function injectColumns(footer, company) {
    const columns = footer.querySelectorAll(".footer-column");

    if (columns[0]) {
        const title = columns[0].querySelector("h4");
        const links = columns[0].querySelectorAll("a");

        if (title) title.textContent = company.name || "CAT Car Renting Service";

        if (links[0]) {
            links[0].textContent = company.email || "info@catrenting.com";
            links[0].href = `mailto:${company.email || "info@catrenting.com"}`;
        }

        if (links[1]) {
            links[1].textContent = company.phone || "+34 000 000 000";
            links[1].href = `tel:${company.phone || "+34000000000"}`;
        }

        if (links[2]) {
            links[2].textContent = "WhatsApp";
            links[2].href = `https://wa.me/${String(company.whatsapp || "").replace(/\D/g, "")}`;
        }

        if (links[3]) {
            links[3].textContent = company.address || "Dirección no disponible";
            links[3].href = "#";
        }
    }

    if (columns[1]) {
        const title = columns[1].querySelector("h4");
        const links = columns[1].querySelectorAll("a");

        if (title) title.textContent = "Información";

        if (links[0]) {
            links[0].textContent = "Contact";
            links[0].href = "./contact.html";
        }

        if (links[1]) {
            links[1].textContent = "FAQ";
            links[1].href = "./faq.html";
        }

        if (links[2]) {
            links[2].textContent = "Sobre Nosotros";
            links[2].href = "./information.html";
        }
    }
}

export async function injectFooterData() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    try {
        const company = await getCompany();
        injectLogos(footer, company);
        injectColumns(footer, company);
    } catch (error) {
        console.error("Error al inyectar el footer:", error);
    }
}