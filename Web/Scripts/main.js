import { getCars } from "./api.js";
import { createImageFallback, getImageSource } from "./utils.js";

function buildGalleryCard({ image, title, linkText, href, subtitle, priceText, showTitle = true }) {
    const safeTitle = title || "Contenido";
    const safeSubtitle = subtitle || "";
    const safePriceText = priceText || "";
    const fallback = createImageFallback(safeTitle);

    return `
        <div class="gallery-box">
            <div class="image-placeholder">
                <img
                    src="${getImageSource(image, safeTitle)}"
                    alt="${safeTitle}"
                    style="width: 100%; height: 100%; object-fit: cover;"
                    onerror="this.onerror=null;this.src='${fallback}';"
                >
            </div>

            ${showTitle ? `<p style="margin: 0 0 8px; font-size: 0.95rem; font-weight: 600;">${safeTitle}</p>` : ""}

            <p style="margin: 0 0 8px; font-size: 0.95rem;">${safeSubtitle}</p>
            <p style="margin: 0 0 12px; font-size: 0.95rem; font-weight: 600;">${safePriceText}</p>

            <a href="${href}" class="box-link">Ver vehículo</a>
        </div>
    `;
}

function buildCarCard(car, showTitle = true) {
    const title = car.fullName || `${car.brand || ""} ${car.model || ""}`.trim() || "Vehículo";
    const subtitle = car.shortDescription || "";
    const priceText = car.priceText || "";

    return buildGalleryCard({
        image: car.image,
        title,
        subtitle,
        priceText,
        href: `./carData.html?id=${car.id}`,
        linkText: "Ver vehículo",
        showTitle
    });
}

function getFeaturedCars(cars, limit = 3) {
    const featuredCars = cars.filter((car) => car.featured);
    const remainingCars = cars.filter((car) => !car.featured);

    return [...featuredCars, ...remainingCars].slice(0, limit);
}

function initializeSynchronizedCarousel(cars) {
    const prevButton = document.querySelector(".main-card-arrow--left");
    const nextButton = document.querySelector(".main-card-arrow--right");

    const placeholders = [...document.querySelectorAll(".card-placeholder")];
    const secondaryTitles = [...document.querySelectorAll(".col-title")];

    if (!prevButton || !nextButton || placeholders.length < 3 || !Array.isArray(cars) || cars.length === 0) {
        return;
    }

    // 🔥 eliminamos los títulos superiores
    secondaryTitles.forEach(title => title.remove());

    let startIndex = 0;

    function getCircularIndex(baseIndex, offset) {
        return (baseIndex + offset) % cars.length;
    }

    function render() {
        const visibleCars = [
            cars[getCircularIndex(startIndex, 0)],
            cars[getCircularIndex(startIndex, 1)],
            cars[getCircularIndex(startIndex, 2)]
        ];

        const [leftCar, centerCar, rightCar] = visibleCars;
        const [leftCard, centerCard, rightCard] = placeholders;

        if (leftCard && leftCar) {
            leftCard.innerHTML = buildCarCard(leftCar, true);
        }

        if (centerCard && centerCar) {
            centerCard.innerHTML = buildCarCard(centerCar, true);
        }

        if (rightCard && rightCar) {
            rightCard.innerHTML = buildCarCard(rightCar, true);
        }
    }

    prevButton.replaceWith(prevButton.cloneNode(true));
    nextButton.replaceWith(nextButton.cloneNode(true));

    const freshPrevButton = document.querySelector(".main-card-arrow--left");
    const freshNextButton = document.querySelector(".main-card-arrow--right");

    freshPrevButton.addEventListener("click", () => {
        startIndex = (startIndex - 1 + cars.length) % cars.length;
        render();
    });

    freshNextButton.addEventListener("click", () => {
        startIndex = (startIndex + 1) % cars.length;
        render();
    });

    if (cars.length <= 1) {
        freshPrevButton.hidden = true;
        freshNextButton.hidden = true;
    } else {
        freshPrevButton.hidden = false;
        freshNextButton.hidden = false;
    }

    render();
}

export async function initMainPage() {
    const gallerySection = document.querySelector(".gallery-section");

    if (!gallerySection) {
        return;
    }

    try {
        const cars = await getCars();

        const mainTitle = document.querySelector(".main-title");
        const featuredCars = getFeaturedCars(cars, 3);

        if (mainTitle) {
            mainTitle.textContent = "Best Sellers";
        }

        initializeSynchronizedCarousel(featuredCars);
    } catch (error) {
        console.error(error);

        const mainTitle = document.querySelector(".main-title");
        if (mainTitle) {
            mainTitle.textContent = "No se pudo cargar la portada";
        }
    }
}

document.addEventListener("site:ready", () => {
    initMainPage().catch((error) => console.error(error));
});