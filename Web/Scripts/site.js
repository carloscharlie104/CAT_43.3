import { injectHeaderData } from "./header.js";
import { injectFooterData } from "./footer.js";

function fetchPartial(path) {
    if (!fetchPartial.cache[path]) {
        fetchPartial.cache[path] = fetch(path).then((response) => {
            if (!response.ok) {
                throw new Error(`Error cargando ${path}`);
            }
            return response.text();
        });
    }

    return fetchPartial.cache[path];
}

fetchPartial.cache = {};

function isExternalPath(value) {
    if (!value) return true;

    return (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("//") ||
        value.startsWith("#") ||
        value.startsWith("mailto:") ||
        value.startsWith("tel:") ||
        value.startsWith("data:")
    );
}

function resolveIncludeAssetUrls(node, includePath) {
    const templateUrl = new URL(includePath, window.location.href);

    const elementsWithHref = node.querySelectorAll("[href]");
    elementsWithHref.forEach((element) => {
        const href = element.getAttribute("href");

        if (isExternalPath(href)) return;

        element.setAttribute("href", new URL(href, templateUrl).href);
    });

    const elementsWithSrc = node.querySelectorAll("[src]");
    elementsWithSrc.forEach((element) => {
        const src = element.getAttribute("src");

        if (isExternalPath(src)) return;

        element.setAttribute("src", new URL(src, templateUrl).href);
    });
}

async function loadIncludes() {
    const includeNodes = document.querySelectorAll("[data-include]");

    const tasks = Array.from(includeNodes).map(async (node) => {
        const path = node.dataset.include;

        if (!path) return;

        try {
            const html = await fetchPartial(path);
            node.innerHTML = html;
            resolveIncludeAssetUrls(node, path);
        } catch (error) {
            console.error(`Hubo un problema cargando el include ${path}:`, error);
        }
    });

    await Promise.all(tasks);
}

function initializeFieldClearButtons(root = document) {
    const fields = root.querySelectorAll(".field");

    fields.forEach((field) => {
        if (field.dataset.clearInitialized === "true") {
            return;
        }

        const input = field.querySelector(".field__input");
        const clearButton = field.querySelector(".field__clear");

        if (!input || !clearButton) {
            return;
        }

        const toggleClear = () => {
            clearButton.classList.toggle(
                "is-visible",
                input.value.trim().length > 0
            );
        };

        toggleClear();

        input.addEventListener("input", toggleClear);
        input.addEventListener("blur", toggleClear);
        input.addEventListener("focus", toggleClear);

        clearButton.addEventListener("click", () => {
            input.value = "";
            toggleClear();
            input.focus();
        });

        field.dataset.clearInitialized = "true";
    });
}

function initializeReservationDateLimits() {
    const startDate = document.querySelector("#reservation-start-date");
    const endDate = document.querySelector("#reservation-end-date");

    if (!startDate || !endDate) {
        return;
    }

    const today = new Date();
    const todayIso = today.toISOString().split("T")[0];

    startDate.min = todayIso;
    endDate.min = todayIso;

    startDate.addEventListener("change", () => {
        if (startDate.value) {
            endDate.min = startDate.value;

            if (endDate.value && endDate.value < startDate.value) {
                endDate.value = "";
            }
        } else {
            endDate.min = todayIso;
        }
    });
}

async function initializeGlobalComponents() {
    await loadIncludes();

    if (document.querySelector("header")) {
        await injectHeaderData();
    }

    if (document.querySelector("footer")) {
        await injectFooterData();
    }

    initializeFieldClearButtons();
    initializeReservationDateLimits();

    document.dispatchEvent(new CustomEvent("site:ready"));
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await initializeGlobalComponents();
    } catch (error) {
        console.error("Error inicializando los componentes globales:", error);
    }
});