import { ValidationError } from 'class-validator';
import { IApiError } from './api.error';
import { StatusCode } from './status.code';

export const COMMON_ERRORS = {
  COMM0001: {
    errorCode: 'COMM0001',
    message: 'Internal Server Error',
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
  },
  COMM0002: {
    errorCode: 'COMM0002',
    message: 'Validation Error',
    statusCode: StatusCode.BAD_REQUEST,
  },
  COMM0003: {
    errorCode: 'COMM0003',
    message: 'Endpoint Not Found Error',
    statusCode: StatusCode.NOT_FOUND,
  },
  COMM0004: {
    errorCode: 'COMM0004',
    message: 'Request Timeout',
    statusCode: StatusCode.REQUEST_TIMEOUT,
  },
  COMM0005: {
    errorCode: 'COMM0005',
    message: 'Invalid x-request-id',
    statusCode: StatusCode.BAD_REQUEST,
  },
  COMM0006: {
    errorCode: 'COMM0006',
    message: 'Missing authentication fields',
    statusCode: StatusCode.UNAUTHORIZED,
  },
  COMM0007: {
    errorCode: 'COMM0007',
    message: 'Service Unavailable',
    statusCode: StatusCode.SERVICE_UNAVAILABLE,
  },
} as const;

export const ValidationERROR = (message: string): IApiError => ({
  errorCode: 'COMM0002',
  message,
  statusCode: StatusCode.BAD_REQUEST,
});

export function getValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return 'Unknown validation error';
  }

  const firstError = errors[0];
  const { constraints } = firstError;

  if (!constraints) {
    return 'Unknown validation error';
  }

  const firstConstraintKey = Object.keys(constraints)[0];
  return constraints[firstConstraintKey];
}
