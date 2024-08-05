import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Comments } from './comment.entity';
import { Categories } from './category.entity';

@Entity()
export class Blogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  picture: string;

  @Column()
  author: string;

  @Column('text', { array: true, nullable: true })
  categories: string[];

  @OneToMany(() => Comments, (comment) => comment.blog, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comments[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
