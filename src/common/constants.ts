export const TEXT_LENGTH = {
  ACCOUNT: {
    EMAIL: {
      MIN: 8,
      MAX: 256,
    },
    PASSWORD: {
      MIN: 6,
      MAX: 128,
    },
  },
  WORK: {
    NAME: {
      MIN: 4,
      MAX: 64,
    },
  },
  PROFILE: {
    NAME: {
      MIN: 4,
      MAX: 64,
    },
    USERNAME: {
      MIN: 4,
      MAX: 64,
    },
  },
  FEATURE: {
    NAME: {
      MIN: 4,
      MAX: 64,
    },
  },
};

export const ENUM = {
  SUBSCRIPTION: {
    TYPE: {
      FREE: "FREE",
      BASIC: "BASIC",
      CORPORATE: "CORPORATE",
    },
    STATUS: {
      ACTIVE: "ACTIVE",
      INACTIVE: "INACTIVE",
      CANCELED: "CANCELED",
    },
  },
};

export const FIELD_LENGTH = {
  SELECT: {
    MAX: 256,
  },
};

export const REQUEST_LIMITS = {
  PAYLOAD: {
    KB32: 32768,
    KB64: 65536,
    KB128: 131072,
    KB512: 524288,
    MB1: 1048576,
    MB2: 2097152,
  },
};

export enum DescriptionCodes {
  ACCOUNT_CREATED = "ACCOUNT_CREATED",
  ACCOUNT_UPDATED = "ACCOUNT_UPDATED",
  ACCOUNT_REMOVED = "ACCOUNT_REMOVED",
  SESSION_CREATED = "SESSION_CREATED",
  SESSION_VERIFIED = "SESSION_VERIFIED",
  SESSION_REMOVED = "SESSION_REMOVED",
  INVALID_SESSION = "INVALID_SESSION",
  SUBSCRIPTION_CREATED = "SUBSCRIPTION_CREATED",
  SUBSCRIPTION_UPDATED = "SUBSCRIPTION_UPDATED",
  SUBSCRIPTION_REMOVED = "SUBSCRIPTION_REMOVED",
  INVALID_SUBSCRIPTION_TYPE = "INVALID_SUBSCRIPTION_TYPE",
  INVALID_SUBSCRIPTION_STATUS = "INVALID_SUBSCRIPTION_STATUS",
  WORK_CREATED = "WORK_CREATED",
  WORK_UPDATED = "WORK_UPDATED",
  WORK_REMOVED = "WORK_REMOVED",
  WORKS_LISTED = "WORKS_LISTED",
  PROFILE_CREATED = "PROFILE_CREATED",
  PROFILE_UPDATED = "PROFILE_UPDATED",
  PROFILE_REMOVED = "PROFILE_REMOVED",
  FEATURE_CREATED = "FEATURE_CREATED",
  FEATURE_UPDATED = "FEATURE_UPDATED",
  FEATURE_REMOVED = "FEATURE_REMOVED",
  UNAVAILABLE_FEATURES = "UNAVAILABLE_FEATURES",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  NOT_AUTHORIZED = "NOT_AUTHORIZED",
  INVALID_AUTH_TOKEN = "INVALID_AUTH_TOKEN",
  INVALID_AUTH_SCOPE = "INVALID_AUTH_SCOPE",
  INVALID_SIGNATURE = "INVALID_SIGNATURE",
  EXPIRED_TOKEN = "EXPIRED_TOKEN",
  INACTIVE_TOKEN = "INACTIVE_TOKEN",
  SET_AUTHENTICATION_ERROR = "SET_AUTHENTICATION_ERROR",
  RESOURCE_READ = "RESOURCE_READ",
  COLLECTION_LISTED = "COLLECTION_LISTED",
  INVALID_INPUT = "INVALID_INPUT",
  INVALID_VALUE = "INVALID_VALUE",
  INVALID_VALUE_LENGTH = "INVALID_VALUE_LENGTH",
  INVALID_VALUE_FORMAT = "INVALID_VALUE_FORMAT",
  NON_NULLABLE_VALUE = "NON_NULLABLE_VALUE",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  DATABASE_CLIENT_ERROR = "DATABASE_CLIENT_ERROR",
  WEB_SERVER_ERROR = "WEB_SERVER_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  NOT_FOUND = "NOT_FOUND",
  NOTHING_FOUND = "NOTHING_FOUND",
  NOT_UNIQUE_VALUE = "NOT_UNIQUE_VALUE",
  DUPLICATED = "DUPLICATED",
  NOT_ALLOWED = "NOT_ALLOWED",
  MISSING_PAYLOAD = "MISSING_PAYLOAD",
  MISSING_ENCRYPTION_KEY = "MISSING_ENCRYPTION_KEY",
  GITHUB_API_ERROR = "GITHUB_API_ERROR",
  INVALID_COMMAND = "INVALID_COMMAND",
  WORK_COMMAND_PROCESSED = "WORK_COMMAND_PROCESSED",
}

export enum StatusCodes {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLY_HINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418,
  AUTHENTICATION_TIMEOUT = 419,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

// export type DescriptionCode = keyof typeof DESCRIPTION_CODES;
// export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
