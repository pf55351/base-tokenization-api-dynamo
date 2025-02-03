import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ALLOWED_MIMETYPES } from '@/config/apiTypes';
import { IS_OFFLINE } from '@/config';
import { offlineConfig } from '@/libs/aws/s3/offline-config';

let client: S3Client;

const s3ClientConfig = IS_OFFLINE ? offlineConfig : null;

const initS3Client = () => {
  if (client instanceof S3Client) return client;

  client = new S3Client({ ...s3ClientConfig });
  return client;
};

export const uploadFileToS3 = async (
  bucket: string,
  fileKey: string,
  content: Buffer,
  mimeType: ALLOWED_MIMETYPES
) => {
  try {
    const s3Client = initS3Client();
    const response = await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: content,
        ContentType: mimeType,
      })
    );
    return response.$metadata.httpStatusCode === 200;
  } catch (error) {
    console.error(error);
  }
};

export const retrieveFileToS3 = async (bucket: string, fileKey: string | null) => {
  try {
    if (fileKey === null) throw new Error('File key not found');
    const s3Client = initS3Client();
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      })
    );
    const { ContentType, Body } = response;
    return { ContentType, Body };
  } catch (error) {
    console.error(error);
  }
};
