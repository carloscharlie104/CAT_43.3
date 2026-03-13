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
                initializeFieldClearButtons(node);
            })
            .catch((error) => console.error("Hubo un problema con la petición fetch:", error));
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
            clearButton.classList.toggle("is-visible", input.value.trim().length > 0);
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

document.addEventListener("DOMContentLoaded", () => {
    loadIncludes();
    initializeFieldClearButtons();
});
