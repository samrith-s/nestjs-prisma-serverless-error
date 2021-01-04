import { Global, Module } from '@nestjs/common';

import { ORMService } from './orm.service';

@Module({
  providers: [ORMService],
  exports: [ORMService],
})
@Global()
export class ORMModule {}
