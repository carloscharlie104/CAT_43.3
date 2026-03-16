const USERS_KEY = "cat43_users";
const SESSION_KEY = "cat43_session";

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

function getUsers() {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user) {
    const payload = {
        username: user.username,
        email: user.email,
        loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

function clearFieldError(field) {
    if (!field) {
        return;
    }

    field.classList.remove("field--error");
    const error = field.querySelector(".field__error");
    if (error) {
        error.textContent = "";
    }
}

function setFieldError(field, message) {
    if (!field) {
        return;
    }

    field.classList.add("field--error");
    let error = field.querySelector(".field__error");
    if (!error) {
        error = document.createElement("div");
        error.className = "field__error";
        field.appendChild(error);
    }
    error.textContent = message;
}

function getFormMessage(form) {
    if (!form) {
        return null;
    }

    let message = form.querySelector(".form-message");
    if (!message) {
        message = document.createElement("div");
        message.className = "form-message";
        form.prepend(message);
    }
    return message;
}

function setFormMessage(form, text, type) {
    const message = getFormMessage(form);
    if (!message) {
        return;
    }

    message.textContent = text;
    message.classList.remove("form-message--error", "form-message--success");
    if (type === "error") {
        message.classList.add("form-message--error");
    }
    if (type === "success") {
        message.classList.add("form-message--success");
    }
}

function clearFormMessage(form) {
    const message = form ? form.querySelector(".form-message") : null;
    if (message) {
        message.textContent = "";
        message.classList.remove("form-message--error", "form-message--success");
    }
}

function wireFieldClearOnInput(field) {
    const input = field ? field.querySelector(".field__input") : null;
    if (!input) {
        return;
    }

    input.addEventListener("input", () => {
        clearFieldError(field);
    });
}

function initLogin() {
    const form = document.querySelector(".auth-card__form");
    const usernameInput = document.getElementById("login-user");
    const passInput = document.getElementById("login-pass");

    if (!form || !usernameInput || !passInput) {
        return;
    }

    wireFieldClearOnInput(usernameInput.closest(".field"));
    wireFieldClearOnInput(passInput.closest(".field"));

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearFormMessage(form);

        const users = getUsers();
        const usernameValue = normalize(usernameInput.value);
        const passValue = passInput.value || "";

        let hasError = false;

        if (!usernameValue) {
            setFieldError(usernameInput.closest(".field"), "Introduce tu usuario o correo.");
            hasError = true;
        }

        if (!passValue) {
            setFieldError(passInput.closest(".field"), "Introduce tu contrasena.");
            hasError = true;
        }

        if (hasError) {
            setFormMessage(form, "Revisa los campos marcados.", "error");
            return;
        }

        const user = users.find((item) => {
            return item.usernameNorm === usernameValue || item.emailNorm === usernameValue;
        });

        if (!user || user.password !== passValue) {
            setFormMessage(form, "Usuario o contrasena incorrectos.", "error");
            return;
        }

        setSession(user);
        window.location.href = "../main.html";
    });
}

function initRegister() {
    const form = document.querySelector(".auth-card__form");
    const userInput = document.getElementById("reg-user");
    const emailInput = document.getElementById("reg-email");
    const emailRepeatInput = document.getElementById("reg-email-2");
    const passInput = document.getElementById("reg-pass");
    const passRepeatInput = document.getElementById("reg-pass-2");

    if (!form || !userInput || !emailInput || !emailRepeatInput || !passInput || !passRepeatInput) {
        return;
    }

    [userInput, emailInput, emailRepeatInput, passInput, passRepeatInput].forEach((input) => {
        const field = input.closest(".field");
        wireFieldClearOnInput(field);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearFormMessage(form);

        const users = getUsers();

        const username = String(userInput.value || "").trim();
        const email = String(emailInput.value || "").trim();
        const emailRepeat = String(emailRepeatInput.value || "").trim();
        const password = passInput.value || "";
        const passwordRepeat = passRepeatInput.value || "";

        let hasError = false;

        if (username.length < 3) {
            setFieldError(userInput.closest(".field"), "El usuario debe tener al menos 3 caracteres.");
            hasError = true;
        }

        if (!email || !emailInput.checkValidity()) {
            setFieldError(emailInput.closest(".field"), "Introduce un correo valido.");
            hasError = true;
        }

        if (emailRepeat !== email) {
            setFieldError(emailRepeatInput.closest(".field"), "Los correos no coinciden.");
            hasError = true;
        }

        if (password.length < 6) {
            setFieldError(passInput.closest(".field"), "La contrasena debe tener al menos 6 caracteres.");
            hasError = true;
        }

        if (passwordRepeat !== password) {
            setFieldError(passRepeatInput.closest(".field"), "Las contrasenas no coinciden.");
            hasError = true;
        }

        const usernameNorm = normalize(username);
        const emailNorm = normalize(email);

        if (users.some((item) => item.usernameNorm === usernameNorm)) {
            setFieldError(userInput.closest(".field"), "Ese usuario ya existe.");
            hasError = true;
        }

        if (users.some((item) => item.emailNorm === emailNorm)) {
            setFieldError(emailInput.closest(".field"), "Ese correo ya esta registrado.");
            hasError = true;
        }

        if (hasError) {
            setFormMessage(form, "Revisa los campos marcados.", "error");
            return;
        }

        users.push({
            id: Date.now(),
            username,
            usernameNorm,
            email,
            emailNorm,
            password
        });

        saveUsers(users);
        setFormMessage(form, "Registro completado. Ya puedes iniciar sesion.", "success");
        window.setTimeout(() => {
            window.location.href = "./login.html";
        }, 800);
    });
}

function initRecovery() {
    const form = document.querySelector(".auth-card__form");
    const emailInput = document.getElementById("recover-email");
    const emailRepeatInput = document.getElementById("recover-email-2");

    if (!form || !emailInput || !emailRepeatInput) {
        return;
    }

    [emailInput, emailRepeatInput].forEach((input) => {
        const field = input.closest(".field");
        wireFieldClearOnInput(field);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearFormMessage(form);

        const email = String(emailInput.value || "").trim();
        const emailRepeat = String(emailRepeatInput.value || "").trim();
        let hasError = false;

        if (!email || !emailInput.checkValidity()) {
            setFieldError(emailInput.closest(".field"), "Introduce un correo valido.");
            hasError = true;
        }

        if (emailRepeat !== email) {
            setFieldError(emailRepeatInput.closest(".field"), "Los correos no coinciden.");
            hasError = true;
        }

        if (hasError) {
            setFormMessage(form, "Revisa los campos marcados.", "error");
            return;
        }

        const users = getUsers();
        const exists = users.some((item) => item.emailNorm === normalize(email));

        if (!exists) {
            setFormMessage(form, "No encontramos ese correo.", "error");
            return;
        }

        setFormMessage(form, "Si el correo existe, recibiras instrucciones.", "success");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initLogin();
    initRegister();
    initRecovery();
});
