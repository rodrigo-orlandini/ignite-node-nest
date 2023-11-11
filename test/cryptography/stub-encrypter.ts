import { Encrypter } from "src/domain/forum/application/cryptography/encrypter";

export class StubEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
