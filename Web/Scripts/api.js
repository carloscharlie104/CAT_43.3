const DEFAULT_API_URL = "http://localhost:3000";

function normalizeUrl(url) {
    return String(url || "").trim().replace(/\/+$/, "");
}

function getCandidateApiUrls() {
    const urls = [];
    const configuredUrl = normalizeUrl(window.CAT_API_URL);

    if (configuredUrl) {
        urls.push(configuredUrl);
    } else {
        urls.push(DEFAULT_API_URL);
    }

    return [...new Set(urls.filter(Boolean))];
}

async function request(endpoint, options = {}) {
    const cleanEndpoint = String(endpoint || "").replace(/^\/+/, "");
    const urls = getCandidateApiUrls();
    let lastError = null;

    for (const baseUrl of urls) {
        try {
            const response = await fetch(`${baseUrl}/${cleanEndpoint}`, options);

            if (!response.ok) {
                throw new Error(`Respuesta ${response.status} desde ${baseUrl}`);
            }

            const contentType = response.headers.get("content-type") || "";
            return contentType.includes("application/json")
                ? await response.json()
                : await response.text();
        } catch (error) {
            lastError = error;
        }
    }

    throw new Error(`Error al cargar ${cleanEndpoint}${lastError ? `: ${lastError.message}` : ""}`);
}

export async function getData(endpoint) {
    return request(endpoint);
}

export async function postData(endpoint, data) {
    return request(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export async function getUsers() {
    const users = await getData("users");
    return Array.isArray(users) ? users : [];
}

export async function createUser(user) {
    return postData("users", user);
}

export async function findUserByIdentity(identity) {
    const normalizedIdentity = String(identity || "").trim().toLowerCase();

    if (!normalizedIdentity) {
        return null;
    }

    const users = await getUsers();

    return users.find((user) => {
        return (
            String(user.usernameNorm || "").toLowerCase() === normalizedIdentity ||
            String(user.emailNorm || "").toLowerCase() === normalizedIdentity
        );
    }) || null;
}

export async function userExistsByUsername(username) {
    const normalizedUsername = String(username || "").trim().toLowerCase();

    if (!normalizedUsername) {
        return false;
    }

    const users = await getUsers();
    return users.some((user) => String(user.usernameNorm || "").toLowerCase() === normalizedUsername);
}

export async function userExistsByEmail(email) {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
        return false;
    }

    const users = await getUsers();
    return users.some((user) => String(user.emailNorm || "").toLowerCase() === normalizedEmail);
}

export const getCompany = () => getData("company");
export const getLocations = () => getData("locations");
export const getCategories = () => getData("categories");
export const getOffers = () => getData("offers");
export const getExtras = () => getData("extras");
export const getCars = () => getData("cars");
export const getReviews = () => getData("reviews");
export const getFaqs = () => getData("faqs");
export const getPaymentMethods = () => getData("paymentMethods");
export const getCarById = (id) => getData(`cars/${id}`);
export const getAuth = () => getData("auth");