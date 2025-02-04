import { GENERAL_MESSAGES } from '@/config/messages/general-messages';
import algosdk from 'algosdk';

export const retrieveAlgoAccountFromMnemonic = (mnemonic: string | undefined) => {
  if (!mnemonic) throw new Error(GENERAL_MESSAGES.MISSING_MNEMONIC);
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  const { addr, sk } = account;
  return { addr, sk };
};
