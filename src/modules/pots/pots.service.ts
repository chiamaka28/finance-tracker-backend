import { prisma } from '../../db';
import { PotMapper, type CreatePotDto, type UpdatePotDto,  type UpdatePotAmountDto} from './pots.dto';

export const createPotService = async (userId: number, dto: CreatePotDto) => {
    const userExists = await prisma.user.findUnique({ where: {id: userId}});
    if (!userExists) {
        throw new Error(`User with ID ${userId} not found`);
    }

    const pot = await prisma.pots.create({
        data: {
                    name: dto.name,
                    target: dto.target,
                    total: 0,
                    color: dto.color,
                    user: { connect: { id: userId } }
        }
    })
    return PotMapper.toResponseDto(pot);
}

export const getPotService = async (userId: number) => {
    const pots = await prisma.pots.findMany({
         where: { 
            userId, 
        },

    });
    return pots.map(PotMapper.toResponseDto);
}

export const updatePotService = async (userId: number, potId: number, dto: UpdatePotDto) => {
    const existingPot = await prisma.pots.findFirst({ where: { id: potId, userId } });
    if (!existingPot) {
        throw new Error(`Pot with ID ${potId} not found for user ${userId}`);
    }

    const updatedPot = await prisma.pots.update({
        where: { id: potId },
        data: {
            name: dto.name,
            target: dto.target,
            color: dto.color
        }
    });

    return PotMapper.toResponseDto(updatedPot);
}

export const withdrawPotService = async (userId:number, potId: number, dto: UpdatePotAmountDto) => {
    const existingPot = await prisma.pots.findFirst({where: {id: potId, userId}});
    if (!existingPot) {
          throw new Error(`Pot with ID ${potId} not found for user ${userId}`);
    }
    if (dto.amount > Number(existingPot.total)) {
     throw new Error('Amount exceeds the Total Money Saved');
    } else {
        const updatedPot = await prisma.pots.update({
       where: {id: potId} ,
       data: {
         total:   Number(existingPot.total) - Number(dto.amount)
       }
    });

    return PotMapper.toResponseDto(updatedPot)
    }
 }
   
export const AddPotService = async (userId:number, potId: number, dto: UpdatePotAmountDto) => {
    const existingPot = await prisma.pots.findFirst({where: {id: potId, userId}});
    if (!existingPot) {
          throw new Error(`Pot with ID ${potId} not found for user ${userId}`);
    }
   if (Number(existingPot.total) + dto.amount > Number(existingPot.target)) {
    throw new Error('Amount exceeds the target');
    } else {
        const updatedPot = await prisma.pots.update({
       where: {id: potId} ,
       data: {
         total:   Number(existingPot.total) + Number(dto.amount)
       }
    });

    return PotMapper.toResponseDto(updatedPot)
    }
 }
    

export const deletePotService = async (userId: number, potId: number) => {
    const existingPot = await prisma.pots.findFirst({ where: { id: potId, userId } });  
    if (!existingPot) {
        throw new Error(`Pot with ID ${potId} not found for user ${userId}`);
    }

    await prisma.pots.delete({ where: { id: potId } });
}