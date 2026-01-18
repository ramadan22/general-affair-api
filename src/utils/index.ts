/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request } from 'express';

export function getBearerToken(req: Request) {
  const authHeader = req.headers['authorization']; // <- object biasa
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  return authHeader.split(' ')[1];
}

export function removeObjectKeys<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keysToRemove: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keysToRemove) {
    delete result[key];
  }
  return result;
}

export function generateNumericPassword(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
