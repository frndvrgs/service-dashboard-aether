import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

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

  @Column("text", { array: true })
  email!: string[];

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
  setDates() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    this.updatedAt = new Date();
  }
}
