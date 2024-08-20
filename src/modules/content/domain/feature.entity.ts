import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import type { CommonTypes } from "@types";

@Entity({ schema: "content_data_schema", name: "feature" })
export class FeatureEntity implements CommonTypes.BaseEntity {
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id!: number;

  @Column("uuid", { name: "id_feature" })
  idFeature!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column()
  name!: string;

  @Column("text", { array: true })
  subscriptionScope!: string[];

  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;

  @BeforeInsert()
  generateIdAccount() {
    if (!this.idFeature) {
      this.idFeature = uuidv4();
    }
  }

  @BeforeInsert()
  setDates() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    this.updatedAt = new Date();
  }
}
