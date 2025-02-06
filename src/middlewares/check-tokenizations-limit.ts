import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CONTRACT_LIMIT_MESSAGES } from '@/config/messages/contract-limit-messages';
import { IS_OFFLINE } from '@/config';
import { countFilesBetweenTimestamps } from '@/repositories/file';
import createError from 'http-errors';
import { getSSMParameter } from '@/libs/aws/ssm';
import middy from '@middy/core';

const envContractStartValue = process.env.CONTRACT_START_UNIX_TS;
const envTokenizationLimitValue = process.env.TOKENIZATIONS_LIMIT;

const checkTokenizationsLimit = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async () => {
    if (!envContractStartValue || !envTokenizationLimitValue) {
      throw createError.BadRequest(CONTRACT_LIMIT_MESSAGES.MISSING_PARAMS);
    }

    const contractStart = IS_OFFLINE
      ? Number(envContractStartValue)
      : Number(await getSSMParameter(envContractStartValue));

    const tokenizationsLimit = IS_OFFLINE
      ? Number(envTokenizationLimitValue)
      : Number(await getSSMParameter(envTokenizationLimitValue));

    if (isNaN(contractStart)) {
      throw createError.BadRequest(CONTRACT_LIMIT_MESSAGES.NO_VALID_DATA_INIT);
    }
    if (isNaN(tokenizationsLimit)) {
      throw createError.BadRequest(CONTRACT_LIMIT_MESSAGES.NO_VALID_LIMIT);
    }
    const currentTimestamp = Date.now();

    const tokenizations = await countFilesBetweenTimestamps(contractStart, currentTimestamp);

    if (tokenizations === tokenizationsLimit) {
      throw createError(419, CONTRACT_LIMIT_MESSAGES.MAX_TOKENIZATIONS_LIMIT_REACH);
    }
  };

  return {
    before,
  };
};

export default checkTokenizationsLimit;
