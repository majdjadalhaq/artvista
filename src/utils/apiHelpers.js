/**
 * Helper function to fetch data with automatic retries.
 * We use this to make sure our app doesn't break if the internet blips for a second.
 * 
 * @param {string} url - The web address we want to get data from.
 * @param {object} options - Extra settings for the request (like headers or signals).
 * @param {number} retries - How many times to try again if it fails (default is 2).
 * @param {number} delay - How long to wait before trying again (in milliseconds).
 */
export const fetchWithRetry = async (url, options = {}, retries = 2, delay = 1000) => {
    try {
        const response = await fetch(url, options);

        // Check if the response is successful (status code 200-299)
        if (!response.ok) {
            // If it's a "Client Error" (like 404 Not Found), we shouldn't retry because it won't fix itself.
            // Exception: 429 means "Too Many Requests", so we might want to wait and try again.
            if (response.status < 500 && response.status !== 429) {
                throw new Error(`Client Error: ${response.status}`);
            }
            // If it's a "Server Error" (500+), the server might be having a moment, so we can retry.
            throw new Error(`Server Error: ${response.status}`);
        }

        return response;
    } catch (error) {
        // If we have retries left and the user didn't cancel the request (AbortError), let's try again.
        if (retries > 0 && error.name !== 'AbortError') {
            // Wait for a bit...
            await new Promise(resolve => setTimeout(resolve, delay));
            // ...and try again with double the wait time (exponential backoff).
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        // If we're out of retries, just throw the error so the app knows something went wrong.
        throw error;
    }
};
