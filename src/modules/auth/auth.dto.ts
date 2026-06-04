import type { User } from '@generated/prisma/client';

interface RegisterRequestDto {
    name: string;
    email: string;
    password: string;
}

interface RegisterResponseDto {
    id: number;
    name: string;
    email: string;
}

interface LoginRequestDto {
    email: string;
    password: string;
}

interface LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

class AuthMapper {
    static toRegisterResponseDto(user: User): RegisterResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    } 

    static toLoginResponseDto(user: User, accessToken: string, refreshToken: string): LoginResponseDto {
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
}

export type {
    RegisterRequestDto,
    RegisterResponseDto,
    LoginRequestDto,
    LoginResponseDto,
};
export { AuthMapper };