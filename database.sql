-- psql --host=localhost --port=5432 --username=postgres --echo-all --file=database.sql

CREATE DATABASE service_dashboard_aether
WITH ENCODING 'UTF8'
     LC_COLLATE 'en_US.UTF-8'
     LC_CTYPE 'en_US.UTF-8'
     TEMPLATE template0;

\connect service_dashboard_aether;

DROP SCHEMA IF EXISTS public;
DROP ROLE IF EXISTS aether_account;
DROP ROLE IF EXISTS aether_product;
DROP ROLE IF EXISTS aether_content;

CREATE ROLE aether_account WITH LOGIN PASSWORD '### UPDATE ###';
CREATE ROLE aether_product WITH LOGIN PASSWORD '### UPDATE ###';
CREATE ROLE aether_content WITH LOGIN PASSWORD '### UPDATE ###';

GRANT ALL ON DATABASE service_dashboard_aether TO aether_account, aether_product, aether_content;

----------------------------------------------------- ACCOUNT MODULE

\connect service_dashboard_aether aether_account

CREATE SCHEMA account_data_schema;
CREATE SCHEMA account_read_schema;

-- DATA SCHEMA TABLES
CREATE TABLE IF NOT EXISTS account_data_schema.account (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  email TEXT[] NOT NULL,
  scope TEXT DEFAULT 'user',
  github_token TEXT NULL,
  document JSONB DEFAULT '{}'::JSONB,
  has_github_token BOOLEAN GENERATED ALWAYS AS (github_token IS NOT NULL) STORED,
  repositories JSONB DEFAULT '[]'::JSONB
);

CREATE UNIQUE INDEX account_id_account_idx
  ON account_data_schema.account (id_account);

CREATE UNIQUE INDEX account_email_idx
  ON account_data_schema.account (email);

CREATE TABLE IF NOT EXISTS account_data_schema.subscription (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_subscription UUID NOT NULL,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  document JSONB DEFAULT '{}'::JSONB,
  CONSTRAINT subscription_id_account_fkey FOREIGN KEY (id_account)
    REFERENCES account_data_schema.account (id_account) ON DELETE CASCADE
);

CREATE UNIQUE INDEX subscription_id_subscription_idx
  ON account_data_schema.subscription (id_subscription);

-- READ SCHEMA TABLE VIEWS
CREATE VIEW account_read_schema.account
AS SELECT
  id_account,
  created_at,
  updated_at,
  email,
  scope,
  document,
  has_github_token
FROM account_data_schema.account;

CREATE VIEW account_read_schema.subscription
AS SELECT
  id_subscription,
  id_account,
  created_at,
  updated_at,
  type,
  status,
  document
FROM account_data_schema.subscription;

----------------------------------------------------- PRODUCT MODULE

\connect service_dashboard_aether aether_product

CREATE SCHEMA product_data_schema;
CREATE SCHEMA product_read_schema;

-- DATA SCHEMA TABLES
CREATE TABLE IF NOT EXISTS product_data_schema.work (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_work UUID NOT NULL,
  id_account UUID NOT NULL,
  id_feature UUID NOT NULL,
  id_repository TEXT NOT NULL,
  id_pull_request TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  repository_name TEXT DEFAULT NULL,
  pull_request_name TEXT DEFAULT NULL,
  process_type TEXT NOT NULL,
  process_status TEXT DEFAULT 'idle',
  level NUMERIC(5, 2) NOT NULL DEFAULT 0,
  document JSONB DEFAULT '{}'::JSONB
);

CREATE UNIQUE INDEX work_id_work_idx
  ON product_data_schema.work (id_work);

CREATE TABLE IF NOT EXISTS product_data_schema.source (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_repository TEXT NOT NULL,
  id_account UUID NOT NULL,
  code_dump TEXT DEFAULT NULL,
  has_code_dump BOOLEAN GENERATED ALWAYS AS (code_dump IS NOT NULL) STORED
);

CREATE UNIQUE INDEX source_id_repository_idx
  ON product_data_schema.source (id_repository);

-- READ SCHEMA TABLE VIEWS
CREATE VIEW product_read_schema.work
AS SELECT
  id_work,
  id_account,
  id_feature,
  id_repository,
  id_pull_request,
  created_at,
  updated_at,
  name,
  repository_name,
  process_type,
  process_status,
  level,
  document
FROM product_data_schema.work;

CREATE VIEW product_read_schema.source
AS SELECT
  id_repository,
  id_account,
  code_dump,
  has_code_dump
FROM product_data_schema.source;

----------------------------------------------------- CONTENT MODULE

\connect service_dashboard_aether aether_content

CREATE SCHEMA content_data_schema;
CREATE SCHEMA content_read_schema;

-- DATA SCHEMA TABLES
CREATE TABLE IF NOT EXISTS content_data_schema.profile (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_profile UUID NOT NULL,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  document JSONB DEFAULT '{}'::JSONB
);

CREATE UNIQUE INDEX profile_id_profile_idx
  ON content_data_schema.profile (id_profile);

CREATE UNIQUE INDEX profile_id_account_idx
  ON content_data_schema.profile (id_account);

CREATE UNIQUE INDEX profile_username_idx
  ON content_data_schema.profile (username);

CREATE TABLE IF NOT EXISTS content_data_schema.feature (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_feature UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  process_type TEXT NOT NULL,
  subscription_scope TEXT[] NOT NULL,
  document JSONB DEFAULT '{}'::JSONB
);

-- READ SCHEMA VIEWS
CREATE VIEW content_read_schema.profile
AS SELECT
  id_profile,
  id_account,
  created_at,
  updated_at,
  username,
  name,
  document
FROM content_data_schema.profile;

CREATE VIEW content_read_schema.feature
AS SELECT
  id_feature,
  created_at,
  updated_at,
  name,
  process_type,
  subscription_scope,
  document
FROM content_data_schema.feature;

----------------------------------------------------- SETTING PRIVILEGES

\connect service_dashboard_aether postgres

GRANT USAGE ON SCHEMA account_data_schema TO aether_account;
GRANT SELECT, INSERT, UPDATE, DELETE ON account_data_schema.account TO aether_account;
GRANT SELECT, INSERT, UPDATE, DELETE ON account_data_schema.subscription TO aether_account;

GRANT USAGE ON SCHEMA product_data_schema TO aether_product;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_data_schema.work TO aether_product;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_data_schema.source TO aether_product;

GRANT USAGE ON SCHEMA content_data_schema TO aether_content;
GRANT SELECT, INSERT, UPDATE, DELETE ON content_data_schema.profile TO aether_content;
GRANT SELECT, INSERT, UPDATE, DELETE ON content_data_schema.feature TO aether_content;

GRANT USAGE ON SCHEMA account_read_schema TO aether_product, aether_content;
GRANT USAGE ON SCHEMA product_read_schema TO aether_account, aether_content;
GRANT USAGE ON SCHEMA content_read_schema TO aether_account, aether_product;

GRANT SELECT ON ALL TABLES IN SCHEMA account_read_schema TO aether_product, aether_content;
GRANT SELECT ON ALL TABLES IN SCHEMA product_read_schema TO aether_account, aether_content;
GRANT SELECT ON ALL TABLES IN SCHEMA content_read_schema TO aether_account, aether_product;