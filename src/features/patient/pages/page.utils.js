export const resolveData = (response) => {
    if (!response) return null;
    if (response.data?.data !== undefined) return response.data.data;
    if (response.data !== undefined) return response.data;
    return response;
};

export const resolveArray = (response) => {
    const payload = resolveData(response);
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.rows)) return payload.rows;
    return [];
};

export const resolvePagination = (response, fallbackLength = 0) => {
    const root = response || {};
    const data = response?.data || {};
    return {
        page: root.current_page || data.current_page || 1,
        lastPage: root.last_page || data.last_page || 1,
        total: root.total || data.total || fallbackLength,
    };
};

export const parseError = (error, fallback) =>
    error?.response?.data?.message || error?.message || fallback;
