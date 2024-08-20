import type { DataSourceOptions } from "typeorm";

const createConnectionMessage = (
  dataSource: DataSourceOptions,
  step: string,
) => {
  const options = dataSource as DataSourceOptions & {
    host: string;
    port: number;
    username: string;
    database: string;
  };
  return `database connection at ${options.host}:${options.port} | ${step.toUpperCase()} | ${options.username} -> ${options.database}`;
};

export const databaseTools = {
  createConnectionMessage,
};
