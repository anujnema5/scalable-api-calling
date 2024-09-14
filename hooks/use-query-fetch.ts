import { API_URL } from '@/utils/constants/api-endpoints';
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';

type UseApiProps = {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    keys?: string[] | string;
    body?: any;
};

export const useApi = ({ url, method = 'GET', keys, body }: UseApiProps): UseQueryResult | UseMutationResult => {
    if (method === 'GET') {
        return useQuery({
            queryKey: Array.isArray(keys) ? keys : [keys],
            queryFn: async () => {
                const response = await fetch(`${API_URL}${url}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            },
        });
    }

    // For POST, PUT, PATCH, DELETE methods
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(url, {
                method,
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        },
    });
};
