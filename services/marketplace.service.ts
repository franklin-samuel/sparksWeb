import { httpClient } from '@/utils/http-client';
import type {
    MarketplaceConfig,
    CreateMercadoLivreConfigRequest,
    UpdateMercadoLivreConfigRequest
} from '@/types/marketplace';

export const marketplaceService = {
    createMercadoLivreConfig: async (data: CreateMercadoLivreConfigRequest): Promise<MarketplaceConfig> => {
        const response = await httpClient.post<MarketplaceConfig>('/marketplaces/mercadolivre/config', data);
        return response.data!;
    },

    getMercadoLivreConfig: async (): Promise<MarketplaceConfig | null> => {
        try {
            const response = await httpClient.get<MarketplaceConfig>('/marketplaces/mercadolivre/config');
            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    updateMercadoLivreConfig: async (data: UpdateMercadoLivreConfigRequest): Promise<MarketplaceConfig> => {
        const response = await httpClient.patch<MarketplaceConfig>('/marketplaces/mercadolivre/config', data);
        return response.data!;
    },

    deleteMercadoLivreConfig: async (): Promise<void> => {
        await httpClient.delete('/marketplaces/mercadolivre/config');
    },

    getAllConfigs: async (): Promise<MarketplaceConfig[]> => {
        const response = await httpClient.get<MarketplaceConfig[]>('/marketplaces/configs');
        return response.data || [];
    },
};