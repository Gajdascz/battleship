const createSlug = (text) => text.toLowerCase().replaceAll(/' '/g, '-');

export { createSlug };
