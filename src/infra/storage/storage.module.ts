import { Module } from "@nestjs/common";

import { Uploader } from "src/domain/forum/application/storage/uploader";
import { TebiStorage } from "./tebi-storage";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [EnvModule],
  providers: [{ provide: Uploader, useClass: TebiStorage }],
  exports: [Uploader],
})
export class StorageModule {}
