import createError from 'http-errors';
import { retrieveFileToS3 } from '@/libs/aws/s3';

const BUCKET_TEMPLATE = process.env.BUCKET_TEMPLATE;

export const getFontFromS3 = async (fontFile: string) => {
  if (!BUCKET_TEMPLATE) throw new Error('');
  console.log('BUCKET', BUCKET_TEMPLATE);
  console.log('file', `fonts/${fontFile}`);

  const content = await retrieveFileToS3(BUCKET_TEMPLATE, `fonts/${fontFile}`);
  if (!content) throw createError.InternalServerError('Failed to retrieve file from S3');
  const arrayByte = await content.Body?.transformToByteArray();
  return Buffer.from(arrayByte!);
};

export const getTemplateFromS3 = async (templateName: string) => {
  if (!BUCKET_TEMPLATE) throw new Error('');
  const content = await retrieveFileToS3(BUCKET_TEMPLATE, templateName);
  if (!content) throw createError.InternalServerError('Failed to retrieve file from S3');
  const arrayByte = await content.Body?.transformToByteArray();
  return Buffer.from(arrayByte!);
};
