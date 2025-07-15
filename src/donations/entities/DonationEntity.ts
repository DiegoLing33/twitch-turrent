import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum DonationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class DonationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  username: string

  @Column({ unique: true })
  eventId: string

  @Column()
  amount: number

  @Column()
  currency: string

  @Column()
  type: string

  @Column({ enum: DonationStatus })
  status: DonationStatus

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ type: 'text' })
  message: string
}
