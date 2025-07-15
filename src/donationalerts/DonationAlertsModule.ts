import { Module } from '@nestjs/common'
import { DonationsModule } from 'src/donations'
import { ResolverModule } from 'src/resolver/ResolverModule'
import { DonationAlertsService } from './services'

@Module({
  imports: [DonationsModule, ResolverModule],
  providers: [DonationAlertsService],
  exports: [DonationAlertsService],
})
export class DonationAlertsModule {}
