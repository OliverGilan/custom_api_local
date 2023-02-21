-- Give the census user the ability to sign in with a password
CREATE USER CENSUS WITH PASSWORD 'pass';

-- Create a private bookkeeping schema where Census can store sync state
CREATE SCHEMA CENSUS;

-- Give the census user full access to the bookkeeping schema
GRANT ALL ON SCHEMA CENSUS TO CENSUS;

-- Ensure the census user has access to any objects that may have already existed in the bookkeeping schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA CENSUS TO CENSUS;

-- Let the census user see this schema
GRANT USAGE ON SCHEMA "gsheets" TO CENSUS;

-- Let the census user read all existing tables in this schema
GRANT SELECT ON ALL TABLES IN SCHEMA "gsheets" TO CENSUS;

-- Let the census user read any new tables added to this schema
ALTER DEFAULT PRIVILEGES IN SCHEMA "gsheets" GRANT SELECT ON TABLES TO CENSUS;

-- Let the census user execute any existing functions in this schema
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA "gsheets" TO CENSUS;

-- Let the census user execute any new functions added to this schema
ALTER DEFAULT PRIVILEGES IN SCHEMA "gsheets" GRANT EXECUTE ON FUNCTIONS TO CENSUS;

create schema if not exists gsheets;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists gsheets.types (
  id bigserial primary key,
  bignum bigint not null,
  bits varbit(5) not null,
  truthy boolean not null,
  letter character not null,
  string text not null,
  ip cidr not null,
  day date not null default CURRENT_DATE,
  precise float8 not null,
  num integer not null,
  jsonobject json not null,
  decimals decimal not null,
  single float4 not null,
  notz time not null default CURRENT_TIME,
  tz timetz not null default CURRENT_TIME,
  stamp timestamp not null default CURRENT_TIMESTAMP,
  stampz timestamptz not null default CURRENT_TIMESTAMP,
  uniquely uuid default uuid_generate_v4()
);

insert into gsheets.types values(
  500000,
  600000,
  B'10001',
  false,
  'c',
  'this is a long string',
  '192.168/24',
  CURRENT_DATE,
  1.24847,
  8,
  '{"key":"value", "key2": 2}',
  45.26,
  1.99,
  CURRENT_TIME,
  CURRENT_TIME,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

insert into gsheets.types values(
  200000,
  300000,
  B'10101',
  true,
  'p',
  'this is an even longer string with special characters C:\\ + - % cheese ! yeet #$@^**(',
  '2001:4f8:3:ba::/64',
  CURRENT_DATE,
  1.24847,
  8,
  '{"key":[], "key2": {"key3": true}}',
  45.26,
  1.99,
  CURRENT_TIME,
  CURRENT_TIME,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);