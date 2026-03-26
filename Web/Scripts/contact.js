import { getCompany, postData } from "./api.js";

function setMessage(container, text, type) {
    if (!container) {
        return;
    }

    container.textContent = text;
    container.className = "contact-message";
    container.style.color = type === "success" ? "#166534" : "#991b1b";
}

export async function initContactPage() {
    const form = document.getElementById("contactForm");

    if (!form) {
        return;
    }

    const title = document.querySelector(".contact-title");
    const description = document.querySelector(".contact-description");
    const labels = [...document.querySelectorAll(".form-label")];
    const button = document.querySelector(".btn-pink");
    let status = form.nextElementSibling;

    if (!status || !status.classList.contains("contact-message")) {
        status = document.createElement("p");
        status.className = "contact-message";
        status.setAttribute("aria-live", "polite");
        status.style.minHeight = "24px";
        status.style.fontSize = "1rem";
        status.style.fontWeight = "700";
        form.insertAdjacentElement("afterend", status);
    }

    try {
        const company = await getCompany();

        if (title) {
            title.textContent = "Contacto";
        }

        if (description) {
            description.textContent = `Escríbenos y te responderemos por email o teléfono. También puedes contactar directamente con ${company.name} en ${company.email} o ${company.phone}.`;
        }

        if (labels[0]) labels[0].textContent = "Nombre";
        if (labels[1]) labels[1].textContent = "Apellidos";
        if (labels[2]) labels[2].textContent = "Correo electrónico";
        if (labels[3]) labels[3].textContent = "Mensaje";
        if (button) button.textContent = "Enviar consulta";
    } catch (error) {
        console.error(error);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get("name") || "").trim();
        const surname = String(formData.get("surname") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const message = String(formData.get("message") || "").trim();

        try {
            await postData("contactMessages", {
                name,
                surname,
                email,
                message,
                createdAt: new Date().toISOString()
            });

            form.reset();
            setMessage(status, "Tu consulta se ha enviado correctamente.", "success");
        } catch (error) {
            console.error(error);
            setMessage(status, "No se pudo enviar la consulta. Inténtalo de nuevo.", "error");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initContactPage().catch((error) => console.error(error));
});
