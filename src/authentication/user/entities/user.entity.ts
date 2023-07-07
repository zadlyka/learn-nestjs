import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../role/entities/role.entity';
import { Attachment } from '../../../attachment/entities/attachment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  @Exclude()
  profileId?: string;

  @Column({ type: 'uuid', nullable: true })
  @Exclude()
  identityCardId?: string;

  @Column({ length: 64, unique: true })
  name: string;

  @Column({ length: 64, unique: true })
  email: string;

  @Column({ length: 64 })
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => Attachment, { eager: true })
  profile: Attachment;

  @ManyToOne(() => Attachment, { eager: true })
  identityCard: Attachment;
}
