import * as bcrypt from 'bcrypt';

export class HelpersTransform {
  public static async generateHash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 10);
  }

  public static async compareHash(
    plain: string,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
