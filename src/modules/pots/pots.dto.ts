import type { Pots } from '@generated/prisma/client';

export interface CreatePotDto {
    name: string;
    target: number;
    color: string;
}

export interface UpdatePotDto {
    name: string;
    target: number;
    color: string;
}

export interface UpdatePotAmountDto {
   amount: number;
   target: number;
    total: number;
}


export interface PotResponseDto {
    id: number;
    name: string;
    target: number;
    total: number;
    color: string;
}

export class PotMapper {
    static toResponseDto(pot: Pots ) : PotResponseDto {
        return {
            id: pot.id,
            name: pot.name,
            target: Number(pot.target),
            total: Number(pot.total),
            color: pot.color
        }
    }}