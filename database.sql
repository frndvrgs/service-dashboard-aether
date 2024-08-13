-- psql --host=localhost --port=5432 --username=postgres --echo-all --file=database.sql

CREATE DATABASE aether_service_dashboard
WITH ENCODING 'UTF8'
     LC_COLLATE 'en_US.UTF-8'
     LC_CTYPE 'en_US.UTF-8'
     TEMPLATE template0;

\connect aether_service_dashboard;

DROP SCHEMA public;
DROP ROLE aether_service;

CREATE ROLE aether_service WITH LOGIN PASSWORD '123456';

CREATE SCHEMA service_schema AUTHORIZATION aether_service;
ALTER SCHEMA service_schema OWNER TO aether_service;

--------------------------------------------------------------------------------
-- ACCOUNT MODULE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS service_schema.account (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  scope TEXT DEFAULT 'user',
  document JSONB DEFAULT '{}'::JSONB
);

ALTER TABLE service_schema.account OWNER TO aether_service;

CREATE UNIQUE INDEX account_id_account_idx
  ON service_schema.account (id_account);

CREATE UNIQUE INDEX account_email_idx
  ON service_schema.account (email);

CREATE TABLE IF NOT EXISTS service_schema.subscription (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_subscription UUID NOT NULL,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  document JSONB DEFAULT '{}'::JSONB,
  CONSTRAINT subscription_id_account_fkey FOREIGN KEY (id_account)
    REFERENCES service_schema.account (id_account) ON DELETE CASCADE
);

ALTER TABLE service_schema.subscription OWNER TO aether_service;

CREATE UNIQUE INDEX subscription_id_subscription_idx
  ON service_schema.subscription (id_subscription);

CREATE VIEW service_schema.account_view
AS SELECT
  id_account,
  created_at,
  updated_at,
  email,
  scope,
  document
FROM service_schema.account;

ALTER VIEW service_schema.account_view OWNER TO aether_service;

CREATE VIEW service_schema.subscription_view
AS SELECT
  id_subscription,
  id_account,
  created_at,
  updated_at,
  type,
  status,
  document
FROM service_schema.subscription;

ALTER VIEW service_schema.subscription_view OWNER TO aether_service;

--------------------------------------------------------------------------------
-- PRODUCT MODULE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS service_schema.work (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_work UUID NOT NULL,
  id_account UUID NOT NULL,
  id_feature UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  level NUMERIC(5, 2) NOT NULL,
  document JSONB DEFAULT '{}'::JSONB,
  CONSTRAINT work_id_account_fkey FOREIGN KEY (id_account)
    REFERENCES service_schema.account (id_account) ON DELETE CASCADE
);

ALTER TABLE service_schema.work OWNER TO aether_service;

CREATE UNIQUE INDEX product_id_work_idx
  ON service_schema.work (id_work);

CREATE VIEW service_schema.work_view
AS SELECT
  id_work,
  id_account,
  id_feature,
  created_at,
  updated_at,
  name,
  level,
  document
FROM service_schema.work;

ALTER VIEW service_schema.work_view OWNER TO aether_service;

--------------------------------------------------------------------------------
-- CONTENT MODULE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS service_schema.profile (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_profile UUID NOT NULL,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  document JSONB DEFAULT '{}'::JSONB,
  CONSTRAINT profile_id_account_fkey FOREIGN KEY (id_account)
    REFERENCES service_schema.account (id_account) ON DELETE CASCADE
);

ALTER TABLE service_schema.profile OWNER TO aether_service;

CREATE UNIQUE INDEX profile_id_profile_idx
  ON service_schema.profile (id_profile);

CREATE UNIQUE INDEX profile_id_account_idx
  ON service_schema.profile (id_account);

CREATE UNIQUE INDEX profile_username_idx
  ON service_schema.profile (username);

CREATE TABLE IF NOT EXISTS service_schema.feature (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_feature UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  subscription_scope TEXT[] NOT NULL,
  document JSONB DEFAULT '{}'::JSONB
);

ALTER TABLE service_schema.feature OWNER TO aether_service;

CREATE VIEW service_schema.profile_view
AS SELECT
  id_profile,
  id_account,
  created_at,
  updated_at,
  username,
  name,
  document
FROM service_schema.profile;

ALTER VIEW service_schema.profile_view OWNER TO aether_service;

CREATE VIEW service_schema.feature_view
AS SELECT
  id_feature,
  created_at,
  updated_at,
  name,
  subscription_scope,
  document
FROM service_schema.feature;

ALTER VIEW service_schema.feature_view OWNER TO aether_service;
