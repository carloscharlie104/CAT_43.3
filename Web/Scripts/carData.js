const BASE_URL = "http://localhost:3000";

function getCarIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function getVehicleById(id) {
    try {
        const response = await fetch(`${BASE_URL}/cars/${id}`);

        if (!response.ok) {
            throw new Error(`No se pudo cargar el vehículo con id ${id}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener el vehículo:", error);
        return null;
    }
}

async function getCategories() {
    try {
        const response = await fetch(`${BASE_URL}/categories`);

        if (!response.ok) {
            throw new Error("No se pudieron cargar las categorías");
        }

        return await response.json();
    } catch (error) {
        console.error("Error cargando categorías:", error);
        return null;
    }
}

function renderCarData(car, category) {
    const title = document.querySelector(".carData-title");
    const mediaBox = document.querySelector(".media-box");
    const rightColumn = document.querySelector(".carData-right");
    const cta = document.querySelector("#carData-cta");

    if (!title || !mediaBox || !rightColumn || !cta) {
        console.error("Faltan elementos del DOM en carData.html");
        return;
    }

    title.textContent = `${car.brand} ${car.model}`;

    mediaBox.innerHTML = `
        <img 
            src="${car.image}" 
            alt="${car.brand} ${car.model}" 
            class="carData-image"
        >
    `;

    rightColumn.innerHTML = `
        <p class="detail-item"><strong>Marca</strong><span>${car.brand}</span></p>
        <p class="detail-item"><strong>Modelo</strong><span>${car.model}</span></p>
        <p class="detail-item"><strong>Categoría</strong> <span>${category ? category.name : "No especificada"}<strong></p>
        <p class="detail-item"><strong>Transmisión</strong> <span>${car.transmission ?? "No especificada"}<strong></p>
        <p class="detail-item"><strong>Tipo de Combustible</strong> <span>${car.fuel ?? "No especificado"}<strong></p>
        <p class="detail-item"><strong>Equipaje</strong><span>${car.luggage}</span></p>
        <p class="detail-item"><strong>Aire acondicionado</strong><span>${car.airConditioning ? "Sí" : "No"}</span></p>

        <p class="info-line"><span>Precio por día:</span> ${car.pricePerDay ?? "-"} €</p>
        <p class="info-line"><spsn>Descripción:</spsn> ${car.description ?? "Sin descripción disponible"}</p>
    `;

    cta.textContent = "Reservar vehículo";
    cta.href = `../Pages/reservation.html?id=${car.id}`;
}

function renderError(message) {
    const container = document.querySelector("#carData-container");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <section class="carData-error">
            <h1>No se pudo cargar el vehículo</h1>
            <p>${message}</p>
        </section>
    `;
}

async function loadCarData() {
    const carId = getCarIdFromUrl();

    if (!carId) {
        renderError("La URL no incluye ningún id de vehículo.");
        return;
    }

    const [car, categories] = await Promise.all([
        getVehicleById(carId),
        getCategories()
    ]);

    if (!car || !categories) {
        renderError("Error cargando datos del vehículo.");
        return;
    }

    const category = categories.find(c => c.id == car.categoryId);

    renderCarData(car, category);
}

document.addEventListener("DOMContentLoaded", loadCarData);