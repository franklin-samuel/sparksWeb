import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiKeyService } from "@/services/api-key.service";
import type { CreateApiKeyRequest } from "@/types/api-key";

export const API_KEY_QUERY_KEY = 'api-keys';

export const useApiKeys = () => {
    return useQuery({
        queryKey: [API_KEY_QUERY_KEY],
        queryFn: () => apiKeyService.list(),
    });
};

export const useCreateApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateApiKeyRequest) => apiKeyService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEY_QUERY_KEY] });
        }
    });
};

export const useRevokeApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (apiKeyId: string) => apiKeyService.revoke(apiKeyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEY_QUERY_KEY] });
        }
    });
};