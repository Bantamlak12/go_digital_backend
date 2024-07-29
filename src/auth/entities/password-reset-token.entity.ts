import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Admins } from './admin.entity';

@Entity()
export class ResetTokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date;

  @ManyToOne(() => Admins, (admin) => admin.resetTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  admin: Admins;
}
