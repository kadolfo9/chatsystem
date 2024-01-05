import * as bcrypt from 'bcrypt';

export async function generateHash(
  value: string,
  salt: number,
): Promise<string> {
  return bcrypt.hash(value, salt);
}
