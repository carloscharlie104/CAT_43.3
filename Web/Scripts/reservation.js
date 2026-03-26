import { getCars, getCategories, getLocations } from "./api.js";
import {
    createImageFallback,
    formatPrice,
    getCategoryById,
    getImageSource,
    getLocationsByIds
} from "./utils.js";

function createCarCard(car, categories, locations) {
    const category = getCategoryById(categories, car.categoryId);
    const carLocations = getLocationsByIds(locations, car.locationIds);
    const fallback = createImageFallback(car.fullName);
    const mainLocation = carLocations[0]?.name || "Ubicación pendiente";
    const imageSrc = getImageSource(car.image, car.fullName);

    return `
        <article class="grid-item">
            <h3 class="item-title">${car.fullName}</h3>

            <div class="reservation-card">
                <img
                    class="reservation-card-image"
                    src="${imageSrc || fallback}"
                    alt="${car.fullName}"
                >

                <div class="reservation-card-body">
                    <p class="reservation-card-category">
                        ${category ? category.label : "Sin categoría"}
                    </p>

                    <p class="reservation-card-price">
                        ${formatPrice(car.pricePerDay)}
                    </p>

                    <p class="reservation-card-location">
                        ${mainLocation}
                    </p>

                    <a class="reservation-card-link" href="./carData.html?id=${car.id}">
                        Ver detalle
                    </a>
                </div>
            </div>
        </article>
    `;
}

function getUniqueIslands(locations) {
    return [...new Set(locations.map(location => location.Island))];
}

function renderIslandOptions(locations) {
    const islandSelect = document.getElementById("islandSelect");
    if (!islandSelect) return;

    const islands = getUniqueIslands(locations);

    islandSelect.innerHTML = `
        <option value="">Selecciona una isla</option>
        ${islands.map(island => `<option value="${island}">${island}</option>`).join("")}
    `;
}

function renderLocationOptions(locations, selectedIsland) {
    const locationSelect = document.getElementById("locationSelect");
    if (!locationSelect) return;

    if (!selectedIsland) {
        locationSelect.innerHTML = `<option value="">Selecciona una localización</option>`;
        locationSelect.disabled = true;
        return;
    }

    const filteredLocations = locations.filter(location => location.Island === selectedIsland);

    locationSelect.innerHTML = `
        <option value="">Selecciona una localización</option>
        ${filteredLocations.map(location => `
            <option value="${location.id}">
                ${location.name}${location.isAirport ? " (Aeropuerto)" : ""}
            </option>
        `).join("")}
    `;

    locationSelect.disabled = false;
}

function filterCars(cars, selectedIsland, selectedLocationId, locations) {
    return cars.filter(car => {
        const carLocations = getLocationsByIds(locations, car.locationIds || []);

        const matchesIsland = selectedIsland
            ? carLocations.some(location => location.Island === selectedIsland)
            : true;

        const matchesLocation = selectedLocationId
            ? (car.locationIds || []).includes(selectedLocationId)
            : true;

        return matchesIsland && matchesLocation;
    });
}

function renderCars(cars, categories, locations) {
    const container = document.querySelector(".cards-grid");
    if (!container) return;

    if (!cars.length) {
        container.innerHTML = `<p class="reservation-empty">No hay coches disponibles</p>`;
        return;
    }

    container.innerHTML = cars
        .slice(0, 6)
        .map(car => createCarCard(car, categories, locations))
        .join("");
}

function setupInputs() {
    const fullInputs = document.querySelectorAll(".input-full");
    const halfInputs = document.querySelectorAll(".input-half");
    const todayIso = new Date().toISOString().split("T")[0];

    if (fullInputs[0]) {
        const islandSelect = document.createElement("select");
        islandSelect.className = "input-full";
        islandSelect.id = "islandSelect";
        islandSelect.disabled = false;
        fullInputs[0].replaceWith(islandSelect);
    }

    if (fullInputs[1]) {
        const locationSelect = document.createElement("select");
        locationSelect.className = "input-full";
        locationSelect.id = "locationSelect";
        locationSelect.disabled = true;
        fullInputs[1].replaceWith(locationSelect);
    }

    if (halfInputs[0]) {
        halfInputs[0].type = "date";
        halfInputs[0].disabled = false;
        halfInputs[0].min = todayIso;
    }

    if (halfInputs[1]) {
        halfInputs[1].type = "date";
        halfInputs[1].disabled = false;
        halfInputs[1].min = todayIso;
    }
}

function setupTexts() {
    const title = document.querySelector(".form-main-title");
    const fullLabels = document.querySelectorAll(".input-group label");
    const halfLabels = document.querySelectorAll(".input-group-half label");
    const button = document.querySelector(".btn-pink");

    if (title) title.textContent = "Reserva tu vehículo";
    if (fullLabels[0]) fullLabels[0].childNodes[0].textContent = "Recogida ";
    if (fullLabels[1]) fullLabels[1].childNodes[0].textContent = "Lugar de recogida ";
    if (halfLabels[0]) halfLabels[0].childNodes[0].textContent = "Fecha inicio ";
    if (halfLabels[1]) halfLabels[1].childNodes[0].textContent = "Fecha fin ";
    if (button) button.textContent = "Explorar coches";
}

export async function initReservationPage() {
    const container = document.querySelector(".cards-grid");
    if (!container) return;

    try {
        const [cars, categories, locations] = await Promise.all([
            getCars(),
            getCategories(),
            getLocations()
        ]);

        setupInputs();
        setupTexts();

        const islandSelect = document.getElementById("islandSelect");
        const locationSelect = document.getElementById("locationSelect");
        const button = document.querySelector(".btn-pink");

        renderIslandOptions(locations);
        renderLocationOptions(locations, "");
        renderCars(cars, categories, locations);

        if (islandSelect) {
            islandSelect.addEventListener("change", () => {
                renderLocationOptions(locations, islandSelect.value);
            });
        }

        if (button) {
            button.addEventListener("click", (event) => {
                event.preventDefault();

                const selectedIsland = islandSelect ? islandSelect.value : "";
                const selectedLocationId = locationSelect ? locationSelect.value : "";

                const filteredCars = filterCars(
                    cars,
                    selectedIsland,
                    selectedLocationId,
                    locations
                );

                renderCars(filteredCars, categories, locations);
            });
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Error al cargar datos</p>";
    }
}

document.addEventListener("DOMContentLoaded", initReservationPage);
