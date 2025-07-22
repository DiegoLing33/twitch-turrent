import { Global, Module } from '@nestjs/common'
import { DymanicDataController } from './controllers'
import { DynamicDataService } from './services'

@Global()
@Module({
  imports: [],
  controllers: [DymanicDataController],
  providers: [DynamicDataService],
  exports: [DynamicDataService],
})
export class DynamicDataModule {}
