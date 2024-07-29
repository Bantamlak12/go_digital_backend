import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Admins } from './admin.entity';

@Entity()
export class RecoveryTokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  recoveryToken: string;

  @Column({ type: 'timestamp', nullable: true })
  recoveryTokenExpiry: Date;

  @OneToOne(() => Admins, (admin) => admin.recoveryTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  admin: Admins;
}
