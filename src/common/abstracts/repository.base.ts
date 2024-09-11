import {
  Repository,
  FindOneOptions,
  ObjectLiteral,
  DataSource,
  DeleteResult,
} from "typeorm";
import { queryTools } from "../interface/v1/helpers/query-tools";

import type { RepositoryPort } from "../ports/repository.port";

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

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async remove<K extends keyof T>(
    fieldName: K,
    value: T[K],
  ): Promise<DeleteResult> {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .where(`${String(fieldName)} = :value`, { value })
      .execute();
  }
}
