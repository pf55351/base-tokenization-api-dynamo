import {
  checkIfTokenWithNameExistService,
  checkIfTokenWithSha256ExistService,
  createTokenService,
} from '@/services/file';
import { errorResponse, successResponse } from '@/utils/response';
import { APIGatewayEvent } from 'aws-lambda';
import { TOKEN_MESSAGES } from '@/config/messages/token-messages';
import { TokenRequestData } from '@/config/apiTypes';
import { baseCreateTokenValidationRules } from '@/utils/validation-rules';
import checkExpire from '@/middlewares/check-expire';
import createError from 'http-errors';
import { createTokenSchema } from '@/config/schemas.ts/tokens-schema';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import errorLogger from '@middy/error-logger';
import { getFolderIdByUUID } from '@/repositories/folder';
import httpErrorHandler from '@middy/http-error-handler';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import httpSecurityHeaders from '@middy/http-security-headers';
import inputOutputLogger from '@middy/input-output-logger';
import middy from '@middy/core';
import { responseSchema } from '@/config/schemas.ts/commons-schema';
import validator from '@middy/validator';

const createTokenRoute = async (event: APIGatewayEvent) => {
  try {
    const body = event.body as unknown as TokenRequestData;

    let folderId: number | undefined;
    let folderName: string | undefined;

    //Checks
    baseCreateTokenValidationRules(body);

    if (await checkIfTokenWithNameExistService(body.name)) {
      throw createError.BadRequest(TOKEN_MESSAGES.FILE_TOKENIZE_FILE_ALREADY_EXISTS);
    }

    if (await checkIfTokenWithSha256ExistService(body.file.content)) {
      throw createError.BadRequest(TOKEN_MESSAGES.FILE_TOKENIZE_SHA256_ALREADY_EXISTS);
    }

    if (body.folder_uuid) {
      const folder = await getFolderIdByUUID(body.folder_uuid);
      if (!folder) throw createError.BadRequest(TOKEN_MESSAGES.FILE_TOKENIZE_FOLDER_NOT_FOUND);
      folderId = folder.id;
      folderName = folder.name;
    }

    //Engine
    const res = await createTokenService(body, folderId, folderName);

    return successResponse(TOKEN_MESSAGES.FILE_TOKENIZE_SUCCESS, res);
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
  .use(httpMultipartBodyParser())
  .use(validator({ eventSchema: createTokenSchema }))
  .handler(createTokenRoute)
  .use(validator({ responseSchema }))
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(httpErrorHandler());
