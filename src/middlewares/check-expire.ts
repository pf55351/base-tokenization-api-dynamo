import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CONTRACT_EXPIRE_MESSAGES } from '@/config/messages/contract-expire-messages';
import { IS_OFFLINE } from '@/config';
import createError from 'http-errors';
import { getSSMParameter } from '@/libs/aws/ssm';
import middy from '@middy/core';

const envValue = process.env.CONTRACT_END_UNIX_TS;

const checkExpire = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async () => {
    if (!envValue) throw createError.BadRequest(CONTRACT_EXPIRE_MESSAGES.NO_VALID_DATA);
    const contractEnd = IS_OFFLINE ? Number(envValue) : Number(await getSSMParameter(envValue));

    if (isNaN(contractEnd)) {
      throw createError.BadRequest(CONTRACT_EXPIRE_MESSAGES.NO_VALID_DATA);
    }
    const currentTimestamp = Date.now();

    if (currentTimestamp > contractEnd) {
      throw createError(419, CONTRACT_EXPIRE_MESSAGES.CONTRACT_IS_EXPIRED);
    }
  };

  return {
    before,
  };
};

export default checkExpire;
