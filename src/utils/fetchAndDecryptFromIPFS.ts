// src/utils/fetchAndDecryptFromIPFS.ts
import crypto from 'crypto';
import { CID } from 'multiformats/cid';
import { getHeliaInstance, initializeHelia } from './initHelia.js';
import { unixfs } from '@helia/unixfs';

const algorithm = 'aes-256-cbc';
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}.js`);

const AES_ENCRYPTION_KEY = config.AES_ENCRYPTION_KEY;
const key = Buffer.from(AES_ENCRYPTION_KEY, 'hex');

export const fetchFileFromIPFS = async (cidString: string): Promise<string> => {
  await initializeHelia();
  const helia = getHeliaInstance();
  if (!helia) {
    throw new Error("Helia is not initialized.");
  }
  let heliaFs = unixfs(helia);

  try { 
    let data: Buffer[] = [];
    const cid = CID.parse(cidString);
    for await (const chunk of heliaFs.cat(cid)) {
      data.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(data);
    await helia.stop();
    return decryptBuffer(buffer);
  } catch (error) {
    console.error(`Failed to fetch file from Helia with CID ${cidString}:`, error);
    throw new Error(`Failed to fetch file from Helia: ${error}`);
  }
};

const decryptBuffer = (buffer: Buffer): string => {
  if (buffer.length < 16) {
    throw new Error("Buffer too short for IV");
  }

  const iv = buffer.slice(0, 16);
  const encryptedData = buffer.slice(16);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  
  return decrypted.toString();
};