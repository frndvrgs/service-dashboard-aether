import { WhereInput, OrderInput } from "../common.dto";
import { FindManyOptions } from "typeorm";
import {
  FindOperator,
  Like,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Equal,
  In,
  IsNull,
  Not,
  Raw,
} from "typeorm";

type WhereCondition = {
  [key: string]: any | FindOperator<any> | WhereCondition;
};

type OrderCondition = {
  [key: string]: {
    direction: "ASC" | "DESC";
    nulls?: "NULLS FIRST" | "NULLS LAST";
  };
};

type OptionsInput = Partial<{
  where: WhereInput[];
  order: OrderInput[];
  relations: string[];
  select: string[];
  skip: number;
  take: number;
  withDeleted: boolean;
  cache: boolean;
}>;

type MappedQueryOptions<T> = {
  where?: WhereCondition;
  order?: OrderCondition;
  relations?: string[];
  select?: (keyof T)[];
  skip?: number;
  take?: number;
  withDeleted?: boolean;
  cache?: boolean;
};

/**
 * Creates a helper object for handling query options.
 *
 * @param allowedSelectFields - An array of allowed field names for select operations.
 * @returns An object containing helper functions for query options.
 *
 * @example
 * const helper = createQueryOptionsHelper<User>(['id', 'name', 'email', 'tags']);
 *
 * // Using where option
 * const whereOptions = helper.mapQueryOptions({
 *   where: {
 *     name: Like('%John%'),
 *     age: MoreThanOrEqual(18)
 *   }
 * });
 *
 * // Using where option with OR condition
 * const whereOrOptions = helper.mapQueryOptions({
 *   where: [
 *     { name: Like('%John%') },
 *     { name: Like('%Doe%') }
 *   ]
 * });
 *
 * // Using array_contains operator
 * const arrayContainsOptions = helper.mapQueryOptions({
 *   where: [
 *     {
 *       field: "tags",
 *       operator: "array_contains",
 *       value: "important"
 *     }
 *   ]
 * });
 *
 * // Using array_contains_like operator
 * const arrayContainsLikeOptions = helper.mapQueryOptions({
 *   where: [
 *     {
 *       field: "tags",
 *       operator: "array_contains_like",
 *       value: "imp"
 *     }
 *   ]
 * });
 *
 * // Using order option
 * const orderOptions = helper.mapQueryOptions({
 *   order: {
 *     name: "ASC",
 *     createdAt: { direction: "DESC", nulls: "NULLS LAST" }
 *   }
 * });
 *
 * // Using relations option
 * const relationsOptions = helper.mapQueryOptions({
 *   relations: ['profile', 'posts']
 * });
 *
 * // Using select option
 * const selectOptions = helper.mapQueryOptions({
 *   select: ['id', 'name', 'email']
 * });
 *
 * // Using skip and take for pagination
 * const paginationOptions = helper.mapQueryOptions({
 *   skip: 0,
 *   take: 10
 * });
 *
 * // Using withDeleted option
 * const withDeletedOptions = helper.mapQueryOptions({
 *   withDeleted: true
 * });
 *
 * // Using cache option
 * const cacheOptions = helper.mapQueryOptions({
 *   cache: true
 * });
 *
 * // Combining multiple options including array operators
 * const combinedOptions = helper.mapQueryOptions({
 *   where: [
 *     {
 *       field: "status",
 *       operator: "eq",
 *       value: "active"
 *     },
 *     {
 *       field: "age",
 *       operator: "gte",
 *       value: 18
 *     },
 *     {
 *       field: "tags",
 *       operator: "array_contains",
 *       value: "important"
 *     }
 *   ],
 *   order: {
 *     createdAt: "DESC"
 *   },
 *   relations: ['profile'],
 *   select: ['id', 'name', 'email', 'tags'],
 *   skip: 0,
 *   take: 10,
 *   withDeleted: false,
 *   cache: true
 * });
 */
const createQueryOptionsHelper = <T extends Record<string, any>>(
  allowedSelectFields: (keyof T)[],
) => {
  /**
   * Validates and filters the select fields based on allowed fields.
   *
   * @param select - An array of field names to select.
   * @returns An array of validated select fields or undefined.
   *
   */
  const validateSelect = (
    select: string[] | undefined,
  ): (keyof T)[] | undefined => {
    if (!select) return undefined;

    const validatedSelect = select.filter((key) =>
      allowedSelectFields.includes(key as keyof T),
    );

    return validatedSelect as (keyof T)[];
  };

  /**
   * Maps WhereInput array to WhereCondition object.
   *
   * @param whereInput - An array of WhereInput objects.
   * @returns A WhereCondition object compatible with TypeORM's FindManyOptions.
   *
   */
  const mapWhereInput = (whereInput: WhereInput[]): WhereCondition => {
    return whereInput.reduce<WhereCondition>((acc, condition) => {
      if (condition.conditions) {
        // handle nested conditions
        acc[condition.field || ""] = mapWhereInput(condition.conditions);
      } else if (condition.field) {
        // handle individual condition
        acc[condition.field] = mapOperator(
          condition.operator || "eq",
          condition.value,
        );
      }
      return acc;
    }, {});
  };

  /**
   * Maps operator string to TypeORM FindOperator.
   *
   * @param operator - The operator string.
   * @param value - The value to apply the operator to.
   * @returns A TypeORM FindOperator or the raw value.
   */
  const mapOperator = (
    operator: string,
    value: any,
  ): FindOperator<any> | any => {
    switch (operator.toLowerCase()) {
      case "eq":
        return Equal(value);
      case "array_contains":
        return Raw((alias) => `${value} = ANY(${alias})`, { value });
      case "array_contains_like":
        return Raw(
          (alias) =>
            `EXISTS (SELECT 1 FROM unnest(${alias}) AS element WHERE element LIKE :value)`,
          { value: `%${value}%` },
        );
      case "like":
        return Like(value);
      case "ilike":
        return Raw((alias) => `LOWER(${alias}) LIKE LOWER(:value)`, {
          value: `%${value}%`,
        });
      case "lt":
        return LessThan(value);
      case "lte":
        return LessThanOrEqual(value);
      case "gt":
        return MoreThan(value);
      case "gte":
        return MoreThanOrEqual(value);
      case "in":
        return In(value);
      case "isnull":
        return IsNull();
      case "not":
        return Not(value);
      default:
        return value;
    }
  };

  /**
   * Maps OrderInput array to OrderCondition object.
   *
   * @param orderInput - An array of OrderInput objects.
   * @returns An OrderCondition object.
   *
   */
  const mapOrderInput = (orderInput: OrderInput[]): OrderCondition => {
    return orderInput.reduce<OrderCondition>(
      (acc, { field, direction, nulls }) => {
        acc[field] = { direction, ...(nulls && { nulls }) };
        return acc;
      },
      {},
    );
  };

  /**
   * Maps query options to a format compatible with the database query.
   *
   * @param options - An object containing various query options.
   * @returns A mapped object with query options.
   *
   */
  const mapQueryOptions = (options?: OptionsInput): MappedQueryOptions<T> => {
    if (!options) return {};

    return {
      where: options.where ? mapWhereInput(options.where) : undefined,
      order: options.order ? mapOrderInput(options.order) : undefined,
      relations: options.relations,
      select: options.select ? validateSelect(options.select) : undefined,
      skip: options.skip,
      take: options.take,
      withDeleted: options.withDeleted,
      cache: options.cache,
    };
  };

  return {
    mapQueryOptions,
    validateSelect,
    mapWhereInput,
    mapOrderInput,
  };
};

/**
 * Builds FindManyOptions object from QueryOptions.
 *
 * @param options - QueryOptions object.
 * @returns FindManyOptions object.
 *
 */
const buildFindOptions = <T>(
  options?: CommonTypes.Payload.QueryOptions<T>,
): FindManyOptions<T> => {
  if (!options) return {};

  const { where, order, relations, select, skip, take, withDeleted, cache } =
    options;

  return {
    ...(where && { where }),
    ...(order && { order }),
    ...(relations && { relations }),
    ...(select && { select }),
    ...(typeof skip !== "undefined" && { skip }),
    ...(typeof take !== "undefined" && { take }),
    ...(typeof withDeleted !== "undefined" && { withDeleted }),
    ...(typeof cache !== "undefined" && { cache }),
  } as FindManyOptions<T>;
};

export const queryTools = {
  createQueryOptionsHelper,
  buildFindOptions,
};
