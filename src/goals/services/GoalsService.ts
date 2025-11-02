import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { IGoalMessage } from 'src/donationalerts/types'
import { DynamicDataService } from 'src/dynamic-data'
import { QUEUE_PING_EVENT } from 'src/resolver/services'
import { v4 } from 'uuid'
import { GoalsDAO } from '../daos'
import { GoalEntity } from '../entities'
import { GoalsTasksService } from './GoalsTasksService'

@Injectable()
export class GoalsService {
  private readonly logger = new Logger(GoalsService.name)
  constructor(
    private readonly goalsDAO: GoalsDAO,
    private readonly goalsTasksService: GoalsTasksService,
    private readonly dynamicDataService: DynamicDataService,
    private readonly events: EventEmitter2,
  ) {}

  async getLastGoals() {
    return await this.goalsDAO.getLastItems()
  }

  async deleteAllGoals() {
    this.logger.log(`Deleting all goals`)
    return await this.goalsDAO.deleteAllGoals()
  }

  async deleteGoalById(id: string) {
    this.logger.log(`Deleting goal with id: ${id}`)
    return await this.goalsDAO.deleteGoal(id)
  }

  async getRuleForGoal(title: string) {
    const goalsConfig = await this.dynamicDataService.readGoalsConfig()
    return goalsConfig.find(it => it.name === title && it.enabled)
  }

  async createGoal(message: IGoalMessage) {
    const isGoalFromConfig = !!(await this.getRuleForGoal(message.title))

    if (!isGoalFromConfig) {
      this.logger.log(`Goal with title: ${message.title} is not in config, skipping creation`)
      return null
    }

    const goal = await this.goalsDAO.getGoalByTitle(message.title)
    if (goal) return await this.updateGoalByMessage(goal, message)

    this.logger.log(`Creating goal for message title: ${message.title}`)
    const createdGoal = new GoalEntity()
    createdGoal.id = v4()
    createdGoal.title = message.title
    createdGoal.currency = message.currency
    createdGoal.raisedAmount = message.raised_amount
    createdGoal.goalAmount = message.goal_amount
    createdGoal.iterator = 0

    const entity = await this.goalsDAO.createGoal(createdGoal)
    return await this.updateGoalByMessage(entity, message)
  }

  async updateGoalByMessage(goal: GoalEntity, message: IGoalMessage) {
    this.logger.log(`Updating goal for message title: ${message.title}`)
    goal.raisedAmount = message.raised_amount
    goal.goalAmount = message.goal_amount
    goal.updatedAt = new Date()

    const iterator = Math.floor(message.raised_amount / message.goal_amount)

    if (iterator != goal.iterator) {
      this.logger.log(`Goal iteration updated for goal title: ${message.title}, new iterator: ${iterator}`)
      await this.goalsTasksService.createTaskForGoal(goal, iterator)
      this.events.emit(QUEUE_PING_EVENT)
    }

    goal.iterator = iterator
    return await this.goalsDAO.updateGoal(goal)
  }
}
