import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ schema: "content_data_schema", name: "profile" })
export class ProfileEntity implements CommonTypes.BaseEntity {
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id!: number;

  @Column("uuid")
  id_profile!: string;

  @Column("uuid")
  id_account!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  username!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;

  // work in progress, having issues using multiple datasources
  // @OneToOne(() => AccountEntity, { createForeignKeyConstraints: false })
  // @JoinColumn({ referencedColumnName: "id_account" })
  // account!: AccountEntity;

  @BeforeInsert()
  generateIdAccount() {
    if (!this.id_profile) {
      this.id_profile = uuidv4();
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
