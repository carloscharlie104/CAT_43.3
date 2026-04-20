import { getAuth } from "./api.js";

async function fetchTemplate() {
    const response = await fetch("../../Template/auth-card.html");

    if (!response.ok) {
        throw new Error(`Error cargando auth-card.html: ${response.status}`);
    }

    return response.text();
}

function setText(element, value) {
    if (!element) return;
    element.textContent = value || "";
}

function normalizeStaticAuthHref(href) {
    if (!href) {
        return "#";
    }

    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#")) {
        return href;
    }

    if (href.includes("register")) {
        return "./register.html";
    }

    if (href.includes("passRecovery") || href.includes("recovery")) {
        return "./passRecovery.html";
    }

    if (href.includes("login")) {
        return "./login.html";
    }

    return href;
}

function setLink(element, config) {
    if (!element || !config) return;

    element.textContent = config.text || "";
    element.href = normalizeStaticAuthHref(config.href);
    element.hidden = false;
}

function configureField(fieldElement, config) {
    if (!fieldElement || !config) return;

    const label = fieldElement.querySelector(".field__label");
    const input = fieldElement.querySelector(".field__input");
    const clearButton = fieldElement.querySelector(".field__clear");

    if (label) {
        label.textContent = config.label || "";
    }

    if (input) {
        input.type = config.type || "text";
        input.id = config.id || "";
        input.name = config.name || "";
        input.placeholder = config.placeholder || "";
        input.autocomplete = config.autocomplete || "off";

        if (config.required) {
            input.required = true;
        }

        if (config.minLength) {
            input.minLength = config.minLength;
        }

        if (config.maxLength) {
            input.maxLength = config.maxLength;
        }
    }

    if (label && input && config.id) {
        label.setAttribute("for", config.id);
    }

    if (clearButton) {
        clearButton.setAttribute("aria-label", config.clearLabel || "Borrar campo");
    }

    fieldElement.hidden = false;
}

function showFields(root, fieldsConfig = []) {
    fieldsConfig.forEach((fieldConfig) => {
        const fieldElement = root.querySelector(`[data-auth-field="${fieldConfig.key}"]`);
        configureField(fieldElement, fieldConfig);
    });
}

async function buildAuthView() {
    const page = document.body.dataset.authPage;
    if (!page) return;

    const root = document.getElementById("auth-root");
    if (!root) return;

    const templateHtml = await fetchTemplate();
    root.innerHTML = templateHtml;

    const auth = await getAuth();
    const config = auth?.[page];

    if (!config) {
        console.error(`No existe configuración auth para la página: ${page}`);
        return;
    }

    const title = root.querySelector("[data-auth-title]");
    const description = root.querySelector("[data-auth-description]");
    const form = root.querySelector("[data-auth-form]");
    const submit = root.querySelector("[data-auth-submit]");
    const checkWrapper = root.querySelector("[data-auth-check-wrapper]");
    const checkText = root.querySelector("[data-auth-check]");
    const linksRow = root.querySelector("[data-auth-links-row]");
    const linkPrimary = root.querySelector("[data-auth-link-primary]");
    const linkSecondary = root.querySelector("[data-auth-link-secondary]");
    const backLink = root.querySelector("[data-auth-back]");

    setText(title, config.title);

    if (config.description) {
        setText(description, config.description);
        description.hidden = false;
    }

    if (form && config.formId) {
        form.id = config.formId;
    }

    showFields(root, config.fields || []);

    if (config.checkText) {
        setText(checkText, config.checkText);
        checkWrapper.hidden = false;
    }

    setText(submit, config.submitText);

    if (config.links?.primary || config.links?.secondary) {
        linksRow.hidden = false;
    }

    if (config.links?.primary) {
        setLink(linkPrimary, config.links.primary);
    }

    if (config.links?.secondary) {
        setLink(linkSecondary, config.links.secondary);
    }

    if (config.backLink) {
        setLink(backLink, config.backLink);
    }

    document.dispatchEvent(new Event("site:ready"));
    document.dispatchEvent(new Event("auth:ready"));
}

document.addEventListener("DOMContentLoaded", () => {
    buildAuthView().catch((error) => {
        console.error("Error montando authContent:", error);
    });
});
