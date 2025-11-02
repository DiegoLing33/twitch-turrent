import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { GoalTaskEntity, GoalTaskStatus } from '../entities'

@Injectable()
export class GoalsTasksDAO {
  private readonly logger = new Logger(GoalsTasksDAO.name)

  constructor(
    @InjectRepository(GoalTaskEntity)
    private readonly goalsTasksRepository: MongoRepository<GoalTaskEntity>,
  ) {}

  async getLastItems(status: GoalTaskStatus) {
    return await this.goalsTasksRepository.find({
      where: { status },
      order: {
        createdAt: status === GoalTaskStatus.COMPLETED ? 'DESC' : 'ASC',
      },
      take: 50,
    })
  }

  async createTask(task: GoalTaskEntity): Promise<GoalTaskEntity> {
    this.logger.log(`Creating new task for goal with id: ${task.title}`)
    return this.goalsTasksRepository.save(task)
  }

  async updateTask(task: GoalTaskEntity): Promise<GoalTaskEntity> {
    this.logger.log(`Updating task with id: ${task.id}`)
    return this.goalsTasksRepository.save(task)
  }

  async resetAllInProgressToPending(): Promise<void> {
    this.logger.log(`Resetting all in-progress tasks to pending status`)
    await this.goalsTasksRepository.update({ status: GoalTaskStatus.IN_PROGRESS }, { status: GoalTaskStatus.PENDING })
  }

  async hasInProgress() {
    this.logger.log('Checking for in progress tasks')
    const count = await this.goalsTasksRepository.count({
      where: { status: GoalTaskStatus.IN_PROGRESS },
    })
    return count > 0
  }

  async hasPending() {
    this.logger.log('Checking for pending tasks')
    const count = await this.goalsTasksRepository.count({
      where: { status: GoalTaskStatus.PENDING },
    })
    return count > 0
  }
}
