import { getFaqs } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const faqContainer = document.querySelector(".accordion");

    if (!faqContainer) {
        return;
    }

    try {
        faqContainer.innerHTML = "<p>Cargando preguntas frecuentes...</p>";
        const faqs = await getFaqs();
        renderFaqs(faqs, faqContainer);
    } catch (error) {
        console.error(error);
        faqContainer.innerHTML = "<p>No se pudieron cargar las preguntas frecuentes.</p>";
    }
});

function renderFaqs(faqs, container) {
    if (!faqs.length) {
        container.innerHTML = "<p>No hay preguntas frecuentes disponibles.</p>";
        return;
    }

    container.innerHTML = faqs.map((faq, index) => `
        <details class="acc-item" ${index === 0 ? "open" : ""}>
            <summary class="acc-summary">
                <span class="acc-title">${faq.question}</span>
                <span class="acc-icon" aria-hidden="true"></span>
            </summary>
            <div class="acc-panel">
                <div class="acc-content">${faq.answer}</div>
            </div>
        </details>
    `).join("");
}
