import { getCompany, getOffers, getCars } from "./api.js";
import { createImageFallback, getImageSource } from "./utils.js";

function buildGalleryCard({ image, title, linkText, href, subtitle }) {
    const safeTitle = title || "Contenido";
    const safeSubtitle = subtitle || "";
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
            <p style="margin: 0 0 12px; font-size: 0.95rem;">${safeSubtitle}</p>
            <a href="${href}" class="box-link">${linkText}</a>
        </div>
    `;
}

function buildHeroSlides(company, cars) {
    return cars.map((car) => ({
        id: car.id,
        html: buildGalleryCard({
            image: car.image,
            title: car.fullName || `${car.brand} ${car.model}` || "Vehículo",
            subtitle: `${company.tagline} ${car.priceText}`.trim(),
            href: `./carData.html?id=${car.id}`,
            linkText: "Ver vehículo"
        })
    }));
}

function initializeHeroCarousel(slides, startIndex = 0) {
    const heroCard = document.querySelector(".hero-card");
    const prevButton = document.querySelector(".main-card-arrow--left");
    const nextButton = document.querySelector(".main-card-arrow--right");

    if (!heroCard || !prevButton || !nextButton || !Array.isArray(slides) || slides.length === 0) {
        return;
    }

    let currentIndex = startIndex;

    if (currentIndex < 0 || currentIndex >= slides.length) {
        currentIndex = 0;
    }

    function renderSlide(index) {
        const slide = slides[index];

        if (!slide) return;

        heroCard.innerHTML = slide.html;
        heroCard.dataset.currentIndex = String(index);
    }

    prevButton.replaceWith(prevButton.cloneNode(true));
    nextButton.replaceWith(nextButton.cloneNode(true));

    const freshPrevButton = document.querySelector(".main-card-arrow--left");
    const freshNextButton = document.querySelector(".main-card-arrow--right");

    freshPrevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        renderSlide(currentIndex);
    });

    freshNextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        renderSlide(currentIndex);
    });

    if (slides.length <= 1) {
        freshPrevButton.hidden = true;
        freshNextButton.hidden = true;
    } else {
        freshPrevButton.hidden = false;
        freshNextButton.hidden = false;
    }

    renderSlide(currentIndex);
}

export async function initMainPage() {
    const gallerySection = document.querySelector(".gallery-section");

    if (!gallerySection) {
        return;
    }

    try {
        const [company, offers, cars] = await Promise.all([
            getCompany(),
            getOffers(),
            getCars()
        ]);

        const mainTitle = document.querySelector(".main-title");
        const secondaryTitles = [...document.querySelectorAll(".col-title")];
        const [leftCard, centerCard, rightCard] = [...document.querySelectorAll(".card-placeholder")];

        const firstOffer = offers[0];
        const secondOffer = offers[1] || offers[0];
        const heroSlides = buildHeroSlides(company, cars);

        const featuredCar = cars.find((car) => car.featured) || cars[0];
        const featuredIndex = cars.findIndex((car) => car.id === featuredCar?.id);

        if (mainTitle) {
            mainTitle.textContent = company.name;
        }

        if (secondaryTitles[0] && firstOffer) {
            secondaryTitles[0].textContent = firstOffer.title;
        }

        if (secondaryTitles[1] && secondOffer) {
            secondaryTitles[1].textContent = secondOffer.title;
        }

        if (leftCard && firstOffer) {
            leftCard.innerHTML = buildGalleryCard({
                image: firstOffer.image,
                title: firstOffer.title,
                subtitle: firstOffer.subtitle,
                href: firstOffer.ctaLink,
                linkText: firstOffer.ctaText
            });
        }

        if (centerCard && heroSlides.length > 0) {
            initializeHeroCarousel(heroSlides, featuredIndex >= 0 ? featuredIndex : 0);
        }

        if (rightCard && secondOffer) {
            rightCard.innerHTML = buildGalleryCard({
                image: secondOffer.image,
                title: secondOffer.title,
                subtitle: secondOffer.subtitle,
                href: secondOffer.ctaLink,
                linkText: secondOffer.ctaText
            });
        }
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