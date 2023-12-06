// src/utils/saveToIPFS.ts
import { create } from 'ipfs-http-client';
import crypto from 'crypto';

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

const algorithm = 'aes-256-cbc';

const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}.js`);

const key = Buffer.from(config.AES_ENCRYPTION_KEY, 'hex');

interface FileToSave {
  base64: string;
  name: string;
  dataType: string;
}

export interface SavedFileData {
  base64: string;
  name: string;
  dataType: string;
  ipfsCID: string;
}

const encryptBuffer = (buffer: Buffer, iv: Buffer): Buffer => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
};

export const saveFilesToIPFS = async (files: FileToSave[]): Promise<SavedFileData[]> => {
  let savedFiles: SavedFileData[] = [];

  for (const file of files) {
    const fileBuffer = Buffer.from(file.base64, 'base64');
    const fileIV = crypto.randomBytes(16);
    const encryptedBuffer = encryptBuffer(fileBuffer, fileIV);
    const dataWithIv = Buffer.concat([fileIV, encryptedBuffer]);
    const result = await ipfs.add(dataWithIv);
    savedFiles.push({
      base64: file.base64,
      name: file.name,
      dataType: file.dataType,
      ipfsCID: result.path
    });
  }

  


  return savedFiles;
};
