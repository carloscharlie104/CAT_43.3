import { getCompany } from "./api.js";

function assetUrl(relativePath) {
    return new URL(relativePath, import.meta.url).href;
}

function pageUrl(relativePath) {
    return new URL(relativePath, import.meta.url).href;
}

function createSocialIcon(src, alt, href) {
    return `
        <a href="${href}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${alt}">
            <img src="${src}" alt="${alt}" class="social-logo">
        </a>
    `;
}

function injectLogos(footer, company = {}) {
    const logoFooter = footer.querySelector(".logo-footer");
    const socialIcons = footer.querySelector(".social-icons");

    if (logoFooter) {
        logoFooter.innerHTML = `
            <a href="${pageUrl("../Pages/main.html")}" aria-label="Inicio">
                <img src="${assetUrl("../Assets/Logos/CAT.jpeg")}" alt="${company.name || "CAT Car Renting Service"}" class="footer-main-logo">
            </a>
        `;
    }

    if (socialIcons) {
        socialIcons.innerHTML = `
            ${createSocialIcon(assetUrl("../Assets/Logos/instagram.png"), "Instagram", "https://www.instagram.com")}
            ${createSocialIcon(assetUrl("../Assets/Logos/facebook.png"), "Facebook", "https://www.facebook.com")}
            ${createSocialIcon(assetUrl("../Assets/Logos/twitter.png"), "X", "https://www.x.com")}
            ${createSocialIcon(assetUrl("../Assets/Logos/whatsapp.png"), "WhatsApp", `https://wa.me/${String(company.whatsapp || "").replace(/\D/g, "")}`)}
        `;
    }
}

function injectColumns(footer, company = {}) {
    const columns = footer.querySelectorAll(".footer-column");

    if (columns[0]) {
        const title = columns[0].querySelector("h4");
        const links = columns[0].querySelectorAll("a");

        if (title) {
            title.textContent = company.name || "CAT Car Renting Service";
        }

        if (links[0]) {
            const email = company.email || "info@catrenting.com";
            links[0].textContent = email;
            links[0].href = `mailto:${email}`;
        }

        if (links[1]) {
            const phone = company.phone || "+34 000 000 000";
            links[1].textContent = phone;
            links[1].href = `tel:${phone.replace(/\s+/g, "")}`;
        }

        if (links[2]) {
            const whatsappNumber = String(company.whatsapp || "").replace(/\D/g, "");
            links[2].textContent = "WhatsApp";
            links[2].href = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#";
        }

        if (links[3]) {
            links[3].textContent = company.address || "Dirección no disponible";
            links[3].href = "#";
        }
    }

    if (columns[1]) {
        const title = columns[1].querySelector("h4");
        const links = columns[1].querySelectorAll("a");

        if (title) {
            title.textContent = "Información";
        }

        if (links[0]) {
            links[0].textContent = "Contacto";
            links[0].href = pageUrl("../Pages/contact.html");
        }

        if (links[1]) {
            links[1].textContent = "FAQ";
            links[1].href = pageUrl("../Pages/faq.html");
        }

        if (links[2]) {
            links[2].textContent = "Sobre nosotros";
            links[2].href = pageUrl("../Pages/information.html");
        }
    }
}

export async function injectFooterData() {
    const footer = document.querySelector("footer");

    if (!footer) {
        console.error("No existe ningún <footer> en el DOM");
        return;
    }

    try {
        const company = await getCompany();
        injectLogos(footer, company || {});
        injectColumns(footer, company || {});
    } catch (error) {
        console.error("Error al inyectar el footer:", error);
    }
}