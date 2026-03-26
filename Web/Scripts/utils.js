export function getCategoryById(categories, id) {
    return categories.find((category) => category.id === id);
}

export function getLocationsByIds(locations, ids) {
    return locations.filter((location) => ids.includes(location.id));
}

export function getReviewsByCarId(reviews, carId) {
    return reviews.filter((review) => review.carId === carId);
}

export function formatPrice(price) {
    return `${price} €/día`;
}

export function createImageFallback(label = "CAT Renting") {
    const safeLabel = String(label || "CAT Renting")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
            <rect width="640" height="420" fill="#f0f0f0" />
            <rect x="22" y="22" width="596" height="376" rx="16" fill="#ffffff" stroke="#bcbcbc" stroke-width="4" />
            <text x="320" y="195" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#444444">CAT Renting</text>
            <text x="320" y="238" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#777777">${safeLabel}</text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getImageSource(path, label) {
    if (typeof path === "string" && path.trim()) {
        return path;
    }

    return createImageFallback(label);
}
