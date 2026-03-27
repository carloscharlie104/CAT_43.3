import { getUsers as getUsersFromApi, createUser, findUserByIdentity } from "./api.js";

const USERS_KEY = "cat43_users";
const SESSION_KEY = "cat43_session";

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

function getUsersFromLocalStorage() {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveUsersToLocalStorage(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function getUsers() {
    try {
        const users = await getUsersFromApi();

        if (Array.isArray(users)) {
            saveUsersToLocalStorage(users);
            return users;
        }

        return getUsersFromLocalStorage();
    } catch (error) {
        return getUsersFromLocalStorage();
    }
}

async function saveUser(user) {
    try {
        const createdUser = await createUser(user);
        const users = await getUsers();
        const exists = users.some((item) => String(item.id) === String(createdUser.id));

        if (!exists) {
            saveUsersToLocalStorage([...users, createdUser]);
        }

        return createdUser;
    } catch (error) {
        const users = getUsersFromLocalStorage();
        users.push(user);
        saveUsersToLocalStorage(users);
        return user;
    }
}

async function getUserByIdentity(identity) {
    try {
        const user = await findUserByIdentity(identity);

        if (user) {
            return user;
        }

        const users = getUsersFromLocalStorage();
        const identityNorm = normalize(identity);

        return users.find((item) => {
            return item.usernameNorm === identityNorm || item.emailNorm === identityNorm;
        }) || null;
    } catch (error) {
        const users = getUsersFromLocalStorage();
        const identityNorm = normalize(identity);

        return users.find((item) => {
            return item.usernameNorm === identityNorm || item.emailNorm === identityNorm;
        }) || null;
    }
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
    message.hidden = false;
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
        message.hidden = true;
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

function clearAllFieldErrors(form) {
    if (!form) {
        return;
    }

    form.querySelectorAll(".field").forEach(clearFieldError);
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

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearAllFieldErrors(form);
        clearFormMessage(form);

        const usernameValue = normalize(usernameInput.value);
        const passValue = passInput.value || "";

        let hasError = false;

        if (!usernameValue) {
            setFieldError(usernameInput.closest(".field"), "Introduce tu usuario o correo.");
            hasError = true;
        }

        if (!passValue) {
            setFieldError(passInput.closest(".field"), "Introduce tu contraseña.");
            hasError = true;
        }

        if (hasError) {
            setFormMessage(form, "Revisa los campos marcados.", "error");
            return;
        }

        try {
            const user = await getUserByIdentity(usernameValue);

            if (!user || user.password !== passValue) {
                setFormMessage(form, "Usuario o contraseña incorrectos.", "error");
                return;
            }

            setSession(user);
            setFormMessage(form, "Inicio de sesión correcto.", "success");

            window.setTimeout(() => {
                window.location.href = "../main.html";
            }, 600);
        } catch (error) {
            setFormMessage(form, "No se pudo iniciar sesión.", "error");
        }
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
        wireFieldClearOnInput(input.closest(".field"));
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearAllFieldErrors(form);
        clearFormMessage(form);

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
            setFieldError(emailInput.closest(".field"), "Introduce un correo válido.");
            hasError = true;
        }

        if (emailRepeat !== email) {
            setFieldError(emailRepeatInput.closest(".field"), "Los correos no coinciden.");
            hasError = true;
        }

        if (password.length < 6) {
            setFieldError(passInput.closest(".field"), "La contraseña debe tener al menos 6 caracteres.");
            hasError = true;
        }

        if (passwordRepeat !== password) {
            setFieldError(passRepeatInput.closest(".field"), "Las contraseñas no coinciden.");
            hasError = true;
        }

        const usernameNorm = normalize(username);
        const emailNorm = normalize(email);

        try {
            const users = await getUsers();

            if (users.some((item) => item.usernameNorm === usernameNorm)) {
                setFieldError(userInput.closest(".field"), "Ese usuario ya existe.");
                hasError = true;
            }

            if (users.some((item) => item.emailNorm === emailNorm)) {
                setFieldError(emailInput.closest(".field"), "Ese correo ya está registrado.");
                hasError = true;
            }

            if (hasError) {
                setFormMessage(form, "Revisa los campos marcados.", "error");
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                username,
                usernameNorm,
                email,
                emailNorm,
                password
            };

            await saveUser(newUser);

            setFormMessage(form, "Registro completado. Ya puedes iniciar sesión.", "success");

            window.setTimeout(() => {
                window.location.href = "./login.html";
            }, 900);
        } catch (error) {
            setFormMessage(form, "No se pudo completar el registro.", "error");
        }
    });
}

function initRecovery() {
    const form = document.querySelector(".auth-card__form");
    const emailInput = document.getElementById("recovery-email");
    const emailRepeatInput = document.getElementById("recovery-email-2");

    if (!form || !emailInput || !emailRepeatInput) {
        return;
    }

    [emailInput, emailRepeatInput].forEach((input) => {
        wireFieldClearOnInput(input.closest(".field"));
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearAllFieldErrors(form);
        clearFormMessage(form);

        const email = String(emailInput.value || "").trim();
        const emailRepeat = String(emailRepeatInput.value || "").trim();

        let hasError = false;

        if (!email || !emailInput.checkValidity()) {
            setFieldError(emailInput.closest(".field"), "Introduce un correo válido.");
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

        try {
            const users = await getUsers();
            const exists = users.some((item) => item.emailNorm === normalize(email));

            if (!exists) {
                setFormMessage(form, "No encontramos ese correo.", "error");
                return;
            }

            setFormMessage(form, "Si el correo existe, recibirás instrucciones.", "success");
        } catch (error) {
            setFormMessage(form, "No se pudo comprobar el correo.", "error");
        }
    });
}

function initAuthPage() {
    const page = document.body.dataset.authPage;

    if (!page) {
        return;
    }

    if (page === "login") {
        initLogin();
    }

    if (page === "register") {
        initRegister();
    }

    if (page === "recovery") {
        initRecovery();
    }
}

document.addEventListener("auth:ready", initAuthPage);