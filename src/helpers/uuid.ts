import crypto from 'node:crypto';

export class Uuid {
  public v4(options?: crypto.RandomUUIDOptions | undefined): string {
    return crypto.randomUUID(options);
  }
}
export default new Uuid();
