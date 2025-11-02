import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum GoalTaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class GoalTaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  goalId: string

  @Column()
  title: string

  @Column()
  goalTitle: string

  @Column()
  raisedAmount: number

  @Column()
  currency: string

  @Column({ enum: GoalTaskStatus })
  status: GoalTaskStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
