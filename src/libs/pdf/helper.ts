import { GENERAL_MESSAGES } from '@/config/messages/general-messages';
import createError from 'http-errors';
import { retrieveFileToS3 } from '@/libs/aws/s3';

const BUCKET_TEMPLATE = process.env.BUCKET_TEMPLATE;

export const getFontFromS3 = async (fontFile: string) => {
  if (!BUCKET_TEMPLATE) throw new Error(GENERAL_MESSAGES.FONT_RETRIEVE_FAIL);

  const content = await retrieveFileToS3(BUCKET_TEMPLATE, `fonts/${fontFile}`);
  if (!content) throw createError.InternalServerError(GENERAL_MESSAGES.FONT_RETRIEVE_FAIL_S3);
  const arrayByte = await content.Body?.transformToByteArray();
  return Buffer.from(arrayByte!);
};

export const getTemplateFromS3 = async (templateName: string) => {
  if (!BUCKET_TEMPLATE) throw new Error(GENERAL_MESSAGES.TEMPLATE_RETRIEVE_FAIL_S3);
  const content = await retrieveFileToS3(BUCKET_TEMPLATE, templateName);
  if (!content) throw createError.InternalServerError(GENERAL_MESSAGES.TEMPLATE_RETRIEVE_FAIL_S3);
  const arrayByte = await content.Body?.transformToByteArray();
  return Buffer.from(arrayByte!);
};
