import { DOWLOAD_CERTIFICATE_MESSAGES } from '@/config/messages/download-certificate-messages';
import { GENERAL_MESSAGES } from '@/config/messages/general-messages';
import { TOKEN_MESSAGES } from '@/config/messages/token-messages';
import createError from 'http-errors';
import { makeTokenizationCertification } from '@/libs/pdf';
import { retrieveFileToS3 } from '@/libs/aws/s3';
import { retrieveTokenService } from '@/services/file';

export const downloadCertificate = async (fileUUID: string) => {
  const tokenization = await retrieveTokenService(fileUUID);
  if (!tokenization || !tokenization.asset_id) {
    createError.InternalServerError(
      DOWLOAD_CERTIFICATE_MESSAGES.FILE_CERTIFICATE_DOWNLOAD_FILE_NOT_FOUND
    );
  }

  const { asset_id, name, description, sha256, created_at, wallet } = tokenization!;
  const content = await makeTokenizationCertification(
    asset_id,
    name,
    description,
    sha256!,
    created_at,
    wallet
  );
  return { fileName: name, content };
};

export const downloadFile = async (fileUUID: string) => {
  const tokenization = await retrieveTokenService(fileUUID);
  if (!tokenization) createError.InternalServerError(TOKEN_MESSAGES.TOKEN_NOT_FOUND);
  if (!tokenization?.s3) createError.InternalServerError(TOKEN_MESSAGES.FILE_NOT_IN_STORAGE);
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) throw new Error(GENERAL_MESSAGES.NO_BUCKET_FOUND);
  const content = await retrieveFileToS3(bucket, tokenization!.sha256);
  if (!content) throw createError.InternalServerError(GENERAL_MESSAGES.FONT_RETRIEVE_FAIL_S3);

  return {
    fileName: tokenization?.name,
    mimeType: content.ContentType || 'application/pdf',
    content: await content?.Body?.transformToByteArray(),
  };
};
