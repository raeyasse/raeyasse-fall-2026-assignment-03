import { Request, Response, NextFunction } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // TODO: Student implementation - Part 1: Authentication Middleware
  // Store the authenticated userId on res.locals.userId

  // read header
  const header = req.header('X-User-Id');

  // convert it to a number
  const userId = Number(header);

  // reject if invalid or missing
  if (!header || !Number.isInteger(userId) || userId <= 0) {
    res.status(401).json({ error: 'Missing or invalid X-User-Id header' });
    return;
  }
  // store it and pass the request along
  res.locals.userId = userId;
  next();
}

export default authMiddleware;
