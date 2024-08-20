import type { CommonTypes } from "@types";
import type { ObjectLiteral, FindOneOptions, DeleteResult } from "typeorm";

export interface RepositoryPort<
  T extends CommonTypes.BaseEntity & ObjectLiteral,
> {
  list(options?: CommonTypes.Payload.QueryOptions<T>): Promise<T[]>;
  read(options: CommonTypes.Payload.QueryOptions<T>): Promise<T | null>;
  exists(options: FindOneOptions<T>): Promise<boolean>;
  save(entity: T): Promise<T>;
  remove(idAccount: T["idAccount"]): Promise<DeleteResult>;
}
