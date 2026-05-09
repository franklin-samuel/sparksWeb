export enum Marketplace {
    MERCADO_LIVRE = 'Mercado Livre',
    AMAZON = 'Amazon',
    SHOPEE = 'Shopee',
}

export interface MarketplaceConfig {
    id: string;
    marketplace: Marketplace;
    active: boolean;
    credentials: {
        tag?: string;
    };
    createdAt: string;
    modifiedAt: string;
}

export interface CreateMercadoLivreConfigRequest {
    cookie: string;
    tag: string;
}

export interface UpdateMercadoLivreConfigRequest {
    cookie?: string;
    tag?: string;
    active?: boolean;
}