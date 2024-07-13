import { IApiError } from './api.error';
import { StatusCode } from './status.code';

export const DOMAIN_ERRORS = {
  AUTH0001: {
    errorCode: 'AUTH0001',
    message: 'Unauthorized client',
    statusCode: StatusCode.UNAUTHORIZED,
  },
  DOMA0001: {
    errorCode: 'DOMA0001',
    message: 'Domain Not Found Error',
    statusCode: StatusCode.NOT_FOUND,
  },
} as const;

export const DOMA0001Error = (id: number): IApiError => ({
  errorCode: 'ACTI0001',
  message: `Company-Action id: ${id} not found error`,
  statusCode: StatusCode.NOT_FOUND,
});

export const DOMA0002Error = (id: number): IApiError => ({
  errorCode: 'ORGA0001',
  message: `Company id: ${id} not found error`,
  statusCode: StatusCode.NOT_FOUND,
});

export const DOMA0003Error = (index: number): IApiError => ({
  errorCode: 'ACTI0002',
  message: `Company-Action index: ${index} is duplicated`,
  statusCode: StatusCode.BAD_REQUEST,
});
