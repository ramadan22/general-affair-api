import { Request } from 'express';

export function getBearerToken(req: Request) {
  const authHeader = req.headers['authorization']; // <- object biasa
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  return authHeader.split(' ')[1];
}
