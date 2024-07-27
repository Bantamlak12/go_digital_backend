import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Admins } from './auth.entity';

@Entity()
export class PasswordResetTokens {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: true })
  token: string;

  @Column({ type: 'timestamp', nullable: true })
  expiryTime: Date;

  @ManyToOne(() => Admins, (admin) => admin.ResetTokens, {
    onDelete: 'CASCADE',
  })
  admin: Admins;
}
