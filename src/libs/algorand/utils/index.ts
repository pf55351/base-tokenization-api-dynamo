import algosdk from 'algosdk';

export const retrieveAlgoAccountFromMnemonic = (mnemonic: string | undefined) => {
  if (!mnemonic) throw new Error('No menonic foud');
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  const { addr, sk } = account;
  return { addr, sk };
};
