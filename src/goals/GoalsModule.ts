import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GoalsControllers } from './controllers'
import { GoalsDAO, GoalsTasksDAO } from './daos'
import { GoalEntity, GoalTaskEntity } from './entities'
import { GoalsTasksService } from './services'
import { GoalsService } from './services/GoalsService'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([GoalEntity, GoalTaskEntity])],
  providers: [GoalsDAO, GoalsTasksDAO, GoalsService, GoalsTasksService],
  exports: [GoalsTasksService, GoalsService],
  controllers: [GoalsControllers],
})
export class GoalsModule {}
