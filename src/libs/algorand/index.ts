import { GENERAL_MESSAGES } from '@/config/messages/general-messages';
import { IS_OFFLINE } from '@/config';
import { algodClient } from '@/libs/algorand/config';
import algosdk from 'algosdk';
import { calculateSha256HexFromFile } from '@/utils/blockchain';
import { getSSMParameter } from '@/libs/aws/ssm';
import { retrieveAlgoAccountFromMnemonic } from '@/libs/algorand/utils';
import { uploadJsonToIpfs } from '@/libs/pinata-ipfs';

const getMnemonic = async () => {
  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) throw new Error(GENERAL_MESSAGES.MISSING_MNEMONIC);
  if (IS_OFFLINE) return mnemonic;
  return await getSSMParameter(mnemonic);
};

export const createNftTokenArc3 = async (
  name: string,
  assetName: string,
  description: string,
  fileStored: boolean,
  fileHash256: string
) => {
  const mnemonic = await getMnemonic();

  const { addr, sk } = retrieveAlgoAccountFromMnemonic(mnemonic);

  const metadata = {
    name,
    description,
    fileStored: fileStored ? 'true' : 'false',
    fileHash256,
  };

  const ipfsJson = await uploadJsonToIpfs(metadata);
  const cid = ipfsJson?.IpfsHash;

  const suggestedParams = await algodClient.getTransactionParams().do();

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    suggestedParams,
    sender: addr,
    defaultFrozen: false,
    unitName: 'FHP',
    assetName,
    manager: addr,
    reserve: addr,
    freeze: addr,
    clawback: addr,
    assetURL: `ipfs://${cid}#arc3`,
    assetMetadataHash: new Uint8Array(
      calculateSha256HexFromFile(Buffer.from(JSON.stringify(metadata))).buffer
    ),
    total: 1,
    decimals: 0,
  });

  const signedTxn = txn.signTxn(sk);
  await algodClient.sendRawTransaction(signedTxn).do();
  const result = await algosdk.waitForConfirmation(algodClient, txn.txID().toString(), 3);
  const { assetIndex } = result;
  return { assetIndex, cid, signer: addr.toString() };
};
