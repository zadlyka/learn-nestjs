import { SetMetadata } from '@nestjs/common';

export const JWT_PUBLIC_KEY = 'without-jwt';
export const WithoutJwt = () => SetMetadata(JWT_PUBLIC_KEY, true);
