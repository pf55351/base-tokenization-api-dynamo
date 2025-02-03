import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { addFolderService, findFolderByNameService } from '@/services/folder';
import { errorResponse, successResponse } from '@/utils/response';
import { FOLDER_MESSAGES } from '@/config/messages/folder-messages';
import { addFolderSchema } from '@/config/schemas.ts/folders-schema';
import checkExpire from '@/middlewares/check-expire';
import createError from 'http-errors';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import errorLogger from '@middy/error-logger';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import inputOutputLogger from '@middy/input-output-logger';
import jsonBodyParser from '@middy/http-json-body-parser';
import middy from '@middy/core';
import { responseSchema } from '@/config/schemas.ts/commons-schema';
import validator from '@middy/validator';

interface FolderRequestData {
  folder_name: string;
}

interface FolderResponseData {
  uuid: string;
  name: string;
}

const createFolderRoute = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body as unknown as FolderRequestData;

    const { folder_name } = body;
    if (await findFolderByNameService(folder_name))
      throw createError.UnprocessableEntity(FOLDER_MESSAGES.FOLDER_ADD_FOLDER_ALREADY_EXISTS);

    const res = (await addFolderService(folder_name)) as FolderResponseData;
    return successResponse(FOLDER_MESSAGES.FOLDER_ADD_SUCCESS, res);
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
  .use(jsonBodyParser())
  .use(validator({ eventSchema: addFolderSchema }))
  .handler(createFolderRoute)
  .use(validator({ responseSchema }))
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(httpErrorHandler());
