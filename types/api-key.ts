export enum ApiKeyStatus {
    ACTIVE = 'ACTIVE',
    REVOKED = 'REVOKED',
}

export interface ApiKey {
    id: string;
    name: string;
    keyPrefix: string;
    status: ApiKeyStatus;
    lastUsedAt: string | null;
    createdAt: string;
}

export interface CreateApiKeyRequest {
    name: string;
}

export interface CreateApiKeyResponse extends ApiKey {
    plainKey: string;
}