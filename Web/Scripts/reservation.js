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

    return `
        <div class="gallery-box">
            <div class="image-placeholder">
                <img
                    src="${getImageSource(car.image, car.fullName)}"
                    alt="${car.fullName}"
                    style="width: 100%; height: 100%; object-fit: cover;"
                    onerror="this.onerror=null;this.src='${fallback}';"
                >
            </div>
            <p><strong>${car.fullName}</strong></p>
            <p>${category ? category.label : "Sin categoría"}</p>
            <p><strong>${formatPrice(car.pricePerDay)}</strong></p>
            <p>${mainLocation}</p>
            <a href="./carData.html?id=${car.id}" class="box-link">Ver detalle</a>
        </div>
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
        container.innerHTML = "<p>No hay coches disponibles</p>";
        return;
    }

    container.innerHTML = cars.slice(0, 6).map(car => `
        <div class="grid-item">
            <h3 class="item-title">${car.fullName}</h3>
            <div class="card-placeholder">
                ${createCarCard(car, categories, locations)}
            </div>
        </div>
    `).join("");
}

function setupInputs() {
    const fullInput = document.querySelector(".input-full");
    const halfInputs = document.querySelectorAll(".input-half");

    if (fullInput) {
        const islandSelect = document.createElement("select");
        islandSelect.className = "input-full";
        islandSelect.id = "islandSelect";
        fullInput.replaceWith(islandSelect);
    }

    if (halfInputs[0]) {
        const locationSelect = document.createElement("select");
        locationSelect.className = "input-half";
        locationSelect.id = "locationSelect";
        locationSelect.disabled = true;
        halfInputs[0].replaceWith(locationSelect);
    }

    if (halfInputs[1]) {
        halfInputs[1].type = "date";
    }
}

function setupTexts() {
    const title = document.querySelector(".form-main-title");
    const labels = document.querySelectorAll(".input-group-half label");
    const button = document.querySelector(".btn-pink");

    if (title) title.textContent = "Reserva tu vehículo";
    if (labels[0]) labels[0].childNodes[0].textContent = "Recogida ";
    if (labels[1]) labels[1].childNodes[0].textContent = "Devolución ";
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