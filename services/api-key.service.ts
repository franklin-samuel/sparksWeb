import { httpClient } from '@/utils/http-client';
import type {
    ApiKey,
    CreateApiKeyRequest,
    CreateApiKeyResponse,
} from '@/types/api-key';

export const apiKeyService = {
    list: async (): Promise<ApiKey[]> => {
        const response = await httpClient.get<ApiKey[]>('/key');
        return response.data || [];
    },

    create: async (data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> => {
        const response = await httpClient.post<CreateApiKeyResponse>('/key', data);
        return response.data!;
    },

    revoke: async (apiKeyId: string): Promise<ApiKey> => {
        const response = await httpClient.delete<ApiKey>(`/key/${apiKeyId}`);
        return response.data!;
    },
};