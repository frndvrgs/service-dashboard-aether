import {
  Repository,
  FindOneOptions,
  ObjectLiteral,
  DataSource,
  DeleteResult,
} from "typeorm";
import { queryTools } from "../interface/v1/helpers/query-tools";

import type { RepositoryPort } from "../ports/repository.port";
import type { CommonTypes } from "@types";

export interface BaseEntity {
  id: number;
}

export abstract class BaseRepository<T extends BaseEntity & ObjectLiteral>
  implements RepositoryPort<T>
{
  protected repository!: Repository<T>;

  constructor(private entityClass: new () => T) {}

  protected initialize(dataSource: DataSource) {
    this.repository = dataSource.getRepository(this.entityClass);
  }

  async list(options?: CommonTypes.Payload.QueryOptions<T>): Promise<T[]> {
    return this.repository.find(queryTools.buildFindOptions<T>(options));
  }

  async read(options?: CommonTypes.Payload.QueryOptions<T>): Promise<T | null> {
    return await this.repository.findOne(
      queryTools.buildFindOptions<T>(options),
    );
  }

  async exists(options: FindOneOptions<T>): Promise<boolean> {
    const count = await this.repository.count(options);
    return count > 0;
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async remove(idAccount: T["idAccount"]): Promise<DeleteResult> {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .where("id_account = :idAccount", { idAccount })
      .execute();
  }
}
