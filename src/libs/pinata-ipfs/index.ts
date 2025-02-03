import { IS_OFFLINE } from '@/config';
import { PinataSDK } from 'pinata-web3';
import { getSSMParameter } from '@/libs/aws/ssm';

type PinataJson<T> = Record<string, T>;

const PINATA_GATEWAY = process.env.PINATA_GATEWAY;

let pinata: PinataSDK;

const getPinataToken = async () => {
  const token = process.env.PINATA_JWT_TOKEN;
  if (!token) throw new Error('Pinata Token missing');
  if (IS_OFFLINE) return token;
  return await getSSMParameter(token);
};

const initPinataClient = async () => {
  if (pinata instanceof PinataSDK) return pinata;
  const pinataJWT = await getPinataToken();
  pinata = new PinataSDK({
    pinataJwt: pinataJWT,
    pinataGateway: PINATA_GATEWAY,
  });
  return pinata;
};

export const uploadJsonToIpfs = async <T>(metadata: PinataJson<T>) => {
  const pinataClient = await initPinataClient();
  const ipfsUploadedResult = await pinataClient.upload.json({
    ...metadata,
  });
  return ipfsUploadedResult;
};
