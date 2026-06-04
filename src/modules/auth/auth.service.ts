import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db';
import { AuthMapper } from './auth.dto';
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from './auth.dto';


export async function register({
    name,
    email,
    password,
}: RegisterRequestDto): Promise<RegisterResponseDto> {
    const existingUser = await prisma.user.findUnique({ where: { email } });    
     if (existingUser) {
        throw new Error('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return AuthMapper.toRegisterResponseDto(user);
}

export async function login({
    email,
    password
}: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user!.password);
    if (!isPasswordValid) {
        throw { status: 400, message: 'Invalid email or password' };
    }

    const payload = {
        userId: user.id,
        email: user.email,
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d'});

    await prisma.refreshToken.create({
        data: {
            id: crypto.randomUUID(),
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });

    return AuthMapper.toLoginResponseDto(user, accessToken, refreshToken);

}


export async function refreshToken(refreshToken: string): Promise<string> {
  try {
     
      const decoded = jwt.verify(
        refreshToken, 
        process.env.JWT_REFRESH_SECRET as string
      ) as { id: number; email: string };
      
      
      const storedToken = await prisma.refreshToken.findFirst({
        where: { 
          token: refreshToken,
          userId: decoded.id,
          expiresAt: { gt: new Date() } 
        }
      });
      
      if (!storedToken) {
        throw new Error("Invalid or expired refresh token");
      }
      
      
      const payload = { id: decoded.id, email: decoded.email };
      const newAccessToken = jwt.sign(
        payload, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '15m' }
      );
      
      return newAccessToken;
      
    } catch (error: any) {
     
      throw new Error("Invalid or expired refresh token");
    }
}


export async function logout(refreshToken: string): Promise<void> {
 try {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }

}