import { errorResponse, successResponse } from '@/utils/response';
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
import validator from '@middy/validator';

const SUCCESS_MESSAGE = "Api are running...C'mon You Know'";

const statusRoute = async () => {
  try {
    return successResponse(SUCCESS_MESSAGE, null);
  } catch (error) {
    console.error(error);
    return errorResponse(error);
  }
};

export const handler = middy()
  .use(doNotWaitForEmptyEventLoop({ runOnError: true }))
  .use(checkExpire())
  .use(httpSecurityHeaders())
  .use(httpHeaderNormalizer())
  .use(httpEventNormalizer())
  .handler(statusRoute)
  .use(validator({ responseSchema }))
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(httpErrorHandler());
