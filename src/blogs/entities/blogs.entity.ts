import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToMany(() => Categories, (category) => category.blogs)
  // @JoinTable({
  //   name: 'blog_categories',
  // }) // Specify the join table for many to many relashionship
  // categories: Categories[];

  @OneToMany(() => Comments, (comment) => comment.blog, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comments[];
}
