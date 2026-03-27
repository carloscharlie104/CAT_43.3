import { getCompany, getLocations } from "./api.js";

function createCardImage(src, alt) {
    return `
        <img class="card-image" src="${src}" alt="${alt}">
    `;
}

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
            subtitle: "",
            image: "",
            imageAlt: ""
        },
        {
            title: "Historia",
            text: company?.history || "",
            subtitle: "",
            image: company?.historyImage || "",
            imageAlt: "Historia de CAT Car Renting Service"
        },
        {
            title: "Donde encontrarnos",
            text: company?.address || "",
            subtitle: locationSummary || "",
            image: company?.locationImage || "",
            imageAlt: "Ubicación de CAT Car Renting Service"
        }
    ];

    wrappers.forEach((wrapper, index) => {
        const info = content[index];
        if (!info) return;

        const title = wrapper.querySelector("h2");
        const text = wrapper.querySelector(".card-text");
        const subtitle = wrapper.querySelector(".card-subtitle");
        const cardIcon = wrapper.querySelector(".card-icon");

        if (title) title.textContent = info.title;
        if (text) text.textContent = info.text;

        const oldImage = wrapper.querySelector(".card-image");
        if (oldImage) {
            oldImage.remove();
        }

        if (cardIcon) {
            cardIcon.remove();
        }

        if (subtitle) {
            if (info.subtitle) {
                subtitle.textContent = info.subtitle;
                subtitle.style.display = "";
            } else {
                subtitle.textContent = "";
                subtitle.style.display = "none";
            }
        }

        if (info.image) {
            const subtitleNode = wrapper.querySelector(".card-subtitle");

            if (subtitleNode) {
                subtitleNode.insertAdjacentHTML(
                    "beforebegin",
                    createCardImage(info.image, info.imageAlt)
                );
            } else {
                const card = wrapper.querySelector(".card");
                if (card) {
                    card.insertAdjacentHTML(
                        "beforeend",
                        createCardImage(info.image, info.imageAlt)
                    );
                }
            }
        }
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
    } catch (error) {
        console.error("Error al inicializar la página de información:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initInformationPage();
});