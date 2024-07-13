import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { COMMON_ERRORS } from '../errors/common.errors';
import { DOMAIN_ERRORS } from '../errors/domain.errors';

type CommonErrorKeys = keyof typeof COMMON_ERRORS;
type DomainErrorKeys = keyof typeof DOMAIN_ERRORS;

type ErrorType =
  | (typeof COMMON_ERRORS)[CommonErrorKeys]
  | (typeof DOMAIN_ERRORS)[DomainErrorKeys];

export function ApiErrorResponse(errors: Array<ErrorType>) {
  const errorResponses = errors.map((error) =>
    ApiResponse({
      status: error.statusCode,
      description: error.message,
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: error.errorCode },
              message: { type: 'string', example: error.message },
            },
          },
        },
      },
    }),
  );

  return applyDecorators(...errorResponses);
}
