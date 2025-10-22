import { SetMetadata } from '@nestjs/common';

export const ApiKeyAuth = 'apiKeyAuth';
export const ApiKeyAuthRequired = () => SetMetadata(ApiKeyAuth, true);