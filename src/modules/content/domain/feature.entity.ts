import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ schema: "content_data_schema", name: "feature" })
export class FeatureEntity implements CommonTypes.BaseEntity {
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id!: number;

  @Column("uuid")
  id_feature!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  name!: string;

  @Column()
  process_type!: string;

  @Column("text", { array: true })
  subscription_scope!: string[];

  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;

  @BeforeInsert()
  generateIdAccount() {
    if (!this.id_feature) {
      this.id_feature = uuidv4();
    }
  }

  @BeforeInsert()
  setDates() {
    if (!this.created_at) {
      this.created_at = new Date();
    }
    this.updated_at = new Date();
  }
}
