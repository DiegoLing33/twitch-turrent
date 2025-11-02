import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { GoalTaskStatus } from '../entities'
import { GoalsService, GoalsTasksService } from '../services'

@ApiTags('Goals')
@Controller({ path: 'goals' })
export class GoalsControllers {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly goalsTasksService: GoalsTasksService,
  ) {}

  @Get('/last')
  async getLastGoals() {
    return this.goalsService.getLastGoals()
  }

  @Post('/create')
  async create(@Body() body: { title: string; raised: number; goal: number; currency: string }) {
    return this.goalsService.createGoal({
      id: new Date().getTime(),
      is_active: 1,
      is_default: 1,
      title: body.title,
      currency: body.currency,
      start_amount: 0,
      raised_amount: body.raised,
      goal_amount: body.goal,
      started_at: '',
      expires_at: '',
      reason: '',
    })
  }

  @Post('/delete-all')
  async deleteAllGoals() {
    return this.goalsService.deleteAllGoals()
  }

  @Post('/delete/:id')
  async deleteGoalById(id: string) {
    return this.goalsService.deleteGoalById(id)
  }

  @Get('/tasks/last')
  @ApiQuery({ enum: GoalTaskStatus, name: 'status' })
  public async getLast10Items(@Query('status') status: GoalTaskStatus) {
    return this.goalsTasksService.getLastTasks(status)
  }

  @Post('cancel-processing')
  public async resetAllToPendingStatus() {
    return await this.goalsTasksService.resetAllInProgressTasksToPending()
  }
}
