import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { marketplaceService } from "@/services/marketplace.service";
import type {
    CreateMercadoLivreConfigRequest,
    UpdateMercadoLivreConfigRequest
} from "@/types/marketplace";

export const MARKETPLACE_QUERY_KEY = 'marketplaces';

export const useMarketplaceConfigs = () => {
    return useQuery({
        queryKey: [MARKETPLACE_QUERY_KEY],
        queryFn: () => marketplaceService.getAllConfigs(),
    });
};

export const useMercadoLivreConfig = () => {
    return useQuery({
        queryKey: [MARKETPLACE_QUERY_KEY, 'mercadolivre'],
        queryFn: () => marketplaceService.getMercadoLivreConfig(),
    });
};

export const useCreateMercadoLivreConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMercadoLivreConfigRequest) =>
            marketplaceService.createMercadoLivreConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MARKETPLACE_QUERY_KEY] });
        }
    });
};

export const useUpdateMercadoLivreConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateMercadoLivreConfigRequest) =>
            marketplaceService.updateMercadoLivreConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MARKETPLACE_QUERY_KEY] });
        }
    });
};

export const useDeleteMercadoLivreConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => marketplaceService.deleteMercadoLivreConfig(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MARKETPLACE_QUERY_KEY] });
        }
    });
};