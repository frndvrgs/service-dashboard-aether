import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "product_data_schema", name: "source" })
export class SourceEntity implements CommonTypes.BaseEntity {
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id!: number;

  @Column()
  id_repository!: string;

  @Column("uuid")
  id_account!: string;

  @Column({ nullable: true })
  code_dump?: string;

  @Column({
    type: "boolean",
    generatedType: "STORED",
    asExpression: "code_dump IS NOT NULL",
  })
  has_code_dump!: boolean;
}
