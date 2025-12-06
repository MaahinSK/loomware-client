import { useState, useCallback } from 'react';
import api from '../services/api';

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const request = useCallback(async (method, url, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api[method](url, options.data || {}, options.config || {});
            setData(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((url, options) => request('get', url, options), [request]);
    const post = useCallback((url, options) => request('post', url, options), [request]);
    const put = useCallback((url, options) => request('put', url, options), [request]);
    const del = useCallback((url, options) => request('delete', url, options), [request]);

    return {
        loading,
        error,
        data,
        get,
        post,
        put,
        del,
        reset: () => {
            setError(null);
            setData(null);
        },
    };
};

export default useApi;