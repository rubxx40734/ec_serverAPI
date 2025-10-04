import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// 使用者角色
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
@Exclude() // 關鍵1：預設排除所有欄位
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ name: 'uid' })
  id: string;

  @Expose()
  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // 密碼不讓它被查詢出來
  password: string;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
