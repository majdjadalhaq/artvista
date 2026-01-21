
const fetch = globalThis.fetch;

const AIC_BASE = "https://api.artic.edu/api/v1/artworks";
const EUROPEANA_BASE = "https://api.europeana.eu/record/v2/search.json";
const EUROPEANA_KEY = "api2demo";

// Mock Normalization Logic
const normalizeAIC = (item) => ({
    id: `artic_${item.id}`,
    imageUrl: item.image_id ? `https://www.artic.edu/${item.image_id}` : null
});

const normalizeEuropeana = (item) => {
    const image = Array.isArray(item.edmPreview) ? item.edmPreview[0] : (item.edmPreview || null);
    const largeImage = Array.isArray(item.aggregation_edm_isShownBy) ? item.aggregation_edm_isShownBy[0] : image;
    return {
        id: `europeana_${item.id}`,
        imageUrl: largeImage || image || null
    };
};

async function verifyAIC(page) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: "30",
            fields: "id,title,image_id",
            q: "masterpiece",
            "query[term][is_public_domain]": "true"
        });
        const url = `${AIC_BASE}/search?${params.toString()}`;
        console.log(`[AIC] Page ${page}: Fetching...`);
        const res = await fetch(url);
        const json = await res.json();

        const data = json.data || [];
        const norm = data.map(normalizeAIC);
        const valid = norm.filter(a => a.imageUrl);

        console.log(`[AIC] Page ${page}: Raw ${data.length}, Valid Images: ${valid.length}. Total: ${json.pagination?.total}`);
        return { count: data.length, valid: valid.length };
    } catch (e) {
        console.error("[AIC] Error:", e.message);
        return { count: 0, valid: 0 };
    }
}

async function verifyEuropeana(page) {
    try {
        const rows = 30;
        const start = (page - 1) * rows + 1;
        const params = new URLSearchParams({
            wskey: EUROPEANA_KEY,
            query: "art",
            reusability: "open",
            media: "true",
            qf: "TYPE:IMAGE",
            rows: rows.toString(),
            start: start.toString(),
            profile: "rich"
        });
        const url = `${EUROPEANA_BASE}?${params.toString()}`;
        console.log(`[EURO] Page ${page} (Start ${start}): Fetching...`);
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        const json = await res.json();

        const data = json.items || [];
        const norm = data.map(normalizeEuropeana);
        const valid = norm.filter(a => a.imageUrl);

        console.log(`[EURO] Page ${page}: Raw ${data.length}, Valid Images: ${valid.length}. Total: ${json.totalResults}`);
        return { count: data.length, valid: valid.length };
    } catch (e) {
        console.error("[EURO] Error:", e.message);
        return { count: 0, valid: 0 };
    }
}

async function main() {
    console.log("Starting Image Verification...");
    for (let i = 1; i <= 3; i++) {
        await Promise.all([verifyAIC(i), verifyEuropeana(i)]);
    }
}

main();
