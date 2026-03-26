import { getCompany, getLocations } from "./api.js";

function fillCardsTemplate(root, company, locations) {
    const wrappers = [...root.querySelectorAll(".card-wrapper")];
    const safeLocations = Array.isArray(locations) ? locations : [];
    const locationSummary = safeLocations
        .map((location) => location?.name)
        .filter(Boolean)
        .join(", ");

    const content = [
        {
            title: "Quiénes somos",
            text: company?.about || "",
            subtitle: company?.name || ""
        },
        {
            title: "Historia",
            text: company?.history || "",
            subtitle: company?.tagline || ""
        },
        {
            title: "Donde encontrarnos",
            text: company?.address || "",
            subtitle: locationSummary || ""
        }
    ];

    wrappers.forEach((wrapper, index) => {
        const info = content[index];
        if (!info) return;

        const title = wrapper.querySelector("h2");
        const text = wrapper.querySelector(".card-text");
        const subtitle = wrapper.querySelector(".card-subtitle");

        if (title) title.textContent = info.title;
        if (text) text.textContent = info.text;
        if (subtitle) subtitle.textContent = info.subtitle;
    });
}

function waitForCardsTemplate(container, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const existingTemplate = container.querySelector(".cards-section");
        if (existingTemplate) {
            resolve(existingTemplate);
            return;
        }

        const observer = new MutationObserver(() => {
            const template = container.querySelector(".cards-section");
            if (template) {
                observer.disconnect();
                resolve(template);
            }
        });

        observer.observe(container, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error("No apareció la plantilla .cards-section dentro de #cards-placeholder"));
        }, timeout);
    });
}

function updateBottomSection(company) {
    const quote = document.querySelector(".bottom-quote");
    const button = document.querySelector(".btn-pink");

    if (quote) {
        quote.textContent = company?.tagline
            ? `"${company.tagline}"`
            : '"Renting automotriz simple, dinámico y eficaz."';
    }

    if (button) {
        button.textContent = "Contactar con CAT";

        if (!button.dataset.boundClick) {
            button.dataset.boundClick = "true";
            button.addEventListener("click", () => {
                window.location.href = "./contact.html";
            });
        }
    }
}

export async function initInformationPage() {
    const cardsPlaceholder = document.getElementById("cards-placeholder");
    if (!cardsPlaceholder) return;

    try {
        const templateRoot = await waitForCardsTemplate(cardsPlaceholder);

        const [company, locations] = await Promise.all([
            getCompany(),
            getLocations().catch((error) => {
                console.warn("No se pudieron cargar locations:", error);
                return [];
            })
        ]);

        fillCardsTemplate(templateRoot, company, locations);
        updateBottomSection(company);

        console.log("Página de información renderizada correctamente");
        console.log("Company:", company);
        console.log("Locations:", locations);
    } catch (error) {
        console.error("Error al inicializar la página de información:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initInformationPage();
});