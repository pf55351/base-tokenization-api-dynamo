import { TokenRequestData, mimeTypes } from '@/config/apiTypes';
import { TOKEN_MESSAGES } from '@/config/messages/token-messages';
import createError from 'http-errors';

const MAX_FILE_SIZE = 10000000 as const; 
export const baseCreateTokenValidationRules = (request: TokenRequestData) => {
  const { name, description, file } = request;
  const fileSize = file.content.length
  if (name.length < 3) {
    throw createError.BadRequest(TOKEN_MESSAGES.FILE_TOKENIZE_FILE_NAME_BELOW_MIN_LENGTH);
  }
  if (name.length > 50) {
    throw createError.BadRequest(TOKEN_MESSAGES.FILE_TOKENIZE_FILE_NAME_EXCEEDS_MAX_LENGTH);
  }
  if (description.length > 100) {
    throw createError.BadRequest(TOKEN_MESSAGES.FILE_TOKENIZE_FILE_DESCRIPTION_EXCEEDS_MAX_LENGTH);
  }

  if (!mimeTypes.includes(file.mimetype))
    throw createError.BadRequest(TOKEN_MESSAGES.FILE_TOKENIZE_INVALID_MIMETYPE);

   if (fileSize > MAX_FILE_SIZE)
    throw createError.BadRequest(TOKEN_MESSAGES.FILE_SIZE_EXCEEDS_MAX_SIZE); 
};
