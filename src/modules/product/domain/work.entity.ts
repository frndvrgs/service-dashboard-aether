import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ schema: "product_data_schema", name: "work" })
export class WorkEntity implements CommonTypes.BaseEntity {
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id!: number;

  @Column("uuid", { name: "id_work" })
  idWork!: string;

  @Column("uuid", { name: "id_account" })
  idAccount!: string;

  @Column("uuid", { name: "id_feature" })
  idFeature!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column()
  name!: string;

  @Column("numeric", { precision: 5, scale: 2 })
  level!: number;

  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;

  // work in progress, having issues using multiple datasources
  // @ManyToOne(() => AccountEntity)
  // @JoinColumn({ name: "id_account" })
  // account!: AccountEntity;

  @BeforeInsert()
  generateIdAccount() {
    if (!this.idWork) {
      this.idWork = uuidv4();
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
