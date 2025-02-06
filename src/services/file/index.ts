/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  addToken,
  getToken,
  getTokens,
  isTokenNameExist,
  isTokenSha256Exist,
  verify,
} from '@/repositories/file';
import { calculateSha256HexFromFile, foldSha256 } from '@/utils/blockchain';
import { ALGO_EXPLORER } from '@/config';
import { GENERAL_MESSAGES } from '@/config/messages/general-messages';
import { TOKEN_MESSAGES } from '@/config/messages/token-messages';
import { TokenRequestData } from '@/config/apiTypes';
import createError from 'http-errors';
import { createNftTokenArc3 } from '@/libs/algorand';
import { uploadFileToS3 } from '@/libs/aws/s3';

export const createTokenService = async (
  data: TokenRequestData,
  folderId: string | undefined,
  folderName: string | undefined
) => {
  const { name, description, is_file_stored, file } = data;
  const isFileStored = is_file_stored === 'true';

  const fileHashSha256 = calculateSha256HexFromFile(file.content).toString('hex');
  if (isFileStored) {
    const bucket = process.env.BUCKET_NAME;
    if (!bucket) throw new Error(GENERAL_MESSAGES.NO_BUCKET_FOUND);
    const isUploaded = await uploadFileToS3(bucket, fileHashSha256, file.content, file.mimetype);
    if (!isUploaded)
      throw createError.InternalServerError(TOKEN_MESSAGES.FILE_FAILED_TO_UPLOAD_ON_S3);
  }

  const assetName = foldSha256(fileHashSha256);

  const nftToken = await createNftTokenArc3(
    name,
    assetName,
    description,
    isFileStored,
    fileHashSha256
  );

  const { signer, cid } = nftToken;

  const token = await addToken(
    name,
    description,
    file.content.length,
    fileHashSha256,
    file.mimetype,
    isFileStored,
    Number(nftToken.assetIndex),
    cid,
    file.filename,
    signer,
    folderId
  );

  const { asset_id, s3, sha256, uuid, file_name } = token;
  return {
    asset_id,
    description,
    folder: folderName ?? '',
    is_file_stored: s3,
    name,
    sha256,
    uuid,
    file_name,
    token_url: `${ALGO_EXPLORER}/asset/${asset_id}`,
  };
};

export const checkIfTokenWithSha256ExistService = async (fileContent: Buffer) => {
  const sha256 = calculateSha256HexFromFile(fileContent).toString('hex');
  return await isTokenSha256Exist(sha256);
};

export const checkIfTokenWithNameExistService = async (name: string) => {
  return await isTokenNameExist(name);
};

export const verifyService = async (fileContent: Buffer) => {
  const sha256 = calculateSha256HexFromFile(fileContent).toString('hex');
  const token = await verify(sha256);
  if (!token) return null;

  const { asset_id, description, name } = token;
  return {
    asset_id,
    description,
    token_url: `${ALGO_EXPLORER}/asset/${asset_id}`,
    name,
    sha256,
  };
};

export const retrieveTokensService = async (search?: string) => {
  const tokens = await getTokens(search);
  const tokensResponse = tokens.map((token) => {
    const { description, name, asset_id, s3, sha256, uuid, file_name } = token;
    return {
      asset_id,
      description,
      is_file_stored: s3,
      name,
      sha256,
      uuid,
      file_name,
      token_url: `${ALGO_EXPLORER}/asset/${asset_id}`,
    };
  });

  return tokensResponse;
};

export const retrieveTokenService = async (fileUUID: string) => {
  const token = await getToken(fileUUID);
  if (!token) return undefined;

  const { folder_id, size, ...response } = token;
  return { ...response };
};
