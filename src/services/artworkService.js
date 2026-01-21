/**
 * Artwork Service
 * This file handles getting artwork data from all our different sources (Chicago + Europeana).
 * It combines them into one list so the rest of the app doesn't have to worry about where the art comes from.
 */

import { artInstituteApi } from './artInstituteApi';
import { europeanaApi } from './europeanaApi';

/**
 * Fetches artworks from both APIs at the same time and combines the results.
 * 
 * @param {object} params - The search settings.
 * @param {string} params.query - What the user is looking for (optional).
 * @param {number} params.page - Which page of results to get.
 * @param {AbortSignal} params.signal - Lets us cancel the download if the user changes their mind.
 */
export const fetchUnifiedArtworks = async ({ query, page, signal }) => {
    // We start by preparing the settings for our search.
    // If we are on page 1, we might show different things than page 2.
    const currentPage = page || 1;

    // If the user hasn't typed anything, we want to show a variety of art.
    // So we pick different topics for different pages to keep it interesting.
    let queryToUse = query;
    if (!query) {
        const diverseTerms = ['painting', 'sculpture', 'portrait', 'landscape', 'modern art', 'abstract', 'impressionism', 'renaissance', 'baroque', 'cubism', 'expressionism', 'realism', 'watercolor', 'digital art', 'photography', 'installation', 'drawing', 'printmaking', 'textile', 'decorative arts', 'architecture', 'still life', 'mythology', 'historical', 'figurative', 'contemporary'];
        // We use the page number to cycle through the list of terms.
        const termIndex = (currentPage - 1) % diverseTerms.length;
        queryToUse = diverseTerms[termIndex];
    }

    const params = { q: queryToUse, page: currentPage, limit: 50, signal };

    // We ask both the Chicago museum and Europeana for data at the exact same time.
    // Promise.allSettled means we wait for both to finish, even if one fails.
    const results = await Promise.allSettled([
        artInstituteApi.search(params),
        europeanaApi.search(params)
    ]);

    // If the user cancelled the request (like by typing a new letter), we stop here.
    if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
    }

    // We check if each request succeeded. If it did, we use the data. If not, we use an empty list.
    const aicResult = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
    const euroResult = results[1].status === 'fulfilled' ? results[1].value : { data: [] };

    // If something went wrong, we log it so we can fix it later, but we don't crash the app.
    if (results[0].status === 'rejected') {
        console.warn('AIC API error:', results[0].reason?.message || results[0].reason);
    }
    if (results[1].status === 'rejected') {
        console.warn('Europeana API error:', results[1].reason?.message || results[1].reason);
    }

    // We combine the two lists of artworks into one big list.
    const rawData = [...(aicResult.data || []), ...(euroResult.data || [])];

    // We only want to show artworks that actually have images.
    const validItems = rawData.filter(art =>
        art.imageUrl || art.image_large || art.image_small || art.image
    );

    return validItems;
};
