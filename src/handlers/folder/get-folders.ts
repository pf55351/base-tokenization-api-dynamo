import { errorResponse, successResponse } from '@/utils/response';

import { APIGatewayProxyResult } from 'aws-lambda';
import { FOLDER_MESSAGES } from '@/config/messages/folder-messages';
import checkExpire from '@/middlewares/check-expire';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import errorLogger from '@middy/error-logger';
import { getFoldersService } from '@/services/folder';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import inputOutputLogger from '@middy/input-output-logger';
import middy from '@middy/core';
import { responseSchema } from '@/config/schemas.ts/commons-schema';
import validator from '@middy/validator';

const getFoldersRoute = async (): Promise<APIGatewayProxyResult> => {
  try {
    const res = await getFoldersService();
    return successResponse(FOLDER_MESSAGES.FOLDERS_SUCCESS, res);
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
  .handler(getFoldersRoute)
  .use(validator({ responseSchema }))
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(httpErrorHandler());
