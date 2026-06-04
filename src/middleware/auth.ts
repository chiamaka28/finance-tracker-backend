import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';


export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');


  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
    return;
  }

  try {

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ success: false, message: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as CustomJwtPayload;
    if (typeof decoded !== 'object' || !decoded.id || !decoded.email) {
      res.status(401).json({ success: false, message: 'Invalid token payload' });
      return;
    }

   
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err: any) {
   
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Access token expired' });
      return;
    }
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};