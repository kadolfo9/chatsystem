import * as bcrypt from 'bcrypt';
import { Request } from 'express';

export async function generateHash(
  value: string,
  salt: number,
): Promise<string> {
  return bcrypt.hash(value, salt);
}

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers?.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
