import { Injectable, Logger } from '@nestjs/common'
import { v4 } from 'uuid'
import { GoalsTasksDAO } from '../daos'
import { GoalEntity, GoalTaskEntity, GoalTaskStatus } from '../entities'

@Injectable()
export class GoalsTasksService {
  private readonly logger = new Logger(GoalsTasksService.name)
  constructor(private readonly goalsTasksDAO: GoalsTasksDAO) {}

  async createTaskForGoal(goal: GoalEntity, iteration: number) {
    const task = new GoalTaskEntity()
    task.id = v4()
    task.status = GoalTaskStatus.PENDING
    task.goalId = goal.id
    task.title = `${goal.title} (${iteration})`
    task.goalTitle = goal.title
    task.raisedAmount = goal.raisedAmount
    task.currency = goal.currency

    this.logger.log(`Creating task for goal title: ${goal.title}, iterator: ${iteration}`)
    return await this.goalsTasksDAO.createTask(task)
  }

  async getLastTasks(status: GoalTaskStatus) {
    return await this.goalsTasksDAO.getLastItems(status)
  }

  async updateTask(task: GoalTaskEntity) {
    this.logger.log(`Updating task with id: ${task.id}`)
    return await this.goalsTasksDAO.updateTask(task)
  }

  async resetAllInProgressTasksToPending() {
    await this.goalsTasksDAO.resetAllInProgressToPending()
  }

  async hasInProgressTasks() {
    return await this.goalsTasksDAO.hasInProgress()
  }

  async hasPendingTasks() {
    return await this.goalsTasksDAO.hasPending()
  }
}
