import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CONTRACT_EXPIRE_MESSAGES } from '@/config/messages/contract-expire-messages';
import createError from 'http-errors';
import middy from '@middy/core';

const CONTRACT_EXPIRE_TS = Number(process.env.CONTRACT_EXPIRE_UNIX_TS);

const checkExpire = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async () => {
    if (isNaN(CONTRACT_EXPIRE_TS)) {
      throw createError.BadRequest(CONTRACT_EXPIRE_MESSAGES.NO_VALID_DATA);
    }
    const currentTimestamp = Date.now();

    if (currentTimestamp > CONTRACT_EXPIRE_TS) {
      throw createError(419, CONTRACT_EXPIRE_MESSAGES.CONTRACT_IS_EXPIRED);
    }
  };

  return {
    before,
  };
};

export default checkExpire;
