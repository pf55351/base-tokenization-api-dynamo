import { ErrorResponseBody, SuccesResponseBody } from './type';

import { APIGatewayProxyResult } from 'aws-lambda';
import { HttpError } from 'http-errors';

const SUCCESS_CODE = 200;
const INTERNAL_SERVER_ERROR_CODE = 500;
const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';

export const errorResponse = (error: unknown): APIGatewayProxyResult => {
  const statusCode = error instanceof HttpError ? error.status : INTERNAL_SERVER_ERROR_CODE;
  const errorMessage = error instanceof HttpError ? error.message : INTERNAL_SERVER_ERROR_MESSAGE;
  return {
    statusCode,
    body: JSON.stringify({
      error: errorMessage,
      status_code: statusCode,
    } as ErrorResponseBody),
  };
};

export const successResponse = <T>(message: string, data: T): APIGatewayProxyResult => {
  const body: SuccesResponseBody<T> = {
    status_code: SUCCESS_CODE,
    message,
    payload: {
      data,
    },
  };
  return {
    statusCode: SUCCESS_CODE,
    body: JSON.stringify(body),
  };
};
