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

  @Column("uuid")
  id_account!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column("text", { array: true })
  email!: string[];

  @Column({ default: "user" })
  scope!: string;

  @Column()
  github_token!: string;

  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;

  @Column({
    type: "boolean",
    generatedType: "STORED",
    asExpression: "github_token IS NOT NULL",
  })
  has_github_token!: boolean;

  @BeforeInsert()
  generateIdAccount() {
    if (!this.id_account) {
      this.id_account = uuidv4();
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
