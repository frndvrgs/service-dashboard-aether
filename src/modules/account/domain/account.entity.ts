import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

import type { CommonTypes } from "@types";

const options = {
  hash: {
    type: argon2.argon2id,
    hashLength: 64,
    timeCost: 6,
    memoryCost: 32 * 1024,
    parallelism: 4,
  },
};

@Entity({ schema: "account_data_schema", name: "account" })
export class AccountEntity implements CommonTypes.BaseEntity {
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id!: number;

  @Column("uuid", { name: "id_account" })
  idAccount!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "user" })
  scope!: string;

  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;

  @BeforeInsert()
  generateIdAccount() {
    if (!this.idAccount) {
      this.idAccount = uuidv4();
    }
  }

  @BeforeInsert()
  async generatePassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password, options.hash);
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
