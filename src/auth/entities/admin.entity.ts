import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ResetTokens } from './password-reset-token.entity';
import { RecoveryTokens } from './account-recovery-token.entity';

@Entity()
export class Admins {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  isActive: boolean;

  @Column()
  createdAt: Date;

  @OneToMany(() => ResetTokens, (token) => token.admin)
  resetTokens: ResetTokens[];

  @OneToOne(() => RecoveryTokens, (token) => token.admin)
  recoveryTokens: RecoveryTokens;
}
