import { FileModel, IFile } from '@/libs/aws/dynamo/models/file-model';
import { ALLOWED_MIMETYPES } from '@/config/apiTypes';

export const addToken = async (
  name: string,
  description: string,
  size: number,
  sha256: string,
  mimetype: ALLOWED_MIMETYPES,
  s3: boolean,
  asset_id: number,
  metadata_cid: string,
  file_name: string,
  wallet: string,
  folder_id?: number
) => {
  const token = new FileModel({
    name,
    description,
    size,
    sha256,
    mimetype,
    s3,
    asset_id,
    metadata_cid,
    folder_id,
    file_name,
    wallet,
  });
  await token.save();
  return token;
};

export const isTokenSha256Exist = async (sha256: string) => {
  const token = await FileModel.query('sha256').eq(sha256).limit(1).exec();
  return token.count > 0;
};

export const isTokenNameExist = async (name: string) => {
  const token = await FileModel.query('name').eq(name).limit(1).exec();
  return token.count > 0;
};

export const verify = async (sha256: string) => {
  const token = await FileModel.query('sha256').eq(sha256).limit(1).exec();
  return token[0] as IFile;
};

export const getToken = async (fileUUID: string) => {
  const token = await FileModel.query('uuid').eq(fileUUID).limit(1).exec();
  return token[0] as IFile;
};

export const getTokens = async (search?: string) => {
  // Add search conditions if search parameter is provided
  const queryParams = search
    ? {
        FilterExpression: 'contains(#name, :search) OR contains(#fileName, :search)',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#fileName': 'file_name',
        },
        ExpressionAttributeValues: {
          ':search': search,
        },
      }
    : {};

  const files = await FileModel.scan(queryParams).exec();
  return files;
};
