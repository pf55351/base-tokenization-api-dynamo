import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '@/utils/response';
import { Search } from '@/config/apiTypes';
import { TOKEN_MESSAGES } from '@/config/messages/token-messages';
import checkExpire from '@/middlewares/check-expire';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import errorLogger from '@middy/error-logger';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import inputOutputLogger from '@middy/input-output-logger';
import middy from '@middy/core';
import { responseSchema } from '@/config/schemas.ts/commons-schema';
import { retrieveTokensService } from '@/services/file';
import validator from '@middy/validator';

const getTokenizationsRoute = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { search } = event.queryStringParameters as unknown as Search;
    const res = await retrieveTokensService(search);
    return successResponse(TOKEN_MESSAGES.FILES_SUCCESS, res);
  } catch (error) {
    console.error(error);
    return errorResponse(error);
  }
};

export const handler = middy()
  .use(doNotWaitForEmptyEventLoop({ runOnError: true }))
  .use(checkExpire())
  .use(httpSecurityHeaders())
  .use(httpEventNormalizer())
  .use(httpHeaderNormalizer())
  .handler(getTokenizationsRoute)
  .use(validator({ responseSchema }))
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(httpErrorHandler());
