import algosdk from 'algosdk';

const algodToken = '';
const algodServer = process.env.ALGO_NODE;
//const algodPort = 443;

if (!algodServer) throw new Error('No Algo Node available');

export const algodClient = new algosdk.Algodv2(algodToken, algodServer);
