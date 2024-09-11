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

  @Column("uuid")
  id_work!: string;

  @Column("uuid")
  id_account!: string;

  @Column("uuid")
  id_feature!: string;

  @Column()
  id_repository!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  name!: string;

  @Column({ nullable: true })
  repository_name?: string;

  @Column()
  process_type!: string;

  @Column({ default: "idle" })
  process_status!: string;

  @Column({ type: "boolean", default: false })
  has_code_dump!: boolean;

  @Column("numeric", { precision: 5, scale: 2, default: 0 })
  level!: number;

  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;

  // work in progress, having issues using multiple datasources
  // @ManyToOne(() => AccountEntity)
  // @JoinColumn()
  // account!: AccountEntity;

  @BeforeInsert()
  generateIdAccount() {
    if (!this.id_work) {
      this.id_work = uuidv4();
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
