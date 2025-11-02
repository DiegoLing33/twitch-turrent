import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { GoalEntity } from '../entities'

@Injectable()
export class GoalsDAO {
  private readonly logger = new Logger(GoalsDAO.name)

  constructor(
    @InjectRepository(GoalEntity)
    private readonly goalsRepository: MongoRepository<GoalEntity>,
  ) {}

  async getLastItems() {
    return await this.goalsRepository.find({
      order: {
        iterator: 'DESC',
      },
      take: 50,
    })
  }

  async createGoal(goal: GoalEntity): Promise<GoalEntity> {
    this.logger.log(`Creating new goal with title: ${goal.title}`)
    return this.goalsRepository.save(goal)
  }

  async getGoalByTitle(title: string): Promise<GoalEntity | null> {
    this.logger.log(`Fetching goal with title: ${title}`)
    return this.goalsRepository.findOne({ where: { title } })
  }

  async updateGoal(goal: GoalEntity): Promise<GoalEntity> {
    this.logger.log(`Updating goal with id: ${goal.id}`)
    return this.goalsRepository.save(goal)
  }

  async deleteGoal(id: string): Promise<void> {
    this.logger.log(`Deleting goal with id: ${id}`)
    await this.goalsRepository.delete(id)
  }

  async deleteAllGoals(): Promise<void> {
    this.logger.log(`Deleting all goals`)
    await this.goalsRepository.clear()
  }
}
