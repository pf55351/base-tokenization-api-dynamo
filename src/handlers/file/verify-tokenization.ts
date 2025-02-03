import { errorResponse, successResponse } from '@/utils/response';
import { APIGatewayEvent } from 'aws-lambda';
import { TOKEN_MESSAGES } from '@/config/messages/token-messages';
import { TokenRequestData } from '@/config/apiTypes';
import checkExpire from '@/middlewares/check-expire';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import errorLogger from '@middy/error-logger';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import httpSecurityHeaders from '@middy/http-security-headers';
import inputOutputLogger from '@middy/input-output-logger';
import middy from '@middy/core';
import { responseSchema } from '@/config/schemas.ts/commons-schema';
import validator from '@middy/validator';
import { verifyService } from '@/services/file';
import { verifyTokenizationSchema } from '@/config/schemas.ts/tokens-schema';

const verifyTokenizationRoute = async (event: APIGatewayEvent) => {
  try {
    const body = event.body as unknown as TokenRequestData;

    //Engine
    const res = await verifyService(body.file.content);

    return successResponse(
      res ? TOKEN_MESSAGES.FILE_VERIFY_SUCCESS : TOKEN_MESSAGES.FILE_VERIFY_FILE_NOT_FOUND,
      res
    );
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
  .use(httpMultipartBodyParser())
  .use(validator({ eventSchema: verifyTokenizationSchema }))
  .handler(verifyTokenizationRoute)
  .use(validator({ responseSchema }))
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(httpErrorHandler());
