import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_brands')
@Exclude() // 關鍵1：預設排除所有欄位
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 內部用的 id (等一下會被藏起來)

  @Expose({ name: 'uid' }) // 關鍵2：將 id 的值，以 uid 的名義暴露出去
  get brandUid(): string {
    return this.id;
  }

  @Expose() // 關鍵3：將您想給前端的欄位，一個個用 @Expose() 標記出來
  @Column({ unique: true })
  name: string;

  @Expose()
  @Column({ nullable: true })
  slug: string;

  @Expose()
  @Column({ default: true })
  status: boolean;

  @Expose()
  @Column({ name: 'image_url', nullable: true })
  image: string;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // updatedAt 我們可以選擇不傳給前端，所以就不用 @Expose()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
