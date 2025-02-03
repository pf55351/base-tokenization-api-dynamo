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
import { TOKEN_MESSAGES } from '@/config/messages/token-messages';
import { TokenRequestData } from '@/config/apiTypes';
import createError from 'http-errors';
import { createNftTokenArc3 } from '@/libs/algorand';
import { uploadFileToS3 } from '@/libs/aws/s3';

export const createTokenService = async (
  data: TokenRequestData,
  folderId: number | undefined,
  folderName: string | undefined
) => {
  const { name, description, is_file_stored, file } = data;
  const isFileStored = is_file_stored === 'true';

  const fileHashSha256 = calculateSha256HexFromFile(file.content).toString('hex');
  if (isFileStored) {
    const bucket = process.env.BUCKET_NAME;
    if (!bucket) throw new Error('No bucket found!');
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

  const { assetIndex, signer, cid } = nftToken;

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

  const asset_id = Number(assetIndex);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, size, ...rest } = token;
  return {
    ...rest,
    tokenUrl: `${ALGO_EXPLORER}/asset/${asset_id}`,
    folder: folderName ?? '',
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, folder_id, size, ...response } = token;
  return { ...response };
};

export const retrieveTokensService = async (search?: string) => {
  const tokens = await getTokens(search);
  const tokensResponse = tokens.map((token) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, folder_id, size, ...response } = token;
    return { ...response };
  });

  return tokensResponse;
};

export const retrieveTokenService = async (fileUUID: string) => {
  const token = await getToken(fileUUID);
  if (!token) return undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, folder_id, size, ...response } = token;
  return { ...response };
};
