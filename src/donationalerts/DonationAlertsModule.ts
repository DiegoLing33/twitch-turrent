import { Module } from '@nestjs/common'
import { ResolverModule } from 'src/resolver/ResolverModule'
import { CentrifugeService, WidgetService } from './services'

@Module({
  imports: [ResolverModule],
  providers: [WidgetService, CentrifugeService],
  exports: [],
})
export class DonationAlertsModule {}
