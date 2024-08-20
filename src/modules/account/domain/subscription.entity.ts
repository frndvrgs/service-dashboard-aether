import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { AccountEntity } from "./account.entity";

@Entity({ schema: "account_data_schema", name: "subscription" })
export class SubscriptionEntity {
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id!: number;

  @Column("uuid", { name: "id_subscription" })
  idSubscription!: string;

  @Column("uuid", { name: "id_account" })
  idAccount!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column()
  type!: string;

  @Column()
  status!: string;

  @Column({ type: "jsonb", default: "{}" })
  document!: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: "id_account" })
  account!: AccountEntity;

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
