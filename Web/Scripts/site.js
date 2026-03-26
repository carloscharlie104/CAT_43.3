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

function resolveIncludeAssetUrls(node, includePath) {
    const templateUrl = new URL(includePath, window.location.href);

    const elementsWithHref = node.querySelectorAll("[href]");
    elementsWithHref.forEach((element) => {
        const href = element.getAttribute("href");

        if (!href) return;
        if (
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("//") ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) {
            return;
        }

        element.setAttribute("href", new URL(href, templateUrl).href);
    });

    const elementsWithSrc = node.querySelectorAll("[src]");
    elementsWithSrc.forEach((element) => {
        const src = element.getAttribute("src");

        if (!src) return;
        if (
            src.startsWith("http://") ||
            src.startsWith("https://") ||
            src.startsWith("//") ||
            src.startsWith("data:")
        ) {
            return;
        }

        element.setAttribute("src", new URL(src, templateUrl).href);
    });
}

function loadIncludes() {
    const includeNodes = document.querySelectorAll("[data-include]");

    includeNodes.forEach((node) => {
        const path = node.dataset.include;

        if (!path) {
            return;
        }

        fetchPartial(path)
            .then((html) => {
                node.innerHTML = html;
                resolveIncludeAssetUrls(node, path);
                initializeFieldClearButtons(node);
            })
            .catch((error) =>
                console.error("Hubo un problema con la petición fetch:", error)
            );
    });
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
}

function initializeHomeMobileCarousel() {
    const heroCard = document.querySelector(".hero-card");
    const prevButton = document.querySelector(".main-card-arrow--left");
    const nextButton = document.querySelector(".main-card-arrow--right");

    if (!heroCard || !prevButton || !nextButton) {
        return;
    }

    const offers = [
        {
            linkText: "Lorem Ipsum"
        },
        {
            linkText: "Lorem Ipsum"
        },
        {
            linkText: "Lorem Ipsum"
        },
        {
            linkText: "Lorem Ipsum"
        }
    ];

    let currentIndex = 0;

    function renderOffer() {
        const currentOffer = offers[currentIndex];

        heroCard.innerHTML = `
            <div class="gallery-box">
                <div class="image-placeholder">
                    <svg class="icon-x" viewBox="0 0 100 100" aria-hidden="true">
                        <line x1="10" y1="10" x2="90" y2="90"></line>
                        <line x1="90" y1="10" x2="10" y2="90"></line>
                    </svg>
                </div>
                <a href="#" class="box-link">${currentOffer.linkText}</a>
            </div>
        `;
    }

    prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + offers.length) % offers.length;
        renderOffer();
    });

    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % offers.length;
        renderOffer();
    });

    renderOffer();
}

document.addEventListener("DOMContentLoaded", () => {
    loadIncludes();
    initializeFieldClearButtons();
    initializeReservationDateLimits();
    initializeHomeMobileCarousel();
});