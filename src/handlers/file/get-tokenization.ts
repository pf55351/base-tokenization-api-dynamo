import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '@/utils/response';
import { FILE_UUID_LENGHT } from '@/config';
import { FilePath } from '@/config/apiTypes';
import { TOKEN_MESSAGES } from '@/config/messages/token-messages';
import checkExpire from '@/middlewares/check-expire';
import createError from 'http-errors';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import errorLogger from '@middy/error-logger';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import inputOutputLogger from '@middy/input-output-logger';
import middy from '@middy/core';
import { responseSchema } from '@/config/schemas.ts/commons-schema';
import { retrieveTokenService } from '@/services/file';
import validator from '@middy/validator';

const getTokenizationRoute = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { fileUUID } = event.pathParameters as unknown as FilePath;
    if (!fileUUID || fileUUID.length !== FILE_UUID_LENGHT)
      throw createError.BadRequest(TOKEN_MESSAGES.FILE_UUID_NOT_FOUND);

    const res = await retrieveTokenService(fileUUID);
    return successResponse(TOKEN_MESSAGES.FILE_SUCCESS, res);
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
  .handler(getTokenizationRoute)
  .use(validator({ responseSchema }))
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(httpErrorHandler());
