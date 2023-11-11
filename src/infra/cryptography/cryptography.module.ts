import { Module } from "@nestjs/common";

import { JwtEncrypter } from "./jwt-encrypter";
import { Encrypter } from "src/domain/forum/application/cryptography/encrypter";
import { BcryptHasher } from "./bcrypt-hasher";
import { HashComparer } from "src/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "src/domain/forum/application/cryptography/hash-generator";

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
