import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ schema: "account_data_schema", name: "subscription" })
export class SubscriptionEntity implements CommonTypes.BaseEntity {
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id!: number;

  @Column("uuid")
  id_subscription!: string;

  @Column("uuid")
  id_account!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  type!: string;

  @Column()
  status!: string;

  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;

  @BeforeInsert()
  generateIdAccount() {
    if (!this.id_subscription) {
      this.id_subscription = uuidv4();
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
