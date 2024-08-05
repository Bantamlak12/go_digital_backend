import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Blogs } from './blogs.entity';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
