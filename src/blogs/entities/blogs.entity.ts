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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Categories, (category) => category.blogs)
  @JoinTable({
    name: 'blog_categories',
    joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Categories[];

  @OneToMany(() => Comments, (comment) => comment.blog, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comments[];
}
