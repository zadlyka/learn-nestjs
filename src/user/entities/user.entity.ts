import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 64 })
  name: string;

  @Column({ length: 64 })
  email: string;

  @Column({ length: 64 })
  @Exclude()
  password: string;
}
