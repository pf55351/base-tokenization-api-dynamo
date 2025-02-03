import algosdk from 'algosdk';

const algodToken = '';
const algodServer = 'https://testnet-api.4160.nodely.dev';
const algodPort = 443;

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
