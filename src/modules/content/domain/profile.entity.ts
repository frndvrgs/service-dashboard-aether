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

@Entity({ schema: "content_data_schema", name: "profile" })
export class ProfileEntity implements CommonTypes.BaseEntity {
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id!: number;

  @Column("uuid", { name: "id_profile" })
  idProfile!: string;

  @Column("uuid", { name: "id_account" })
  idAccount!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column()
  username!: string;

  @Column()
  name!: string;

  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;

  // work in progress, having issues using multiple datasources
  // @OneToOne(() => AccountEntity, { createForeignKeyConstraints: false })
  // @JoinColumn({ name: "id_account", referencedColumnName: "idAccount" })
  // account!: AccountEntity;

  @BeforeInsert()
  generateIdAccount() {
    if (!this.idProfile) {
      this.idProfile = uuidv4();
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
