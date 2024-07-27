import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PasswordResetTokens } from './password-reset-token.entity';

@Entity()
export class Admins {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => PasswordResetTokens, (token) => token.admin)
  ResetTokens: PasswordResetTokens[];
}
