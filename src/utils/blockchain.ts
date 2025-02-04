import { GENERAL_MESSAGES } from '@/config/messages/general-messages';
import crypto from 'crypto';

export const calculateSha256HexFromFile = (content: Buffer) => {
  return crypto.createHash('sha256').update(content).digest();
};

export const foldSha256 = (sha256: string) => {
  // Converti la stringa esadecimale in un Uint8Array
  const sha256Bytes = Buffer.from(sha256, 'hex');

  if (sha256Bytes.length !== 32) {
    throw new Error(GENERAL_MESSAGES.INVALID_SHA);
  }

  // XOR tra i primi 16 byte e gli ultimi 16 byte
  const foldedBytes = Buffer.alloc(16);
  for (let i = 0; i < 16; i++) {
    foldedBytes[i] = sha256Bytes[i] ^ sha256Bytes[i + 16];
  }

  // Converti il risultato in stringa esadecimale
  return foldedBytes.toString('hex');
};
