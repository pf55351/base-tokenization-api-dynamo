import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DOWLOAD_CERTIFICATE_MESSAGES } from '@/config/messages/download-certificate-messages';
import { FILE_UUID_LENGHT } from '@/config';
import { FilePath } from '@/config/apiTypes';
import checkExpire from '@/middlewares/check-expire';
import createError from 'http-errors';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import { downloadFile } from '@/services/download';
import errorLogger from '@middy/error-logger';
import { errorResponse } from '@/utils/response';
import httpErrorHandler from '@middy/http-error-handler';
import httpSecurityHeaders from '@middy/http-security-headers';
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser';
import inputOutputLogger from '@middy/input-output-logger';
import middy from '@middy/core';
import { responseSchema } from '@/config/schemas.ts/commons-schema';
import validator from '@middy/validator';

const dowloadTokenizationFileRoute = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { fileUUID } = event.pathParameters as unknown as FilePath;
    if (!fileUUID || fileUUID.length !== FILE_UUID_LENGHT)
      throw createError.BadRequest(DOWLOAD_CERTIFICATE_MESSAGES.FILE_CERTIFICATE_DOWNLOAD_ID_FOUND);
    const res = await downloadFile(fileUUID);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': res.mimeType ?? 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${res.fileName}"`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      body: Buffer.from(res.content!).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error(error);
    return errorResponse(error);
  }
};

export const handler = middy()
  .use(doNotWaitForEmptyEventLoop({ runOnError: true }))
  .use(checkExpire())
  .use(httpSecurityHeaders())
  .use(httpUrlEncodePathParser())
  .handler(dowloadTokenizationFileRoute)
  .use(validator({ responseSchema }))
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(httpErrorHandler());
