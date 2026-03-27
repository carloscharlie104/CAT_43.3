import { getCarById, getCompany, getPaymentMethods } from "./api.js";

function getCarIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("carId");
}

function getSession() {
    try {
        return JSON.parse(localStorage.getItem("cat43_session") || "null");
    } catch (error) {
        return null;
    }
}

export async function initPaymentGatewayPage() {
    const card = document.querySelector(".card");

    if (!card) {
        return;
    }

    const title = document.querySelector(".contact-title");
    const labels = [...document.querySelectorAll(".form-label")];
    const inputs = [...document.querySelectorAll(".form-input")];
    const button = document.querySelector(".btn-pink");
    const form = document.querySelector("#payment-form");
    const carId = getCarIdFromUrl();
    const session = getSession();

    try {
        const [company, paymentMethods, car] = await Promise.all([
            getCompany(),
            getPaymentMethods(),
            carId ? getCarById(carId) : Promise.resolve(null)
        ]);

        const enabledMethods = paymentMethods
            .filter((method) => method.enabled)
            .map((method) => method.name)
            .join(", ");

        if (title) {
            title.textContent = car
                ? `Finaliza tu reserva de ${car.fullName}`
                : "Finaliza tu reserva";
        }

        if (labels[0]) labels[0].textContent = "Nombre";
        if (labels[1]) labels[1].textContent = "Domicilio";
        if (labels[2]) labels[2].textContent = "Correo electrónico";
        if (labels[3]) labels[3].textContent = "Teléfono";
        if (labels[4]) labels[4].textContent = "Método de pago / notas";

        if (inputs[0]) {
            inputs[0].placeholder = "Introduce nombre completo";
        }

        if (inputs[1]) {
            inputs[1].placeholder = "Introduce tu domicilio";
        }

        if (inputs[3]) {
            inputs[3].placeholder = company ? `Teléfono de contacto en ${company.phone}` : "Teléfono de contacto";
        }

        if (inputs[4]) {
            inputs[4].placeholder = enabledMethods
                ? `Métodos disponibles: ${enabledMethods}`
                : "Indica método de pago u observaciones";
        }

        if (button) {
            button.textContent = car
                ? `Continuar con ${car.priceText}`
                : "Continuar con la reserva";
        }
    } catch (error) {
        console.error(error);
    }

    if (form) {
        setupPaymentValidation(form, inputs);
    }
}

function getFormMessage(form) {
    let message = form.querySelector(".form-message");
    if (!message) {
        message = document.createElement("div");
        message.className = "form-message";
        form.prepend(message);
    }
    return message;
}

function clearFormMessage(form) {
    const message = form.querySelector(".form-message");
    if (message) {
        message.textContent = "";
    }
}

function clearFieldError(group) {
    if (!group) return;
    group.classList.remove("form-group--error");
    const error = group.querySelector(".form-error");
    if (error) {
        error.textContent = "";
    }
}

function setFieldError(group, message) {
    if (!group) return;
    group.classList.add("form-group--error");
    let error = group.querySelector(".form-error");
    if (!error) {
        error = document.createElement("div");
        error.className = "form-error";
        group.appendChild(error);
    }
    error.textContent = message;
}

function setupPaymentValidation(form, inputs) {
    const fieldGroups = [
        { input: inputs[0], message: "Introduce tu nombre completo." },
        { input: inputs[1], message: "Introduce tu domicilio." },
        { input: inputs[2], message: "Introduce un correo electrónico válido." },
        { input: inputs[3], message: "Introduce un teléfono válido de 9 dígitos." },
        { input: inputs[4], message: "Indica el método de pago o notas." }
    ];

    fieldGroups.forEach(({ input }) => {
        if (!input) return;
        const group = input.closest(".form-group1, .form-group2, .form-group3");
        input.addEventListener("input", () => clearFieldError(group));
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearFormMessage(form);

        let hasError = false;

        fieldGroups.forEach(({ input, message }) => {
            if (!input) return;
            const group = input.closest(".form-group1, .form-group2, .form-group3");

            if (!input.checkValidity()) {
                setFieldError(group, message);
                hasError = true;
            } else {
                clearFieldError(group);
            }
        });

        if (hasError) {
            const formMessage = getFormMessage(form);
            formMessage.textContent = "Revisa los campos marcados.";
            return;
        }

        form.submit();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initPaymentGatewayPage().catch((error) => console.error(error));
});
