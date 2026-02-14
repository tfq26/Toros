// src/services/newsFunctions.js

import axios from 'axios';

// Base endpoint for news API
const API_BASE = 'http://localhost:8080/api/news';

/**
 * Normalize server response to an array of NewsItem.
 */
function normalizeList(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
}

/**
 * GET /api/news
 * Fetch the latest news items (limit enforced server-side).
 */
export async function fetchLatestNews() {
    const { data } = await axios.get(API_BASE);
    return normalizeList(data);
}

/**
 * GET /api/news?category={category}
 * Fetch news items filtered by category.
 */
export async function fetchNewsByCategory(category) {
    const { data } = await axios.get(API_BASE, {
        params: { category },
    });
    return normalizeList(data);
}

/**
 * GET /api/news/{id}
 * Fetch a single NewsItem by its ID.
 */
export async function fetchNewsById(id) {
    const { data } = await axios.get(`${API_BASE}/${id}`);
    return data;
}

/**
 * POST /api/news
 * Create a new NewsItem on the server.
 */
export async function createNewsItem(item) {
    const { data } = await axios.post(API_BASE, item);
    return data;
}

/**
 * DELETE /api/news/{id}
 * Delete a NewsItem by its ID.
 */
export async function deleteNewsItem(id) {
    await axios.delete(`${API_BASE}/${id}`);
}

/**
 * (Optional) PUT /api/news/{id}
 * Update an existing NewsItem. Requires server-side endpoint.
 */
export async function updateNewsItem(id, updates) {
    const { data } = await axios.put(`${API_BASE}/${id}`, updates);
    return data;
}
